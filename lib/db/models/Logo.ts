import mongoose from "mongoose";

const logoSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    slogan: String,
    industry: {
      type: String,
      required: true,
    },
    logoData: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    thumbnail: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const Logo = mongoose.models.Logo || mongoose.model("Logo", logoSchema);