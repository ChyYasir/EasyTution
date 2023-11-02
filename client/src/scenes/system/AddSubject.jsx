import { useTheme } from "@emotion/react";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useAddSubjectMutation } from "../../state/api";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  TextField,
} from "@mui/material";
import { AddCircleOutline } from "@mui/icons-material";
import Header from "../../components/Header";

const AddSubject = ({ subjects }) => {
  const [open1, setOpen1] = useState(false);

  const handleClickOpen1 = () => {
    setOpen1(true);
  };

  const handleClose1 = () => {
    setOpen1(false);
  };

  const theme = useTheme();

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [addSubject] = useAddSubjectMutation();

  const onSubmit = async (formData) => {
    const subject = formData.name;
    const subjectName = subject.toLowerCase();
    if (subject === "") {
      alert("Enter a valid Subject Name.");
    } else {
      if (subjects.some((subject) => subject.toLowerCase() === subjectName)) {
        alert("This Subject is already Present");
      } else {
        setIsSubmitting(true);
        try {
          await addSubject(formData).unwrap();
          alert("Subject Added Successfully!!!");
          window.location.reload();
        } catch (error) {
          alert("Failed to add this subject");
        } finally {
          setIsSubmitting(false);
        }
      }
    }
  };

  return (
    <>
      <Container component="main">
        <div
          style={{
            marginTop: "2rem",
            marginBottom: "2rem",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button
            variant="contained"
            color="secondary"
            onClick={handleClickOpen1}
            startIcon={<AddCircleOutline />}
          >
            Add New Subject
          </Button>
          <Dialog open={open1} onClose={handleClose1}>
            <Box m="1rem 1.5rem">
              <Header title={"Add Subject"} />
              <DialogContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Grid container spacing={2} sx={{ marginTop: "1.5rem" }}>
                    <Grid item xs={12}>
                      <Controller
                        name="name"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Subject Name"
                            variant="outlined"
                            fullWidth
                          />
                        )}
                      />
                    </Grid>
                  </Grid>

                  <DialogActions sx={{ marginTop: "1rem" }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleClose1}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      color="error"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Adding..." : "Add Subject"}
                    </Button>
                  </DialogActions>
                </form>
              </DialogContent>
            </Box>
          </Dialog>
        </div>
      </Container>
    </>
  );
};

export default AddSubject;
