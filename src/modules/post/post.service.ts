import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Post } from './post.entity';
import { PostDto } from './dto/post.dto';
import { User } from '../user/user.entity';

@Injectable()
export class PostService {
    constructor(@InjectModel(Post) private readonly postRepository: typeof Post) { }

    async create(post: PostDto, userId): Promise<Post> {
        try{
            const result = await this.postRepository.create<Post>({ ...post, userId });

            return result.get()
        } catch(err) {
            return Promise.reject(err);
        }
    }

    async findAll(): Promise<Post[]> {
        return await this.postRepository.findAll<Post>({
        	include: [{ model: User, attributes: { exclude: ['password'] } }],
    	});
    }

    async findOne(id): Promise<Post> {
        return await this.postRepository.findOne({
        	where: { id },
        	include: [{ model: User, attributes: { exclude: ['password'] } }],
    	});
    }

    async delete(id, userId) {
        return await this.postRepository.destroy({ where: { id, userId } });
    }

    async update(id, data, userId) {
        try {
            const [numberOfAffectedRows, _] = await this.postRepository.update({ ...data }, { where: { id, userId }, returning: true });
            const updatedPost = await this.findOne(id)
            return { numberOfAffectedRows,  updatedPost};
        } catch(err) {
            return Promise.reject(err);
        }
    }
}