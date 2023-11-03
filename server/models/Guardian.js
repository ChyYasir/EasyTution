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
});

const Guardian = mongoose.model("Guardian", guardianSchema);
export default Guardian;
