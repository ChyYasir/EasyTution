import React, { useState, useEffect } from "react";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {
  useUpdateTutorAvailabilityMutation,
  useGetTutorAvailabilityQuery,
} from "../../state/api";

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const AvailabilitySchedule = ({ tutorId }) => {
  const [availability, setAvailability] = useState({});
  const [updateAvailability] = useUpdateTutorAvailabilityMutation();
  const { data: fetchedAvailability, isLoading } =
    useGetTutorAvailabilityQuery(tutorId);
  console.log({ fetchedAvailability });
  useEffect(() => {
    if (fetchedAvailability) {
      const availabilityObject = {};
      fetchedAvailability.forEach(({ day, timeSlots }) => {
        availabilityObject[day] = timeSlots;
      });
      console.log({ availabilityObject });
      setAvailability(availabilityObject);
    }
  }, [fetchedAvailability]);

  const handleTimeChange = (day, slotIndex, type) => (newValue) => {
    setAvailability({
      ...availability,
      [day]: availability[day].map((slot, index) =>
        index === slotIndex ? { ...slot, [type]: newValue } : slot
      ),
    });
  };

  const addTimeSlot = (day) => {
    const newSlot = { startTime: null, endTime: null };
    setAvailability({
      ...availability,
      [day]: [...(availability[day] || []), newSlot],
    });
  };

  const handleSubmit = async () => {
    // Transform the availability object into the expected array format
    const availabilityArray = Object.entries(availability).map(
      ([day, timeSlots]) => ({
        day,
        timeSlots,
      })
    );

    try {
      await updateAvailability({
        tutorId,
        availability: availabilityArray,
      }).unwrap();
      alert("Availability updated successfully");
    } catch (error) {
      console.error("Error updating availability:", error);
    }
  };

  if (isLoading) {
    return <p>Loading...</p>; // Or any loading spinner
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ m: 2 }}>
        <Grid container spacing={2}>
          {daysOfWeek.map((day) => (
            <Grid item xs={12} key={day}>
              <Typography variant="h6">{day}</Typography>
              {(availability[day] || []).map((slot, index) => (
                <Box key={index} sx={{ display: "flex", gap: 2, mb: 1 }}>
                  <TimePicker
                    label="Start Time"
                    value={slot.startTime}
                    onChange={handleTimeChange(day, index, "startTime")}
                    renderInput={(params) => <TextField {...params} />}
                  />
                  <TimePicker
                    label="End Time"
                    value={slot.endTime}
                    onChange={handleTimeChange(day, index, "endTime")}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Box>
              ))}
              <Button onClick={() => addTimeSlot(day)}>Add Time Slot</Button>
            </Grid>
          ))}
        </Grid>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          sx={{ mt: 2 }}
        >
          Save Changes
        </Button>
      </Box>
    </LocalizationProvider>
  );
};

export default AvailabilitySchedule;
