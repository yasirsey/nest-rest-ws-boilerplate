import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Message extends Document {
  @Prop({ type: Types.ObjectId , ref: 'Room' })
  room: string;
  
  @Prop({ required: true, ref: 'User' })
  to: string;

  @Prop({ required: true, ref: 'User' })
  from: string;

  @Prop({ required: true })
  content: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
