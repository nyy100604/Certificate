import mongoose, { Schema, Model } from "mongoose";
import multer from "multer";
import path from "path";

interface ICerti {
  title: string;
  file: string;
  desc: string;
  issuerId: Schema.Types.ObjectId;
  students: Array<string>;
  issuer: string;
}

interface ICertiMethods {}

type CertiModel = Model<ICerti, {}, ICertiMethods>;

const certificationSchema = new Schema<ICerti, CertiModel, ICertiMethods>({
  title: {
    type: String,
    minlength: 2,
    maxlength: 30,
    require: true,
  },
  file: {
    type: String,
  },
  desc: {
    type: String,
    minlength: 0,
    require: true,
  },
  issuerId: {
    type: Schema.Types.ObjectId,
    ref: "UserModel",
  },
  issuer: {
    type: String,
  },
  students: {
    type: [String],
    default: [],
  },
});

export default mongoose.model("Certification", certificationSchema);
