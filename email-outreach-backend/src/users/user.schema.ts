import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop({ type: String, default: null })
  resetPasswordToken?: string | null;

  @Prop({ type: Date, default: null })
  resetPasswordExpires?: Date | null;

  @Prop({ default: false })
  isOAuthUser: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
