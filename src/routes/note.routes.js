import { Router } from "express";
import { createNoteSchema, updateNoteSchema } from "../zod/note.schema.js";
import { validate } from "../middleware/validator.middleware.js";
import {
  listNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote
} from "../controller/note.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router
  .route('/')
  .get(listNotes)
  .post(validate(createNoteSchema), createNote);

router
  .route('/:id')
  .get(getNote)
  .put(validate(updateNoteSchema), updateNote)
  .delete(deleteNote);

export default router;
