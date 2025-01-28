import { Controller, Post, UseGuards, UseInterceptors, UploadedFile, Get } from '@nestjs/common';
import { EmailService } from './email.service';
import { FileInterceptor } from '@nestjs/platform-express';
import * as csvParser from 'csv-parser';
import { Readable } from 'stream';
import { Express } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // ✅ Import JWT Guard

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('upload-csv')
  @UseGuards(JwtAuthGuard) // 🔐 Protect route
  @UseInterceptors(FileInterceptor('file'))
  async uploadCSV(@UploadedFile() file: Express.Multer.File) {
    const emails: any = [];

    return new Promise((resolve, reject) => {
      const stream = Readable.from(file.buffer.toString().split('\n'));
      stream
        .pipe(csvParser())
        .on('data', (data) => emails.push({ name: data.name, email: data.email }))
        .on('end', async () => {
          const result = await this.emailService.uploadCSVData(emails);
          resolve(result);
        })
        .on('error', (error) => reject(error));
    });
  }

  @Post('send-emails')
  @UseGuards(JwtAuthGuard) // 🔐 Protect route
  async sendEmails() {
    return await this.emailService.sendEmails();
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard) // 🔐 Protect route
  async getEmailStats() {
    console.log("Entered")
    return await this.emailService.getEmailStats();
  }
}
