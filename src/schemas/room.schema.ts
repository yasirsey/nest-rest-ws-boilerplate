import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from 'mongoose';

@Schema({
    timestamps: true,
})
export class Room extends Document {
    @Prop({ required: true })
    name: string;

    @Prop({ type: Types.ObjectId , ref: 'User', default: [] })
    members: string[];

    @Prop({ type: Types.ObjectId , ref: 'Message', default: [] })
    messages: string[];
}

export const RoomSchema = SchemaFactory.createForClass(Room);
