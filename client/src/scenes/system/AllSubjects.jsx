import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  Slide,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import FolderIcon from "@mui/icons-material/Folder";

import { AddCircleOutlined, Book } from "@mui/icons-material";
import {
  useAddSubjectMutation,
  useDeleteSubjectMutation,
  useGetAllSubjectsQuery,
} from "../../state/api";
import Header from "../../components/Header";
import { useTheme } from "@emotion/react";
import { Controller, useForm } from "react-hook-form";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const AddSubjectComponent = ({ subjects }) => {
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
            startIcon={<AddCircleOutlined />}
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
const AllSubjects = () => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const theme = useTheme();
  const { data: subjects, isLoading } = useGetAllSubjectsQuery();
  console.log(subjects);

  const [deleteSubject] = useDeleteSubjectMutation();

  const handleDeleteSubject = async (subjectId) => {
    // Accept offerId as an argument
    try {
      const response = await deleteSubject(subjectId).unwrap();
      alert(`Subject deleted successfully`);

      window.location.reload();
    } catch (err) {
      console.error("Error deleting offer:", err);
    }
  };
  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress color="secondary" />
      </Box>
    );
  }
  const subjectNames = subjects.map((subject) => subject.name);
  return (
    <>
      <Box m="1.5rem 2.5rem">
        <Header title={"All Subjects"}></Header>
        <AddSubjectComponent subjects={subjectNames} />
        <Grid container spacing={2}>
          {subjects.map((subject, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              {/* Render your subject component here */}
              {/* For example: <SubjectItem subject={subject} /> */}
              <Box
                sx={{
                  padding: "3%",
                  borderRadius: "0.5rem",
                  display: "flex", // Add this line
                  justifyContent: "space-between",
                  background: theme.palette.background.alt,
                }}
              >
                <Typography variant="h4">{subject.name}</Typography>
                <Button
                  color="error"
                  onClick={() => {
                    handleClickOpen();
                  }}
                >
                  <DeleteIcon />
                </Button>
                <Dialog
                  open={open}
                  TransitionComponent={Transition}
                  keepMounted
                  onClose={handleClose}
                  aria-describedby="alert-dialog-slide-description"
                >
                  <DialogTitle>
                    {`Are you sure you want to delete this subject named "${subject.name}"?`}
                  </DialogTitle>
                  <DialogActions>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleClose}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => {
                        // console.log(subject._id);
                        handleDeleteSubject(subject._id);
                      }}
                    >
                      Delete
                    </Button>
                  </DialogActions>
                </Dialog>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
};

export default AllSubjects;
