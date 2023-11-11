import mongoose, { Schema } from "mongoose";

interface IUserTocerti {
  certiId: Schema.Types.ObjectId;
  student: Schema.Types.ObjectId;
  blockchainData: {
    privacyPdfFile: string;
    publicPdfFile: string;
    nftMetadata: string;
    certiHash: string;
  };
  publicbstatus: boolean;
  privacybstatus: boolean;
}

const userTocertiSchema = new Schema<IUserTocerti>({
  certiId: {
    type: Schema.Types.ObjectId,
    ref: "Certification",
  },
  student: {
    type: Schema.Types.ObjectId,
    ref: "UserModel",
  },
  blockchainData: {
    publicPdfFile: {
      type: String,
    },
    privacyPdfFile: {
      type: String,
    },
    nftMetadata: {
      type: String,
    },
    certiHash: {
      type: String,
    },
  },
  publicbstatus: {
    type: Boolean,
    default: false,
  },
  privacybstatus: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model<IUserTocerti>(
  "Usertocertistatus",
  userTocertiSchema
);
