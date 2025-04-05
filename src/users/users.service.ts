import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import bcrypt from 'bcrypt';
import { CaslAbilityService } from 'src/casl/casl-ability/casl-ability.service';

@Injectable()
export class UsersService {
  constructor(
    private prismaService: PrismaService,
    private abilityService: CaslAbilityService,
  ) {}
  create(createUserDto: CreateUserDto) {
    const ability = this.abilityService.ability;

    if (!ability.can('create', 'User')) {
      // console.log('Deu Certo');
      throw new Error('Unauthorized');
    }
    return this.prismaService.user.create({
      data: {
        ...createUserDto,
        password: bcrypt.hashSync(createUserDto.password, 10), //salt
      },
    });
  }

  findAll() {
    return this.prismaService.user.findMany();
  }
  findOne(id: string) {
    return this.prismaService.user.findUnique({
      where: { id },
    });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.prismaService.user.update({
      where: { id },
      data: updateUserDto, // ver se tem password e aplicar o has
    });
  }

  remove(id: string) {
    return this.prismaService.user.delete({
      where: { id },
    });
  }
}
