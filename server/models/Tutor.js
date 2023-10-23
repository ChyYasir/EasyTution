// Create a tutor schema (models/tutor.js)
import mongoose from "mongoose";

const tutorSchema = new mongoose.Schema(
  {
    name: String,
    phoneNumber: String,
    educationBoard: String,
    gender: String,
    preferredSubjects: [String],
    upToClass: Number,
    preferredLocations: [String],
  },
  { timestamps: true }
);

const Tutor = mongoose.model("Tutor", tutorSchema);
export default Tutor;
