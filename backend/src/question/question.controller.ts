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
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createQuestionDto: CreateQuestionDto, @Req() req: Request) {
    if (!req.user) {
      return {
        success: false,
        error: 'User not found',
      };
    }
    return this.questionService.create(createQuestionDto, req.user.id);
  }

  @Get(':id')
  findAll(@Param('id') id: string) {
    return this.questionService.findAllForQuiz(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.questionService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateQuestionDto: UpdateQuestionDto,
    @Req() req: Request,
  ) {
    if (!req.user) {
      return {
        success: false,
        error: 'User not found',
      };
    }
    return this.questionService.update(id, updateQuestionDto, req.user.id);
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
    return this.questionService.remove(id, req.user.id);
  }
}
