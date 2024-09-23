import mongoose from "mongoose";
import { User as iUser } from "./user.entity";

export const userSchema = new mongoose.Schema<iUser>({
  firstName: String,
  lastName: String,
  username: String,
  picture: String,
  contoCorrenteId: { type: mongoose.Schema.Types.ObjectId, ref: "ContoCorrente", default: null }, //TODO: sistemare il tipo di contoCorrenteId
});


userSchema.virtual("isConfirmed").get(function () {
    return false;
  });

userSchema.set("toJSON", {
  virtuals: true,
  transform: (_, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

userSchema.set("toObject", {
  virtuals: true,
  transform: (_, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const User = mongoose.model<iUser>("User", userSchema);