import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.entity';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User) 
        private readonly userRepository: typeof User) { }

    async create(user: UserDto): Promise<User> {
        const [result, created] = await this.userRepository.findOrCreate({
            where: { email: user.email},
            defaults: {...user}
        })

        if(!created) {
            return Promise.reject({
                code: 'failed_to_create',
                message: 'Email already exist',
              });
        } else {
            return result
        }
    }

    async findOneByEmail(email: string): Promise<User> {
        return await this.userRepository.findOne<User>({ where: { email } });
    }

    async findOneById(id: number): Promise<User> {
        return await this.userRepository.findOne<User>({ where: { id } });
    }
}