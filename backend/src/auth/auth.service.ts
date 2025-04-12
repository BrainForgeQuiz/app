import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { UserTable } from '../db/schema/user';
import { eq } from 'drizzle-orm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entity/user';
import { UserInDBResponse } from '../responses/db.response';

@Injectable()
export class AuthService {
  constructor(
    private readonly dbService: DbService,
    private readonly jwtService: JwtService,
  ) {}

  async findUser(username: string): Promise<UserInDBResponse> {
    const users = await this.dbService.db
      .select()
      .from(UserTable)
      .where(eq(UserTable.username, username))
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

  async singUp(
    username: string,
    password: string,
  ): Promise<{ access_token: string }> {
    return { access_token: 'Alma' };
  }

  /**
   * Login
   * @description the function for login
   * @param {string} username - username for the user
   * @param {string} password - password for the user
   * @return {Promise<{ access_token: string}>}
   */
  async signIn(
    username: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const userData: UserInDBResponse = await this.findUser(username);
    if (userData.inDb) {
      if (userData.user) {
        const user: User = userData.user;
        if (user.password == password) {
          const payload = { sub: user.id, username: user.username };
          return {
            access_token: await this.jwtService.signAsync(payload),
          };
        }
      }
      throw new Error('Wrong password');
    }
    throw new Error('No user found');
  }
}
