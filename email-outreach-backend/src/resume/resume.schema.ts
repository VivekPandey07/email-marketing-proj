// src/resume/schemas/resume.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Define Skill interface
class Skill {
  @Prop({ required: true })
  name: string;

  @Prop()
  level: string;

  @Prop()
  yearsOfExperience: string;
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

  @Prop({ type: [Object], default: [] })
  education: Record<string, any>[];

  @Prop({ type: [Object], default: [] })
  projects: Record<string, any>[];

  @Prop({ type: [Skill], default: [] }) // Update this line
  skills: Skill[];

  @Prop()
  summary: string;
}

export const ResumeSchema = SchemaFactory.createForClass(Resume);