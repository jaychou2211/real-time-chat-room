import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

type AuthInput = {
  username: string;
  password: string;
}

type SignInData = {
  id: string;
  username: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) { }

  async authenticate(input: AuthInput) {
    const user = await this.usersService.findOneByUsername(input.username);
    if (!user) throw new UnauthorizedException;
    return this.signIn(user);
  }

  async validateUser({ username, password }: {
    username: string,
    password: string
  }) {
    const user = await this.usersService.findOneByUsername(username);

    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async signIn(user: SignInData) {
    const tokenPayload = {
      username: user.username,
      sub: user.id
    };

    const accessToken = this.jwtService.sign(tokenPayload);
    return { accessToken, username: user.username, id: user.id };
  }

}
