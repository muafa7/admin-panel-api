import { Controller, Get, Post, Put, Delete, Param, Body, NotFoundException, UseGuards, Request, HttpException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PostService } from './post.service';
import { Post as PostEntity } from './post.entity';
import { PostDto } from './dto/post.dto';

@Controller('posts')
export class PostController {
    constructor(private readonly postService: PostService) { }

    @Get()
    async findAll() {
        // get all posts in the db
        return await this.postService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: number): Promise<PostEntity> {
        // find the post with this id
        const post = await this.postService.findOne(id);

        // if the post doesn't exit in the db, throw a 404 error
        if (!post) {
            throw new NotFoundException(`This Post doesn't exist`);
        }

        // if post exist, return the post
        return post;
    }

    @UseGuards(AuthGuard('jwt'))
    @Post()
    async create(@Body() post: PostDto, @Request() req): Promise<any> {
        try {
            return await this.postService.create(post, req.user.id);
        } catch(err) {
            throw new HttpException(err, err.status_code || 500);
        }
        // create a new post and return the newly created post
    }

    @UseGuards(AuthGuard('jwt'))
    @Put(':id')
    async update(@Param('id') id: number, @Body() post: PostDto, @Request() req): Promise<PostEntity> {
        try {
            // get the number of row affected and the updated post
            console.log(id, req.user.id, post)
            const result = await this.postService.update(id, post, req.user.id);
    
            // if the number of row affected is zero, 
            // it means the post doesn't exist in our db
            if (result.numberOfAffectedRows === 0) {
                throw new HttpException(
                  {
                    code: 'failed_update_post',
                    message: `This Post doesn't exist`,
                  },
                  400
                );
            }
    
            // return the updated post
            return result.updatedPost;
        } catch(err) {
            throw new HttpException(err, err.status_code || 500);
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    async remove(@Param('id') id: number, @Request() req) {
        // delete the post with this id
        const deleted = await this.postService.delete(id, req.user.id);

        // if the number of row affected is zero, 
        // then the post doesn't exist in our db
        if (deleted === 0) {
            throw new NotFoundException('This Post doesn\'t exist');
        }

        // return success message
        return 'Successfully deleted';
    }
}