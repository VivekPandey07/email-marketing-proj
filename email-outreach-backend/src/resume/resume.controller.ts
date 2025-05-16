import { 
  Controller, 
  Post, 
  Body, 
  Get, 
  Param, 
  UseGuards,
  Delete,
  Put
} from '@nestjs/common';
import { ResumeService } from './resume.service';
import { CreateUpdateResumeDto } from './dto/create-update-resume.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('resume')
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() dto: CreateUpdateResumeDto) {
    const result = await this.resumeService.create(dto);
    return { 
      message: 'Resume created successfully', 
      resume: result 
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: CreateUpdateResumeDto
  ) {
    const result = await this.resumeService.update(id, dto);
    return { 
      message: 'Resume updated successfully', 
      resume: result 
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:userId')
  async getByUser(@Param('userId') userId: string) {
    const resumes = await this.resumeService.getByUserId(userId);
    return {
      message: 'Resumes fetched successfully',
      count: resumes.length,
      resumes
    };
  }

  // @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getById(@Param('id') id: string) {
    const resume = await this.resumeService.getById(id);
    return {
      message: 'Resume fetched successfully',
      resume
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('public/:publicId')
  async getByPublic(@Param('publicId') publicId: string) {
    const resume = await this.resumeService.getByPublicId(publicId);
    return {
      message: 'Resume fetched successfully',
      resume
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.resumeService.delete(id);
    return { message: 'Resume deleted successfully' };
  }
}