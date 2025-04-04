import { Injectable } from '@nestjs/common';
import { LoginDto } from './login.dt';
import { PrismaService } from 'src/prisma/prisma.service';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prismaService: PrismaService,
  ) {}
  async login(loginDto: LoginDto) {
    const user = await this.prismaService.user.findUnique({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = bcrypt.compareSync(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new Error('Invalid Credentials');
    }

    const token = this.jwtService.sign({
      name: user.name,
      email: user.email,
      role: user.role,
      sub: user.id,
    });

    // console.log(user);
    return { access_token: token };
  }
}
