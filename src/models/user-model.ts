import mongoose, { Model } from "mongoose";
import { Schema } from "mongoose";
import bcrypt from "bcrypt";

interface IUser {
  email: string;
  username: string;
  password: string;
  address: string;
  role: string;
  date: Date;
}
interface IUserMethods {
  comparePassword(
    password: string,
    cb: (err: Error | null, resultP: boolean) => void
  ): void;
  isStudent(): boolean;
  isIssuer(): boolean;
}
export type UserModel = Model<IUser, {}, IUserMethods>;

const userSchema = new Schema<IUser, UserModel, IUserMethods>({
  username: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    minlength: 7,
    maxlength: 50,
  },

  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
  },
  address: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  role: {
    type: String,
    enum: ["issuer", "student"],
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

userSchema.method("isStudent", function isStudent() {
  return this.role == "student";
});

userSchema.method("isIssuer", function isIssuer() {
  return this.role == "issuer";
});

userSchema.method(
  "comparePassword",
  async function (
    password: string,
    cb: (err: Error | null, resultP: boolean) => void
  ) {
    let result: boolean | undefined;
    try {
      result = await bcrypt.compare(password, this.password);
      return cb(null, result);
    } catch (e) {
      return cb(e as Error, result as boolean);
    }
  }
);

//若使用者為新或正在更改密碼的話，則進行hash處理
userSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("password")) {
    const hashValue = await bcrypt.hash(this.password, 10);
    this.password = hashValue;
  }
  next();
});

export default mongoose.model<IUser, UserModel>("UserModel", userSchema);
