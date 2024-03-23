import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Post } from './post.entity';
import { PostService } from './post.service';
import { PostController } from './post.controller';

@Module({
    imports:[
      SequelizeModule.forFeature([Post])
    ],
    providers: [PostService],
    exports:[PostService],
    controllers:[PostController]
  })
export class PostModule {}
