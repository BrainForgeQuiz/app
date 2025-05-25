import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { QuizService } from './quiz.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createQuizDto: CreateQuizDto, @Req() req: Request) {
    console.log('createQuizDto:', createQuizDto);
    console.log('req.user:', req.user);
    if (!req.user) {
      return {
        success: false,
        error: 'User not found',
      };
    }
    return this.quizService.create(createQuizDto, req.user?.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  findAllForUser(@Req() req: Request) {
    if (!req.user) {
      return {
        success: false,
        error: 'User not found',
      };
    }
    return this.quizService.findOneByUserId(req.user.id);
  }

  @Get()
  findAll() {
    return this.quizService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quizService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateQuizDto: UpdateQuizDto,
    @Req() req: Request,
  ) {
    if (!req.user) {
      return {
        success: false,
        error: 'User not found',
      };
    }
    return this.quizService.update(id, updateQuizDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    if (!req.user) {
      return {
        success: false,
        error: 'User not found',
      };
    }
    return this.quizService.remove(id, req.user.id);
  }
}
