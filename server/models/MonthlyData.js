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
    },
  ],
});

const MonthlyData = mongoose.model("MonthlyData", monthlyDataSchema);

export default MonthlyData;
