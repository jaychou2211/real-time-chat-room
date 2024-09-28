import { Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportLocalGuard } from './guards/passport-local.guard';
import { PassportJwtGuard } from './guards/passport-jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) { }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @UseGuards(PassportLocalGuard)
  async login(@Request() request) {
    return this.authService.signIn(request.user);
  }

  @Get('me')
  // @UseGuards(AuthGuard)
  @UseGuards(PassportJwtGuard)
  getUserInfo(@Request() req) {
    return req.user;
  }
}
