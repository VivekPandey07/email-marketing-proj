import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ResumeService } from './resume.service';
import { Resume, ResumeSchema } from './resume.schema';
import { ResumeController } from './resume.controller';
import { OpenAIService } from './openai.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Resume.name, schema: ResumeSchema }])],
  controllers: [ResumeController],
  providers: [ResumeService, OpenAIService],
  exports: [ResumeService]
})
export class ResumeModule {}
