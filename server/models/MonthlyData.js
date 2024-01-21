// models/MonthlyData.js
import mongoose from "mongoose";

const monthlyDataSchema = new mongoose.Schema({
  year: {
    type: Number,
    unique: true,
  },
  monthlyData: [
    {
      month: String,
      totalFeeTaken: Number,
      confirmedOffers: { type: Number, default: 0 },
      pendingOffers: { type: Number, default: 0 },
      maleTutors: { type: Number, default: 0 },
      femaleTutors: { type: Number, default: 0 },
    },
  ],
});

const MonthlyData = mongoose.model("MonthlyData", monthlyDataSchema);

export default MonthlyData;
