import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Resume } from './resume.schema';
import { Model } from 'mongoose';
import { CreateUpdateResumeDto } from './dto/create-update-resume.dto';
import { randomBytes } from 'crypto';

@Injectable()
export class ResumeService {
  constructor(@InjectModel(Resume.name) private resumeModel: Model<Resume>) {}

  async create(dto: CreateUpdateResumeDto) {
    const publicId = randomBytes(16).toString('hex');
    return await this.resumeModel.create({ 
      ...dto, 
      publicId,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  async update(id: string, dto: CreateUpdateResumeDto) {
    return await this.resumeModel.findByIdAndUpdate(
      id,
      { ...dto, updatedAt: new Date() },
      { new: true } // Return the updated document
    );
  }

  async getByUserId(userId: string) {
    return this.resumeModel.find({ userId }).sort({ createdAt: -1 }); // Newest first
  }

  async getById(id: string) {
    return this.resumeModel.findById(id);
  }

  async getByPublicId(publicId: string) {
    return this.resumeModel.findOne({ publicId });
  }

  async delete(id: string) {
    return this.resumeModel.findByIdAndDelete(id);
  }
}