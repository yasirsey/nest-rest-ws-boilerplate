import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, ObjectId, Types } from 'mongoose';

export type MessageDocument = HydratedDocument<Message>;

@Schema({
  timestamps: true,
})
export class Message extends Document {
  @Prop({ type: Types.ObjectId , ref: 'Room' })
  room: string;
  
  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  to: string;

  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  from: string;

  @Prop({ required: true })
  content: string;

  @Prop({ default: false })
  isRead: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
