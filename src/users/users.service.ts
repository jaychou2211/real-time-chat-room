import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from './repository/user-repository.interface';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_REPOSITORY') private readonly userRepository: IUserRepository
  ) {}

  async findOneByUsername(username: string) {
    return this.userRepository.findOneByUsername(username);
  }

  // 可以根據需要添加更多方法
}
