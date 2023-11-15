import { useTheme } from "@emotion/react";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Paper,
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

  //table state
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const params = useParams();

  // console.log(params.id);
  const theme = useTheme();

  const { data, isLoading, isError } = useGetOfferQuery(params.id);

  // let [status, setStatus] = useState(""); // Update status
  let status = useRef(null);
  // let [assignedTutor, setAssignedTutor] = useState(""); // Update assignedTutor
  let assignedTutor = useRef(null);

  // let [offerId, setOfferId] = useState("");
  const [mutate] = useUpdateOfferMutation();

  const handleUpdateOffer = async (offerId) => {
    // Replace 'offerId' with the actual offer ID
    // await addTutor(data).unwrap();
    try {
      // console.log({ status: status.current });
      await mutate({
        id: offerId,
        status: status.current,
        assignedTutor: assignedTutor.current,
        offerLocation: data?.location,
      }).unwrap();
      if (status.current === "pending") {
        alert("The Offer is Pending Successfully!!!");
      }
    } catch (error) {
      // console.log(error);
      alert("Failed Load");
    }
  };

  const fetchedTutors =
    data?.matchedTutors.filter((tutor) => tutor.contacted) || [];

  let contactedTutors = useRef();
  // const [contactedTutors, setContactedTutors] = useState(
  //
  // );
  contactedTutors.current = fetchedTutors.map((tutor) => tutor.tutor._id) || [];

  console.log({ fetchedTutors });
  console.log({ contactedTutors });
  const [updateTutorContact] = useUpdateMatchedTutorContactMutation();

  const handleUpdateContact = async (offerId, tutorId) => {
    await updateTutorContact({ offerId, tutorId }).unwrap();
    const updatedContactedTutors = [...contactedTutors.current, tutorId];
    contactedTutors.current = updatedContactedTutors;
  };
  const offerInfoLeft = [
    {
      label: "Offer ID",
      content: `${data?._id}`,
    },
    {
      label: "Guardian's Name",
      content: `${data?.guardianName}`,
    },
    {
      label: "Guardian's Phone Number",
      content: `${data?.guardianPhoneNumber}`,
    },
    {
      label: "Guardian ID",
      content: `${data?.guardian}`,
    },
    {
      label: "Location",
      content: `${data?.location}`,
    },
  ];
  const offerInfoRight = [
    {
      label: "Education Board",
      content: `${data?.educationBoard}`,
    },
    {
      label: "Class",
      content: `${data?.class}`,
    },
    {
      label: "Subjects",
      content: `${data?.subjects}`,
    },
    {
      label: "Days Per Week",
      content: `${data?.daysPerWeek}`,
    },
    {
      label: "Address",
      content: `${data?.address}`,
    },
  ];
  const columns = useMemo(
    () => [
      {
        accessorKey: "tutor._id",
        header: "ID",
        Header: ({ column }) => <HeaderCell column={column} />,
        size: 180,
        Cell: ({ cell }) => {
          // return <div onClick={() => ></div>,
          return (
            <>
              <Box
                sx={{
                  cursor: "pointer",
                  // backgroundColor: "red",
                }}
                onClick={() => {
                  console.log(cell.getValue());
                }}
              >
                {cell.getValue()}
              </Box>
            </>
          );
        },
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
            <>
              <Box
                sx={{
                  cursor: "pointer",
                  // backgroundColor: "red",
                }}
                onClick={() => {
                  console.log(cell.getValue());
                }}
              >
                <Typography>{date}</Typography>
                <Typography>{time}</Typography>
              </Box>
            </>
          );
        },
      },
      {
        accessorKey: "tutor.preferredSubjects",
        header: "Preferred Subjects",
        Header: ({ column }) => <HeaderCell column={column} />,
        Cell: ({ cell }) => {
          // return <div onClick={() => ></div>,
          return (
            <>
              <Box
                sx={{
                  cursor: "pointer",
                  // backgroundColor: "red",
                }}
                onClick={() => {
                  console.log(cell.getValue());
                }}
              >
                {cell.getValue().join(",")}
              </Box>
            </>
          );
        },
      },
      {
        accessorKey: "tutor.gender",
        header: "Gender",
        Header: ({ column }) => <HeaderCell column={column} />,
        muiTableBodyCellProps: ({ cell }) => ({
          sx: {
            backgroundColor:
              cell.getValue() === "Male" ? "rgba(22, 184, 44, 0.5)" : undefined,
            // fontWeight: cell.column.id === 'age' && cell.getValue<number>() > 40 ? '700' : '400'
          },
        }),
      },

      //end
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
            <Box>
              <Grid container spacing={2} sx={{ marginBottom: "0.5rem" }}>
                <Grid item xs={6}>
                  {offerInfoLeft.map(({ label, content }) => {
                    return (
                      <Grid
                        container
                        spacing={2}
                        sx={{ marginBottom: "0.5rem" }}
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
                    );
                  })}
                </Grid>
                <Grid item xs={6}>
                  {offerInfoRight.map(({ label, content }) => {
                    return (
                      <Grid
                        container
                        spacing={2}
                        sx={{ marginBottom: "0.5rem" }}
                      >
                        <Grid item xs={6}>
                          <Typography variant="h6" style={{ fontWeight: 600 }}>
                            {label}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="h6">{content}</Typography>
                        </Grid>
                        <Divider />
                      </Grid>
                    );
                  })}
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Paper>
        <MaterialReactTable
          columns={columns}
          data={data.matchedTutors}
          getRowId={(row) => row.tutor._id}
          initialState={{
            showColumnFilters: true,
            // expanded: true,
            // pagination: { pageIndex: 0, pageSize: 15 },
          }}
          manualFiltering
          manualPagination
          manualSorting
          muiToolbarAlertBannerProps={
            isError
              ? {
                  color: "error",
                  children: "Error loading data",
                }
              : undefined
          }
          onColumnFiltersChange={setColumnFilters}
          onGlobalFilterChange={setGlobalFilter}
          onPaginationChange={setPagination}
          onSortingChange={setSorting}
          // rowCount={rowCount}
          enableRowActions
          renderRowActions={({ row }) => (
            <div
              style={{
                display: "flex",
                flexWrap: "normal",
                gap: "0.5rem",
              }}
            >
              {contactedTutors.current.includes(row.id) ? (
                <Box>
                  <Typography>This Tutor is already contacted</Typography>
                </Box>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    //   whiteSpace: "normal",
                    //   flexWrap: "normal",
                    gap: "0.5rem",
                  }}
                >
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => {
                      console.info(row);
                      handleUpdateContact(params.id, row.id);
                    }}
                  >
                    Not Assign
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                      // alert("random");
                      // setStatus("pending");
                      status.current = "pending";
                      // setAssignedTutor(row.id);
                      assignedTutor.current = row.id;
                      // setOfferId(data?._id);

                      // console.log({ status });
                      // console.log({ assignedTutor });

                      handleUpdateOffer(data?._id);

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
            size: 120, //default size is usually 180
          }}
          enableColumnResizing
          muiTableHeadCellProps={{
            // align: "center",
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
            //   showProgressBars: isRefetching,
            sorting,
          }}
        />
      </Box>
    </>
  );
};

export default AvailableOfferMatchedTutor;
