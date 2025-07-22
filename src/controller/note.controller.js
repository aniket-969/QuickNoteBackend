import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError }       from "../utils/ApiError.js";
import { ApiResponse }    from "../utils/ApiResponse.js";
import { Note } from "../models/note.models.js";

// List notes with optional tag filter, search, pagination
export const listNotes = asyncHandler(async (req, res) => {
  const { tag, search, page = 1, limit = 20 } = req.query;
  const userId = req.user._id;

  const filter = { user: userId };

  // Tag filter
  if (tag) filter.tags = tag;

  // Text search
  if (search) {
    filter.$text = { $search: search };
  }

  const notes = await Note
    .find(filter)
    .sort({ updatedAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  return res.json(new ApiResponse(200, notes));
});

export const getNote = asyncHandler(async (req, res) => {
  const note = await Note.findOne({
    _id: req.params.id,
    user: req.user._id
  });
  if (!note) throw new ApiError(404, "Note not found");
  res.json(new ApiResponse(200, note));
});

export const createNote = asyncHandler(async (req, res) => {
  const { title, content, tags } = req.body;
  const note = await Note.create({
    user:   req.user._id,
    title,
    content,
    tags
  });
  res.status(201).json(new ApiResponse(201, note, "Note created"));
});

export const updateNote = asyncHandler(async (req, res) => {
  const { title, content, tags } = req.body;
  const note = await Note.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { title, content, tags },
    { new: true, runValidators: true }
  );
  if (!note) throw new ApiError(404, "Note not found or not yours");
  res.json(new ApiResponse(200, note, "Note updated"));
});

export const deleteNote = asyncHandler(async (req, res) => {
  const result = await Note.deleteOne({
    _id: req.params.id,
    user: req.user._id
  });
  if (result.deletedCount === 0) throw new ApiError(404, "Note not found");
  res.json(new ApiResponse(200, {}, "Note deleted"));
});

export const listTags = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const tagsAgg = await Note.aggregate([
    { $match: { user: userId } },       
    { $unwind: "$tags" },           
    { $group: { _id: "$tags" } },         
    { $sort: { _id: 1 } },              
  ]);
  const tags = tagsAgg.map((t) => t._id);

  res.json(new ApiResponse(200, tags));
});
