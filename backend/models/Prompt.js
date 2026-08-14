import mongoose from "mongoose";

const CATEGORIES = [
  "Coding",
  "Marketing",
  "Content Writing",
  "Email",
  "Resume",
  "SQL",
  "Design",
  "Social Media",
  "Productivity",
  "Others",
];

const promptSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: 150,
    },
    content: {
      type: String,
      required: [true, "Prompt content is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: CATEGORIES,
      default: "Others",
    },
    tags: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: { createdAt: "createdDate", updatedAt: "lastUpdatedDate" },
  }
);

promptSchema.statics.CATEGORIES = CATEGORIES;

export default mongoose.model("Prompt", promptSchema);
