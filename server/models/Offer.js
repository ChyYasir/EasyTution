import mongoose from "mongoose";

const offerSchema = new mongoose.Schema(
  {
    guardianName: {
      type: String,
      required: true,
    },
    guardianPhoneNumber: {
      type: String,
      required: true,
    },

    location: [String],
    address: String,
    tutorGender: String,
    daysPerWeek: {
      type: Number,
      default: 1,
    },
    subjects: [String],
    educationBoard: String,
    class: Number, // Store the class as a number
    salary: {
      type: Number,
      required: true,
    },
    matchedTutors: [
      {
        tutor: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Tutor",
        },
        contacted: {
          type: Boolean,
          default: false, // Indicates whether the tutor is contacted for this offer
        },
      },
    ],
    status: {
      type: String,
      default: "available", // Default value is "available"
    },
    assignedTutor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tutor",
    },
    startDate: {
      type: Date, // Use Date type for timestamp
    },
    feeTaken: {
      type: Boolean,
      default: false,
    },
    feePercentage: {
      type: Number,
      default: 50,
    },
    guardian: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Guardian",
    },
  },
  { timestamps: true }
);

const Offer = mongoose.model("Offer", offerSchema);
export default Offer;
