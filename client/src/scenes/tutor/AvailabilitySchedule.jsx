import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import Header from "../../components/Header";

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const AvailabilitySchedule = ({ tutor, onSaveAvailability }) => {
  const [editingSlot, setEditingSlot] = useState(null);
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [day, setDay] = useState("");
  const [slot, setSlot] = useState(null);

  // Ensure `tutor.availability` is defined before using `some`
  const availability = tutor?.availability || [];

  // Update tutor availability with edited slot
  const saveAvailability = () => {
    const newAvailability = [...availability];
    if (editingSlot) {
      newAvailability[editingSlot] = {
        day: editingSlot.day,
        startTime,
        endTime,
      };
    } else {
      newAvailability.push({
        day,
        startTime,
        endTime,
      });
    }
    onSaveAvailability(newAvailability);
  };

  const handleEditSlot = (selectedDay, selectedSlot) => {
    setDay(selectedDay);
    setSlot(selectedSlot);
    setEditingSlot(selectedSlot);
    setStartTime(selectedSlot.startTime);
    setEndTime(selectedSlot.endTime);
    setIsOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setEditingSlot(null);
    setIsOpenDialog(false);
  };

  return (
    <TableContainer component={Paper}>
      <Table style={{ minWidth: 500 }} aria-label="Availability Schedule">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            {daysOfWeek.map((day, index) => (
              <TableCell key={index}>{day}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {[...Array(24).keys()].map((hour) => (
            <TableRow key={hour}>
              <TableCell>{`${hour}:00 - ${hour + 1}:00`}</TableCell>
              {daysOfWeek.map((day, dayIndex) => (
                <TableCell key={dayIndex}>
                  {availability.some(
                    (slot) =>
                      slot.day === day &&
                      slot.startTime <= hour &&
                      slot.endTime > hour
                  ) ? (
                    <Box
                      sx={{ backgroundColor: "#66ff66" }}
                      onClick={() => handleEditSlot(day, { ...slot })}
                    >
                      {editingSlot &&
                        editingSlot.day === day &&
                        editingSlot.startTime === hour && (
                          <Button onClick={handleCloseDialog}>X</Button>
                        )}
                    </Box>
                  ) : (
                    <Box
                      onClick={() =>
                        handleEditSlot(day, {
                          day,
                          startTime: hour,
                          endTime: hour + 1,
                        })
                      }
                    >
                      +
                    </Box>
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Box>
        <Dialog sx={{ p: 3 }} open={isOpenDialog} onClose={handleCloseDialog}>
          {/* <DialogTitle>Edit Availability Slot</DialogTitle> */}

          <Header title="Edit Availability Slot" />
          <DialogContent sx={{ pt: 2 }}>
            {/* Add spacing here */}
            <TextField
              label="Start Time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
            <TextField
              label="End Time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={saveAvailability}>Save</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </TableContainer>
  );
};

export default AvailabilitySchedule;
