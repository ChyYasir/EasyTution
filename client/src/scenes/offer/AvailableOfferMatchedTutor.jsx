import { useTheme } from "@emotion/react";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetOfferQuery,
  useUpdateMatchedTutorContactMutation,
  useUpdateOfferMutation,
} from "../../state/api";
import MaterialReactTable from "material-react-table";
import Loading from "../../components/Loading";

function HeaderCell({ column }) {
  return (
    <>
      <Box
        sx={{
          cursor: "pointer",
          whiteSpace: "normal", // Allow text to wrap to the next line
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        <Typography sx={{ fontWeight: "bold" }}>
          {column.columnDef.header}
        </Typography>
      </Box>
    </>
  );
}

const AvailableOfferMatchedTutor = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const params = useParams();

  // State for table
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // State for manual tutor addition
  const [manualTutorId, setManualTutorId] = useState("");

  // API calls
  const { data, isLoading, isError } = useGetOfferQuery(params.id);
  const [updateOffer] = useUpdateOfferMutation();
  const [updateTutorContact] = useUpdateMatchedTutorContactMutation();

  // Refs for status and assigned tutor
  let status = useRef(null);
  let assignedTutor = useRef(null);

  // Fetch matched tutors that have been contacted
  const fetchedTutors =
    data?.matchedTutors.filter((tutor) => tutor.contacted) || [];
  let contactedTutors = useRef(
    fetchedTutors.map((tutor) => tutor.tutor._id) || []
  );

  // Handle updating offer status and assigned tutor
  const handleUpdateOffer = async (offerId) => {
    try {
      await updateOffer({
        id: offerId,
        status: status.current,
        assignedTutor: assignedTutor.current,
        offerLocation: data?.location,
      }).unwrap();
      if (status.current === "pending") {
        alert("The Offer is Pending Successfully!!!");
      }
    } catch (error) {
      alert("Failed Load");
    }
  };

  // Handle updating tutor contact
  const handleUpdateContact = async (offerId, tutorId) => {
    await updateTutorContact({ offerId, tutorId }).unwrap();
    contactedTutors.current = [...contactedTutors.current, tutorId];
  };

  // Handle manual tutor addition
  const handleAddTutorManually = async () => {
    if (manualTutorId.trim() === "") {
      alert("Please enter a valid Tutor ID.");
      return;
    }
    try {
      status.current = "pending";
      assignedTutor.current = manualTutorId;

      await handleUpdateOffer(params.id);
      navigate(`/pendingoffers`);
      // await handleUpdateContact(params.id, manualTutorId);
      alert("Tutor manually added successfully.");
    } catch (error) {
      alert("Failed to add Tutor. Please try again.");
    }
  };

  // Information to display in the offer details
  const offerInfoLeft = [
    { label: "Offer ID", content: `${data?._id}` },
    { label: "Guardian's Name", content: `${data?.guardianName}` },
    {
      label: "Guardian's Phone Number",
      content: `${data?.guardianPhoneNumber}`,
    },
    { label: "Guardian ID", content: `${data?.guardian}` },
    { label: "Location", content: `${data?.location}` },
  ];

  const offerInfoRight = [
    { label: "Education Board", content: `${data?.educationBoard}` },
    { label: "Class", content: `${data?.class}` },
    { label: "Subjects", content: `${data?.subjects}` },
    { label: "Days Per Week", content: `${data?.daysPerWeek}` },
    { label: "Address", content: `${data?.address}` },
  ];

  const columns = useMemo(
    () => [
      {
        accessorKey: "tutor._id",
        header: "ID",
        Header: ({ column }) => <HeaderCell column={column} />,
        size: 180,
        Cell: ({ cell }) => (
          <Box
            sx={{ cursor: "pointer" }}
            onClick={() => console.log(cell.getValue())}
          >
            {cell.getValue()}
          </Box>
        ),
      },
      {
        accessorKey: "score",
        header: "Score",
        Header: ({ column }) => <HeaderCell column={column} />,
      },
      {
        accessorKey: "tutor.name",
        header: "Name",
        Header: ({ column }) => <HeaderCell column={column} />,
      },
      {
        accessorKey: "tutor.phoneNumber",
        header: "Phone Number",
        Header: ({ column }) => <HeaderCell column={column} />,
      },
      {
        accessorKey: "tutor.educationBoard",
        header: "Education Board",
        Header: ({ column }) => <HeaderCell column={column} />,
      },
      {
        accessorKey: "tutor.createdAt",
        header: "Create Time",
        Header: ({ column }) => <HeaderCell column={column} />,
        Cell: ({ cell }) => {
          const createdAtDate = new Date(cell.getValue());
          const date = createdAtDate.toLocaleDateString();
          const time = createdAtDate.toLocaleTimeString();
          return (
            <Box
              sx={{ cursor: "pointer" }}
              onClick={() => console.log(cell.getValue())}
            >
              <Typography>{date}</Typography>
              <Typography>{time}</Typography>
            </Box>
          );
        },
      },
      {
        accessorKey: "tutor.preferredSubjects",
        header: "Preferred Subjects",
        Header: ({ column }) => <HeaderCell column={column} />,
        Cell: ({ cell }) => (
          <Box
            sx={{ cursor: "pointer" }}
            onClick={() => console.log(cell.getValue())}
          >
            {cell.getValue().join(",")}
          </Box>
        ),
      },
      {
        accessorKey: "tutor.gender",
        header: "Gender",
        Header: ({ column }) => <HeaderCell column={column} />,
        muiTableBodyCellProps: ({ cell }) => ({
          sx: {
            backgroundColor:
              cell.getValue() === "Male" ? "rgba(22, 184, 44, 0.5)" : undefined,
          },
        }),
      },
    ],
    []
  );

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

  if (data?.status !== "available") {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography variant="h1">
          This Offer is not in the Available Offer list
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Box m="1.5rem 2.5rem">
        <Paper
          elevation={3}
          style={{
            padding: "3%",
            marginTop: "3%",
            marginBottom: "3%",
            borderRadius: "0.5rem",
            background: theme.palette.background.alt,
          }}
        >
          <Box>
            <Grid container spacing={2} sx={{ marginBottom: "0.5rem" }}>
              <Grid item xs={6}>
                {offerInfoLeft.map(({ label, content }) => (
                  <Grid
                    container
                    spacing={2}
                    sx={{ marginBottom: "0.5rem" }}
                    key={label}
                  >
                    <Grid item xs={6}>
                      <Typography variant="h6" style={{ fontWeight: 600 }}>
                        {label}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="h6">{content}</Typography>
                    </Grid>
                  </Grid>
                ))}
              </Grid>
              <Grid item xs={6}>
                {offerInfoRight.map(({ label, content }) => (
                  <Grid
                    container
                    spacing={2}
                    sx={{ marginBottom: "0.5rem" }}
                    key={label}
                  >
                    <Grid item xs={6}>
                      <Typography variant="h6" style={{ fontWeight: 600 }}>
                        {label}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="h6">{content}</Typography>
                    </Grid>
                  </Grid>
                ))}
              </Grid>
            </Grid>
            <Box
              sx={{ display: "flex", alignItems: "center", marginTop: "1rem" }}
            >
              <TextField
                label="Tutor ID"
                value={manualTutorId}
                onChange={(e) => setManualTutorId(e.target.value)}
                variant="outlined"
                size="small"
                sx={{ marginRight: "1rem" }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddTutorManually}
              >
                Add Tutor Manually
              </Button>
            </Box>
          </Box>
        </Paper>
        <MaterialReactTable
          columns={columns}
          data={data.matchedTutors}
          getRowId={(row) => row.tutor._id}
          initialState={{
            showColumnFilters: true,
          }}
          manualFiltering
          manualPagination
          manualSorting
          muiToolbarAlertBannerProps={
            isError
              ? { color: "error", children: "Error loading data" }
              : undefined
          }
          onColumnFiltersChange={setColumnFilters}
          onGlobalFilterChange={setGlobalFilter}
          onPaginationChange={setPagination}
          onSortingChange={setSorting}
          enableRowActions
          renderRowActions={({ row }) => (
            <div style={{ display: "flex", flexWrap: "normal", gap: "0.5rem" }}>
              {contactedTutors.current.includes(row.id) ? (
                <Box>
                  <Typography>This Tutor is already contacted</Typography>
                </Box>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                  }}
                >
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleUpdateContact(params.id, row.id)}
                  >
                    Not Assign
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={async () => {
                      status.current = "pending";
                      assignedTutor.current = row.id;
                      await handleUpdateOffer(data?._id);
                      navigate(`/pendingoffers`);
                    }}
                  >
                    Assign
                  </Button>
                </div>
              )}
            </div>
          )}
          defaultColumn={{
            maxSize: 400,
            minSize: 80,
            size: 120,
          }}
          enableColumnResizing
          muiTableHeadCellProps={{
            padding: "none",
          }}
          muiTableBodyCellProps={{
            align: "center",
          }}
          state={{
            columnFilters,
            globalFilter,
            isLoading,
            pagination,
            showAlertBanner: isError,
            sorting,
          }}
        />
      </Box>
    </>
  );
};

export default AvailableOfferMatchedTutor;
