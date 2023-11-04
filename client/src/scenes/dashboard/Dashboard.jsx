import { ChromePicker } from "react-color";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { Box } from "@mui/material";
const Dashboard = () => {
  const [color, setColor] = useState("#000000"); // Initial color

  const handleColorChange = (newColor) => {
    setColor(newColor.hex);
  };

  return (
    <div>
      <Typography variant="h6">Color Picker</Typography>
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
  );
};

export default Dashboard;
