import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserRepository } from './repository/user-repository';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [
    UsersService,
    {
      provide: 'USER_REPOSITORY',
      useClass: UserRepository
    }
  ],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
