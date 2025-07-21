import mongoose, { Schema } from "mongoose";

const noteSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,     
    },
    content: {
      type: String,
      required: true,     
    },
    tags: {
      type: [String],
      default: [],         
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,     
    },
  },
  {
    timestamps: true,       
  }
);

//Support “recent first” sorting
noteSchema.index({ user: 1, updatedAt: -1 });

// Allow fast filtering by tag for a given user
noteSchema.index({ user: 1, tags: 1 });

// for text searches over title & content for search bar:
noteSchema.index({ title: "text", content: "text" });




export const Note = mongoose.model("Note", noteSchema);
