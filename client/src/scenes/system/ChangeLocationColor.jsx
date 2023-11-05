import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Slide,
  TextField,
  Typography,
} from "@mui/material";
import { ChromePicker } from "react-color";
import React, { useRef, useState } from "react";
import { useUpdateLocationMutation } from "../../state/api";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const ChangeLocationColor = ({ location }) => {
  const [open, setOpen] = useState(false);
  const [color, setColor] = useState(location.color); // Initial color
  const locationId = useRef(null);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleColorChange = (newColor) => {
    setColor(newColor.hex);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const [updateLocation] = useUpdateLocationMutation();
  const handleUpdateLocation = async (locationId) => {
    try {
      console.log(locationId);
      const response = await updateLocation({
        id: locationId,
        updatedFields: {
          color: color,
        },
      }).unwrap();
      alert(`Color Updated successfully`);

      window.location.reload();
    } catch (err) {
      console.error("Error Updating lcoation:", err);
    }
  };
  return (
    <>
      <Button
        sx={{
          background: location.color,
          color: "white",
          "&:hover": {
            background: location.color, // Set hover background to the same color
          },
        }}
        onClick={() => {
          locationId.current = location._id;
          handleClickOpen();
        }}
      >
        Change Color
      </Button>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>
          {`Are you sure you want to change the color of "${location.name}"?`}
        </DialogTitle>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box sx={{ width: 400 }}>
            <TextField
              label="Selected Color"
              value={color}
              variant="outlined"
              InputProps={{
                style: {
                  backgroundColor: color,
                },
              }}
              fullWidth
              readOnly
            />
          </Box>

          <ChromePicker color={color} onChange={handleColorChange} />
        </div>
        <DialogActions>
          <Button variant="contained" color="primary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              console.log(color);
              // console.log(location._id);
              //   handleDeleteLocation(locationId.current);
              handleUpdateLocation(locationId.current);
            }}
          >
            Change Color
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ChangeLocationColor;
