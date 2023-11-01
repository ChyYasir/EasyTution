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
    oLevelSchool: String, // Add O Level School field
    oLevelResult: String, // Add O Level Result field
    aLevelSchool: String,
    aLevelResult: String, // Add A Level Result field
    universityName: String, // Add University Name field
    department: String, // Add Department field
    semester: String, // Add Semester field
    cgpa: Number, // Add CGPA field
    emergencyPhoneNumber: String, // Add Emergency Contact Number field
    presentAddress: String, // Add Present Address field
    otherDetails: String,
  },
  { timestamps: true }
);

const Tutor = mongoose.model("Tutor", tutorSchema);
export default Tutor;
