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
import React, { useRef, useState } from "react";
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
import AddSubject from "./AddSubject";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AllSubjects = () => {
  const [open, setOpen] = useState(false);
  const subjectId = useRef(null);
  const subjectName = useRef(null);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const theme = useTheme();
  const { data: subjects, isLoading } = useGetAllSubjectsQuery();
  // console.log(subjects);

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
        <AddSubject subjects={subjectNames} />
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
                    subjectId.current = subject._id;
                    subjectName.current = subject.name;
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
                    {`Are you sure you want to delete this subject named "${subjectName.current}"?`}
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
                        handleDeleteSubject(subjectId.current);
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
