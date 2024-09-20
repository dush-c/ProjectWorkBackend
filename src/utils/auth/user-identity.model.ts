import mongoose, { Schema } from "mongoose";
import { UserIdentity } from "./user-identity.entity";

const userIdentitySchema = new mongoose.Schema<UserIdentity>({
  provider: { type: String, default: "local" },
  credentials: {
    type: { username: String, hashedPassword: String },
  },
  user: { type: Schema.Types.ObjectId, ref: "User" },
});

export const UserIdentityModel = mongoose.model<UserIdentity>(
  "UserIdentity",
  userIdentitySchema
);
