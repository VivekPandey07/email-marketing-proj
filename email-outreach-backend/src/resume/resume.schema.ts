// src/resume/schemas/resume.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

class Skill {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  level: string;
}

class Experience {
  @Prop({ required: true })
  jobTitle: string;

  @Prop({ required: true })
  company: string;

  @Prop()
  description: string;

  @Prop()
  startDate: string;

  @Prop()
  endDate: string;
}

@Schema({ timestamps: true })
export class Resume extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true, unique: true })
  publicId: string;

  @Prop()
  title: string;

  @Prop()
  fullName: string;

  @Prop()
  email: string;

  @Prop()
  phone: string;

  @Prop()
  location: string;

  @Prop()
  githubUrl: string;

  @Prop()
  linkedInUrl: string;

  @Prop()
  portfolioUrl: string;

  @Prop({ type: [Object], default: [] })
  education: Record<string, any>[];

  @Prop({ type: [Object], default: [] })
  projects: Record<string, any>[];

  @Prop({ type: [Skill], default: [] })
  skills: Skill[];

  @Prop({ type: [Experience], default: [] })
  experience: Experience[];

  @Prop()
  summary: string;
}

export const ResumeSchema = SchemaFactory.createForClass(Resume);
