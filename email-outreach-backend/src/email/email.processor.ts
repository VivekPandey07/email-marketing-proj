import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { EmailService } from './email.service';
import * as nodemailer from 'nodemailer';

@Processor('emailQueue')
export class EmailProcessor {
  constructor(private readonly emailService: EmailService) {}

  @Process('sendEmailJob')
  async handleSendEmail(job: Job) {
    const { name, email } = job.data;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Email Campaign',
        text: `Hello ${name}, this is a test email campaign!`,
      });

      await this.emailService.updateEmailStatus(email, 'sent');
    } catch (error) {
      await this.emailService.updateEmailStatus(email, 'failed', error.message);
    }
  }
}
