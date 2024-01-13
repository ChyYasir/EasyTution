// components/DatePickerRange.js
import React from "react";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import MobileDateRangePicker from "@mui/lab/MobileDateRangePicker";
import { TextField } from "@mui/material";

const DatePickerRange = ({ startDate, endDate, onDateChange }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <MobileDateRangePicker
        startText="Start Date"
        endText="End Date"
        value={[startDate, endDate]}
        onChange={(newValue) => onDateChange(newValue)}
        renderInput={(startProps, endProps) => (
          <>
            <TextField
              {...startProps}
              variant="standard"
              margin="normal"
              helperText=""
            />
            <TextField
              {...endProps}
              variant="standard"
              margin="normal"
              helperText=""
            />
          </>
        )}
      />
    </LocalizationProvider>
  );
};

export default DatePickerRange;
