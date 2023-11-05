import mongoose from "mongoose";

const monthlyDataSchema = new mongoose.Schema({
  year: {
    type: Number,
    unique: true, // Ensure each document is uniquely identified by year
  },
  monthlyData: [
    {
      month: String,
      totalFeeTaken: Number,
    },
  ], // An array of monthly data
});

const MonthlyData = mongoose.model("MonthlyData", monthlyDataSchema);

export default MonthlyData;
