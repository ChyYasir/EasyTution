import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Rating,
  Slide,
  TextField,
  Typography,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import React, { useState } from "react";
import { useGetOfferQuery, useUpdateReviewsMutation } from "../state/api";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Header from "./Header";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const FormattedDate = ({ currentDate }) => {
  const createdAt = new Date(currentDate);

  const month = createdAt.toLocaleString("en-us", { month: "long" }); // Full month name
  const year = createdAt.getFullYear();
  const date = createdAt.toLocaleDateString();
  const time = createdAt.toLocaleTimeString();
  const format = month + ", " + year;
  return (
    <>
      <Typography variant="h2">{format}</Typography>
      <Typography variant="h6">{date}</Typography>
      <Typography variant="h6">{time}</Typography>
    </>
  );
};
const SubmitFeedback = ({ offerId, offerInfo }) => {
  const [open, setOpen] = useState(false);
  const [stars, setStars] = useState(0);
  const [feedback, setFeedback] = useState("");
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [mutate] = useUpdateReviewsMutation();

  const handleUpdateReviews = async (offerId) => {
    try {
      await mutate({
        id: offerId,
        stars: stars,
        feedback: feedback,
      }).unwrap();
      alert("Review Added Successfully!!!");
      window.location.reload();
    } catch (error) {
      console.log(error);
      alert("Failed Load");
    }
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: offerInfo.reviews.length - 1,
  };

  return (
    <>
      <Button
        variant="contained"
        //   color="error"
        sx={{
          background: "#21b548",
          color: "white",
          "&:hover": {
            background: "#1a9740", // Change the background color on hover
          },
        }}
        onClick={() => {
          console.log(offerId);
          console.log(offerInfo);
          handleClickOpen();
        }}
      >
        Give Feed back
      </Button>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <Box m="3rem">
          <Header title={"Previous Feedbacks"} />
          {offerInfo.reviews.length > 0 ? (
            <Slider {...settings}>
              {offerInfo.reviews.map((review, index) => (
                <Box key={index} textAlign="center">
                  <Card variant="outlined">
                    <CardContent>
                      <FormattedDate currentDate={review.date} />
                      <Rating name="read-only" value={review.stars} readOnly />
                      <Typography variant="h3">{review.feedback}</Typography>
                    </CardContent>
                  </Card>
                </Box>
              ))}
            </Slider>
          ) : (
            <Typography variant="h6" align="center">
              There is no feedback given yet.
            </Typography>
          )}
          <DialogContent>
            <Box>
              <Typography variant="subtitle1">Rate the tutor:</Typography>
              <Rating
                value={stars}
                onChange={(event, newValue) => setStars(newValue)}
              />
            </Box>
            <Box mt={2}>
              <TextField
                label="Feedback"
                multiline
                rows={4}
                fullWidth
                variant="outlined"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="primary" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                handleUpdateReviews(offerId);
              }}
            >
              Add Feedback
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
};

export default SubmitFeedback;
