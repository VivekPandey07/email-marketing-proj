import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Email, EmailDocument } from './schemas/email.schema';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class EmailService {
  constructor(
    @InjectModel(Email.name) private emailModel: Model<EmailDocument>,
    @InjectQueue('emailQueue') private emailQueue: Queue
  ) {}

  async uploadCSVData(data: { name: string; email: string }[]) {
    await this.emailModel.insertMany(data);
    return { message: 'CSV data uploaded successfully!' };
  }

  async sendEmails() {
    const emails = await this.emailModel.find({ status: 'pending' });
    emails.forEach(async (email) => {
      await this.emailQueue.add('sendEmailJob', email);
    });
    return { message: 'Emails added to queue for processing!' };
  }

  async getEmailStats() {
    console.log("entered Here")
    const totalEmails = await this.emailModel.countDocuments();
    const sentEmails = await this.emailModel.countDocuments({ status: 'sent' });
    const failedEmails = await this.emailModel.countDocuments({ status: 'failed' });

    return { totalEmails, sentEmails, failedEmails };
  }

  async updateEmailStatus( email: string, status: string, error?: string ): Promise<any>  {
    await this.emailModel.updateOne(
      { email }, 
      { $set: { status, error: error || null } } 
    );
  
    return { message: `Email status updated to '${status}' for ${email}` };
  }
  
}
