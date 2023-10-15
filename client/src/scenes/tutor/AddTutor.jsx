import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useAddTutorMutation } from "../../state/api";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Chip,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import Header from "../../components/Header";
import { useDispatch } from "react-redux";
import { CheckBox } from "@mui/icons-material";
import { useTheme } from "@emotion/react";
const AddTutor = () => {
  const theme = useTheme();
  const { control, handleSubmit, reset } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const [addTutor] = useAddTutorMutation();
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    // console.log(data);
    try {
      await addTutor(data).unwrap();
      alert("Tutor Added Successfully!!!");
      reset();
    } catch (error) {
      // console.log(error);
      alert("Failed to add tutor");
    } finally {
      setIsSubmitting(false);
    }
  };

  const preferredLocations = ["Mohakhali", "Khilgaon"];
  return (
    <>
      <Container component="main">
        <Header title="Tutor Form" subtitle="Fill out this form" />
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="name"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                label="Name"
                variant="outlined"
                sx={{ width: "50%" }}
                margin="normal"
              />
            )}
          />
          <Controller
            name="phoneNumber"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                label="Phone Number"
                variant="outlined"
                fullWidth
                margin="normal"
              />
            )}
          />
          <Controller
            name="gender"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <FormControl component="fieldset">
                <FormLabel component="legend">Gender</FormLabel>
                <RadioGroup {...field}>
                  <FormControlLabel
                    value="male"
                    control={<Radio />}
                    label="Male"
                  />
                  <FormControlLabel
                    value="female"
                    control={<Radio />}
                    label="Female"
                  />
                </RadioGroup>
              </FormControl>
            )}
          />

          <Controller
            name="preferredSubjects"
            control={control}
            defaultValue={[]}
            render={({ field }) => (
              <FormControl variant="outlined" fullWidth margin="normal">
                <InputLabel>Preferred Subjects</InputLabel>
                <Select
                  {...field}
                  multiple
                  label="Preferred Subjects"
                  renderValue={(selected) => (
                    <div>
                      {selected.map((subject) => (
                        <Chip key={subject} label={subject} color="primary" />
                      ))}
                    </div>
                  )}
                >
                  <MenuItem value="Math">Math</MenuItem>
                  <MenuItem value="Science">Science</MenuItem>
                  <MenuItem value="History">History</MenuItem>
                  {/* Add more subjects as MenuItem components */}
                </Select>
              </FormControl>
            )}
          />

          <Controller
            name="educationBoard"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <FormControl variant="outlined" fullWidth margin="normal">
                <InputLabel>Education Board</InputLabel>
                <Select {...field} label="Education Board">
                  <MenuItem value="CBSE">CBSE</MenuItem>
                  <MenuItem value="ICSE">ICSE</MenuItem>
                  {/* Add more education board options */}
                </Select>
              </FormControl>
            )}
          />
          <Controller
            name="upToClass"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <FormControl variant="outlined" fullWidth margin="normal">
                <InputLabel>Up To Class</InputLabel>
                <Select {...field} label="Up To Class">
                  <MenuItem value="10">10th</MenuItem>
                  <MenuItem value="12">12th</MenuItem>
                  {/* Add more class options */}
                </Select>
              </FormControl>
            )}
          />
          <Controller
            name="preferredLocation"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                label="Preferred Location"
                variant="outlined"
                fullWidth
                margin="normal"
              />
            )}
          />

          {/* Add more fields for other tutor information */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Adding..." : "Add Tutor"}
          </Button>
        </form>
      </Container>
    </>
  );
};

export default AddTutor;
