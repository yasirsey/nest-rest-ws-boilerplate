import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Gender } from 'src/enums/gender.enum';
import { Role } from 'src/enums/role.enum';
import * as bcrypt from 'bcrypt';
import { UserDto } from 'src/schemas/dto/user.dto';

export type UserDocument = HydratedDocument<User>;

@Schema({
    timestamps: true,
})
export class User {
    @Prop({ required: true })
    fullName: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop()
    bio: string;

    @Prop({ required: true })
    password: string;

    @Prop({ type: [String], enum: Role, default: [Role.User] })
    roles: string[];

    @Prop({ required: true, enum: Gender })
    gender: string;

    @Prop()
    profilePhoto: string;

    @Prop({ default: false })
    isOnline: boolean;

    @Prop()
    lastOnline: Date;

    comparePassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password);
    }

    toModel(this: UserDocument) {
        return new UserDto(this);
    }
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.comparePassword = User.prototype.comparePassword;

UserSchema.methods.toModel = User.prototype.toModel;

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    this.password = await bcrypt.hash(this.password, 10);
    next();
});
