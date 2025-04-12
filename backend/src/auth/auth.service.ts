import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { UserTable } from '../db/schema/user';
import { eq } from 'drizzle-orm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly dbService: DbService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(
    username: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    const users = await this.dbService.db
      .select()
      .from(UserTable)
      .where(eq(UserTable.username, username));
    if (users.length > 0) {
      if (users[0].password == pass) {
        const payload = { sub: users[0].id, username: users[0].username };
        return {
          access_token: await this.jwtService.signAsync(payload),
        };
      }
      throw new UnauthorizedException('Nem jó felhasználónév / jelszó');
    }
    throw new UnauthorizedException('nem engedélyezett!');
  }

  async login(loginDto: any): Promise<any> {
    // Implement your login logic here
    console.log('Login DTO:', loginDto);
    const user = await this.dbService.db
      .select()
      .from(UserTable)
      .where(eq(UserTable.email, 'alma'))
      .execute();
    console.log(user);
    throw new Error('Login not implemented');
  }
}
