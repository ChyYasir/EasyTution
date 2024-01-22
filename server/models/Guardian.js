import mongoose from "mongoose";

const guardianSchema = new mongoose.Schema({
  guardianName: String,
  guardianPhoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  location: [String],
  address: String,
  offerList: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Offer",
    },
  ],
  numberOfOffers: {
    type: Number,
    default: 0,
  },
  tutor: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tutor",
    },
  ],
});

const Guardian = mongoose.model("Guardian", guardianSchema);
export default Guardian;
