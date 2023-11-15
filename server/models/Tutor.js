// Create a tutor schema (models/tutor.js)
import mongoose from "mongoose";

const offerDetailsSchema = new mongoose.Schema({
  offerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Offer",
  },
  location: [String],
  address: String,
  salary: Number,
  feePercentage: Number,
});
const reviewSchema = new mongoose.Schema({
  offerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Offer",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  stars: {
    type: Number,
    min: 1,
    max: 5,
  },
  feedback: {
    type: String,
    maxlength: 500, // You can adjust the maximum length as needed
  },
});
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

    notConfirmedOffersCount: {
      type: Number,
      default: 0,
    },
    confirmedOffers: [offerDetailsSchema], // List of confirmed offers with details
    reviews: [reviewSchema],
  },
  { timestamps: true }
);

const Tutor = mongoose.model("Tutor", tutorSchema);
export default Tutor;
