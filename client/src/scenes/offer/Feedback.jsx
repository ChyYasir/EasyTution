import React, { useEffect, useMemo, useRef, useState } from "react";
import { MaterialReactTable } from "material-react-table";
import { Link, Navigate, useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Slide,
  TextField,
  Typography,
} from "@mui/material";
import Header from "../../components/Header";
import { useUpdateConfirmedOfferMutation } from "../../state/api";
import SubmitFeedback from "../../components/SubmitFeedback";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
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
const Feedback = () => {
  const navigate = useNavigate();

  let row_id = useRef(null);
  let status = useRef(null);
  let feeTaken = useRef(null);

  const [mutate] = useUpdateConfirmedOfferMutation();

  const handleUpdateConfirmedOffer = async (offerId) => {
    try {
      await mutate({
        id: offerId,
        status: status.current,
        feeAmount: feeTaken.current,
      }).unwrap();
      alert("The Fee is taken Successfully!!!");
      window.location.reload();
    } catch (error) {
      console.log(error);
      alert("Failed Load");
    }
  };
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  //data and fetching state

  const [data, setData] = useState([]);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [rowCount, setRowCount] = useState(0);

  //table state
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  //if you want to avoid useEffect, look at the React Query example instead
  useEffect(() => {
    console.log(columnFilters);
    const fetchData = async () => {
      if (!data?.length) {
        setIsLoading(true);
      } else {
        setIsRefetching(true);
      }
      const isProduction = true;
      const url = new URL(
        "/offer/feedbackOffers",
        isProduction
          ? "https://easy-tution-backend.onrender.com"
          : "http://localhost:8080"
      );
      // const url = new URL("/offer/feedbackOffers", "http://localhost:8080");
      url.searchParams.set(
        "start",
        `${pagination.pageIndex * pagination.pageSize}`
      );
      url.searchParams.set("size", `${pagination.pageSize}`);
      url.searchParams.set("filters", JSON.stringify(columnFilters || [])); // [{}, {}, {}]
      url.searchParams.set("globalFilter", globalFilter || "");
      url.searchParams.set("sorting", JSON.stringify(sorting || []));

      try {
        const response = await fetch(url.href);
        const json = await response.json();
        setData(json.data);
        console.log(json.data);
        setRowCount(json?.meta?.totalRowCount);
      } catch (error) {
        setIsError(true);
        console.error(error);
        return;
      }
      setIsError(false);
      setIsLoading(false);
      setIsRefetching(false);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    columnFilters,
    globalFilter,
    pagination.pageIndex,
    pagination.pageSize,
    sorting,
  ]);
  // console.log(data);

  const columns = useMemo(
    () => [
      {
        accessorKey: "_id",
        header: "OFFER ID",
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
        accessorKey: "startDate",
        header: "Start Time",
        Header: ({ column }) => <HeaderCell column={column} />,
        Cell: ({ cell }) => {
          const startTime = new Date(cell.getValue());
          const date = startTime.toLocaleDateString();
          const time = startTime.toLocaleTimeString();
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
        // accessorKey: "subjects",
        header: "Time Taken To Confirm",
        Header: ({ column }) => <HeaderCell column={column} />,
        Cell: ({ cell, row }) => {
          // return <div onClick={() => ></div>,
          // console.info(row);
          const startedAt = new Date(row.original.startDate);
          const createdAt = new Date(row.original.createdAt);

          // console.log({ updatedAt });
          // console.log({ createdAt });

          // Calculate the time difference in milliseconds
          const timeDifferenceMs = startedAt - createdAt;
          // console.log({ timeDifferenceMs });
          // Function to format milliseconds to a human-readable format
          function formatTimeDifference(milliseconds) {
            const seconds = Math.floor((milliseconds / 1000) % 60);
            const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
            const hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);
            const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));

            return `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
          }

          // Format the time difference
          const formattedTimeDifference =
            formatTimeDifference(timeDifferenceMs);
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
                <Typography>{formattedTimeDifference}</Typography>
              </Box>
            </>
          );
        },
      },
      {
        accessorKey: "guardianName",
        header: "Guardian's Name",
        Header: ({ column }) => <HeaderCell column={column} />,
      },
      {
        accessorKey: "guardianPhoneNumber",
        header: "Guardian's Phone Number",
        Header: ({ column }) => <HeaderCell column={column} />,
      },
      {
        accessorKey: "assignedTutor._id",
        header: "Tutor ID",
        size: 180,
        Header: ({ column }) => <HeaderCell column={column} />,
      },
      {
        accessorKey: "assignedTutor.name",
        header: "Tutor Name",
        Header: ({ column }) => <HeaderCell column={column} />,
      },
      {
        accessorKey: "assignedTutor.phoneNumber",
        header: "Tutor Phone Number",
        Header: ({ column }) => <HeaderCell column={column} />,
      },
      {
        accessorKey: "location",
        header: "Location",
        Header: ({ column }) => <HeaderCell column={column} />,
      },
      {
        accessorKey: "address",
        header: "Address",
        Header: ({ column }) => <HeaderCell column={column} />,
      },
      {
        accessorKey: "daysPerWeek",
        header: "Days Per Week",
        Header: ({ column }) => <HeaderCell column={column} />,
      },
      {
        accessorKey: "salary",
        header: "Salary",
        Header: ({ column }) => <HeaderCell column={column} />,
      },

      {
        accessorKey: "subjects",
        header: "Subjects",
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
        accessorKey: "tutorGender",
        header: "Preferred Tutor's Gender",
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
  return (
    <Box m="1.5rem 2.5rem">
      <Header
        title="Confirmed Offers"
        subtitle="Entire list of confirmed offers"
      />
      <Container>
        <MaterialReactTable
          columns={columns}
          data={data}
          getRowId={(row) => row._id}
          initialState={{ showColumnFilters: true }}
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
          rowCount={rowCount}
          enableRowActions
          renderRowActions={({ row }) => {
            // console.log(row);
            const takeFeedback = true;
            return (
              <>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    // flexWrap: "nowrap",
                    gap: "0.5rem",
                  }}
                >
                  {takeFeedback ? (
                    <Box>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.5rem",
                        }}
                      >
                        <SubmitFeedback
                          offerId={row.id}
                          offerInfo={row.original}
                        />
                      </div>
                    </Box>
                  ) : (
                    <Box>
                      {/* <Typography> {timeRemaining}</Typography> */}
                      <Typography>Remaining</Typography>
                    </Box>
                  )}
                </div>
              </>
            );
          }}
          defaultColumn={{
            maxSize: 400,
            minSize: 80,
            size: 150, //default size is usually 180
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
            showProgressBars: isRefetching,
            sorting,
          }}
        />
      </Container>
    </Box>
  );
};

export default Feedback;
