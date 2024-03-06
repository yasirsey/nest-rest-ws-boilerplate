import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import { Room } from './room.schema';
import { User } from './user.schema';

export type MessageDocument = HydratedDocument<Message>;

@Schema({
  timestamps: true,
})
export class Message extends Document {
  @Prop({ type: Types.ObjectId, required: true, ref: 'Room' })
  room: Room;
  
  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  to: User;

  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  from: User;

  @Prop({ required: true })
  content: string;

  @Prop({ default: false })
  isRead: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
