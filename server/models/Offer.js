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
  },
  { timestamps: true }
);

const Offer = mongoose.model("Offer", offerSchema);
export default Offer;
