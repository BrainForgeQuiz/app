import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { UserTable } from '../db/schema/user';
import { eq, or } from 'drizzle-orm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entity/user';
import { SaveUserResponse, UserInDBResponse } from '../responses/db.response';
import { TokenResponse } from '../responses/token.response';
import { hash, genSalt } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly dbService: DbService,
    private readonly jwtService: JwtService,
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
    const userRes = await this.findUser(username, email);
    if (userRes.inDb) {
      throw new Error('User Already in db');
    }
    const res: SaveUserResponse = await this.saveUser(
      username,
      password,
      email,
    );
    if (!res.success) {
      throw new Error('User was not saved');
    }
    const userData: UserInDBResponse = await this.findUser(username);
    if (!userData.inDb) {
      throw new Error('User was not found');
    }
    if (!userData.user) {
      throw new Error('User was not found');
    }
    const user: User = userData.user;
    const payload = { sub: user.id, username: user.username };
    const token: string = await this.jwtService.signAsync(payload);
    if (!token) {
      throw new Error('Token was not created');
    }
    return { token: token };
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
        if (user.password == password) {
          const payload = { sub: user.id, username: user.username };
          return {
            token: await this.jwtService.signAsync(payload),
          };
        }
        throw new Error('Wrong password');
      }
      throw new Error(
        'Idk how you have done that, but user is in DB, but user has no data',
      );
    }
    throw new Error('No user found');
  }
}
