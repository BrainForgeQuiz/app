import { Inject, Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { UserTable } from '../db/schema/user';
import { eq, or } from 'drizzle-orm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entity/user';
import { SaveUserResponse, UserInDBResponse } from '../responses/db.response';
import { TokenResponse } from '../responses/token.response';
import { hash, genSalt, compare } from 'bcrypt';
import refConfig from './config/ref.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly dbService: DbService,
    private readonly jwtService: JwtService,
    @Inject(refConfig.KEY)
    private readonly refConfigOp: ConfigType<typeof refConfig>,
  ) {}

  /**
   *  Find User In DB
   *  @description this fuc is using the dbService to find if user is in the UserTable
   *  @param {string} username - this is the user that you are searching for
   *  @param {string} email - this is an optional parameter, if you want to find user by email
   *  @return {UserInDBResponse} - based on this you can proceed with your logic
   */
  async findUser(username: string, email?: string): Promise<UserInDBResponse> {
    const filter = email
      ? or(eq(UserTable.username, username), eq(UserTable.email, email))
      : eq(UserTable.username, username);
    const users = await this.dbService.db
      .select()
      .from(UserTable)
      .where(filter)
      .execute();
    if (users.length > 0) {
      return {
        inDb: true,
        user: users[0],
      };
    }
    return {
      inDb: false,
    };
  }

  /**
   * Hash Password
   * @description this function is using the bcrypt to hash the password
   * @param {string} password - password for the user
   * @return {Promise<string>} - hashed password
   */
  async hashPassword(password: string): Promise<string> {
    const salt = await genSalt(10);
    return hash(password, salt);
  }

  /**
   * Compare Password
   * @description this function is using the bcrypt to compare the password
   * @param {string} password - password for the user
   * @param {string} hashedPassword - hashed password for the user
   * @return {Promise<boolean>} - this variable helps you to test if password is correct
   */
  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await compare(password, hashedPassword);
  }

  /**
   * Save User
   * @description this function is using the dbService to save the user in the UserTable
   * @param {string} username - username for the user
   * @param {string} password - password for the user
   * @param {string} email - email for the user
   * @return {Promise<SaveUserResponse>} - this variable helps you to test if user was saved
   */
  async saveUser(
    username: string,
    password: string,
    email: string,
  ): Promise<SaveUserResponse> {
    const res: { id: string }[] = await this.dbService.db
      .insert(UserTable)
      .values({ username: username, password: password, email: email })
      .returning({ id: UserTable.id })
      .execute();
    if (res.length > 0) {
      return {
        success: true,
      };
    }
    throw new Error('User was not saved');
  }

  /**
   * Generate Token
   * @description this function is using the jwtService to generate the token for the user
   * @param {User} user - user for the token
   * @return {string} - this variable helps you to test if token was created
   */
  async refToken(user: User): Promise<TokenResponse> {
    const payload = { sub: user.id, username: user.username };
    const token = await this.jwtService.signAsync(payload);
    if (!token) {
      return {
        success: false,
        error: 'Token was not created',
        data: null,
      };
    }
    return {
      success: true,
      data: {
        token: token,
      },
    };
  }

  /**
   * Token Generation
   * @description this function is using the jwtService to generate the token for the user
   * @param {User} user - user for the token
   * @return {Promise<TokenResponse>} - this variable helps you to test if token was created
   */
  async tokenGen(user: User): Promise<TokenResponse> {
    const payload = { sub: user.id, username: user.username };
    const token = await this.jwtService.signAsync(payload);
    const refToken = await this.jwtService.signAsync(payload, this.refConfigOp);
    if (!token || !refToken) {
      return {
        success: false,
        error: 'Token was not created',
        data: null,
      };
    }
    return {
      success: true,
      data: {
        token,
        refToken,
      },
    };
  }

  /**
   * Sign Up
   * @description the function for sign up
   * @param {string} username - username for the user
   * @param {string} password - password for the user
   * @param {string} email - email for the user
   * @return {Promise<TokenResponse>} - this variable helps you to test if user was saved
   */
  async singUp(
    username: string,
    password: string,
    email: string,
  ): Promise<TokenResponse> {
    const userRes: UserInDBResponse = await this.findUser(username, email);
    if (userRes.inDb) {
      return {
        success: false,
        error: 'User already exists',
        data: null,
      };
    }
    const hashedPassword = await this.hashPassword(password);
    const res: SaveUserResponse = await this.saveUser(
      username,
      hashedPassword,
      email,
    );
    if (!res.success) {
      return {
        success: false,
        error: 'User was not saved',
        data: null,
      };
    }
    const userData: UserInDBResponse = await this.findUser(username);
    if (!userData.inDb) {
      return {
        success: false,
        error: 'User was not saved',
        data: null,
      };
    }
    if (!userData.user) {
      return {
        success: false,
        error: 'No user was saved',
        data: null,
      };
    }
    return await this.tokenGen(userData.user);
  }

  /**
   * Login
   * @description the function for login
   * @param {string} username - username for the user
   * @param {string} password - password for the user
   * @return {Promise<TokenResponse>}
   */
  async signIn(username: string, password: string): Promise<TokenResponse> {
    const userData: UserInDBResponse = await this.findUser(username);
    if (userData.inDb) {
      if (userData.user) {
        const user: User = userData.user;
        const validateUser: boolean = await this.comparePassword(
          password,
          user.password,
        );
        if (validateUser) {
          return await this.tokenGen(user);
        }
        return {
          success: false,
          error: 'Invalid credentials',
          data: null,
        };
      }
      return {
        success: false,
        error: 'User data not found',
        data: null,
      };
    }
    return {
      success: false,
      error: 'User was not found',
      data: null,
    };
  }
}
