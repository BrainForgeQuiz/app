import { Inject, Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { UserTable } from '../db/schema/user';
import { eq, or } from 'drizzle-orm';
import { JwtService } from '@nestjs/jwt';
import { UserInDBResponse } from '../responses/db.response';
import { TokenResponse } from '../responses/token.response';
import { hash, genSalt, compare } from 'bcrypt';
import refConfig from './config/ref.config';
import { ConfigType } from '@nestjs/config';
import Response from '../responses/response';

@Injectable()
export class AuthService {
  constructor(
    private readonly dbService: DbService,
    private readonly jwtService: JwtService,
    @Inject(refConfig.KEY)
    private readonly refConfigOp: ConfigType<typeof refConfig>,
  ) {}

  async getUser(userId: string) {
    const user = await this.dbService.db
      .select({
        id: UserTable.id,
        username: UserTable.username,
        email: UserTable.email,
        points: UserTable.points,
      })
      .from(UserTable)
      .where(eq(UserTable.id, userId))
      .execute();
    if (user.length === 0) {
      return {
        success: false,
        error: 'User not found',
        data: null,
      };
    }
    return {
      success: true,
      data: user[0],
    };
  }

  async allUSer() {
    const users = await this.dbService.db.select().from(UserTable).execute();
    console.log('users:', users);
  }

  /**
   *  Find User In DB
   *  @description this fuc is using the dbService to find if user is in the UserTable
   *  @param {string} username - this is the user that you are searching for
   *  @param {string} email - this is an optional parameter, if you want to find user by email
   *  @return {UserInDBResponse} - based on this you can proceed with your logic
   */
  async findUser(username: string, email?: string): Promise<UserInDBResponse> {
    await this.allUSer();
    const filter = email
      ? or(eq(UserTable.username, username), eq(UserTable.email, email))
      : eq(UserTable.username, username);
    console.log('filter:', filter);
    const users = await this.dbService.db
      .select()
      .from(UserTable)
      .where(filter)
      .execute();
    console.log('users:', users);
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
   * @return {Promise<Response>} - this variable helps you to test if user was saved
   */
  async saveUser(
    username: string,
    password: string,
    email: string,
  ): Promise<Response> {
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
    return {
      success: false,
      error: 'User was not saved',
    };
  }

  /**
   * Generate Token
   * @description this function is using the jwtService to generate the token for the user
   * @return {string} - this variable helps you to test if token was created
   * @param userId
   * @param username
   */
  async refToken(userId: string, username: string): Promise<TokenResponse> {
    const payload = { sub: userId, username: username };
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
   * @param {string} userId - user id for the token
   * @param {string} username - username for the token
   * @return {Promise<TokenResponse>} - this variable helps you to test if token was created
   */
  async tokenGen(userId: string, username: string): Promise<TokenResponse> {
    const payload = { sub: userId, username: username };
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
   * @return {Promise<Response>} - this variable helps you to test if user was saved
   */
  async singUp(
    username: string,
    password: string,
    email: string,
  ): Promise<Response> {
    const userRes: UserInDBResponse = await this.findUser(username, email);
    if (userRes.inDb) {
      return {
        success: false,
        error: 'User already exists',
      };
    }
    const hashedPassword = await this.hashPassword(password);
    return await this.saveUser(username, hashedPassword, email);
  }

  /**
   * Login
   * @description the function for login
   * @param {string} username - username for the user
   * @param {string} password - password for the user
   * @return {Promise<Response>}
   */
  async signIn(username: string, password: string): Promise<Response> {
    const userData: UserInDBResponse = await this.findUser(username);
    console.log('userData:', userData);
    if (!userData.user) {
      return {
        success: false,
        error: 'User data not found',
        data: null,
      };
    }
    const validateUser: boolean = await this.comparePassword(
      password,
      userData.user.password,
    );
    if (!validateUser) {
      return {
        success: false,
        error: 'Invalid credentials',
        data: null,
      };
    }
    const user = {
      id: userData.user.id,
      username: userData.user.username,
    };
    return {
      success: true,
      data: user,
    };
  }
}
