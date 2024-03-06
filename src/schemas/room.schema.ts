import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { User } from "./user.schema";

export type RoomDocument = HydratedDocument<Room>;

@Schema({
    timestamps: true,
})
export class Room extends Document {
    @Prop({ required: true })
    name: string;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
    members: User[];

    @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
    messages: User[];
}

export const RoomSchema = SchemaFactory.createForClass(Room);
