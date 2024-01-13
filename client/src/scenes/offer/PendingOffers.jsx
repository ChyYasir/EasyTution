import React, { useEffect, useMemo, useRef, useState } from "react";
import { MaterialReactTable } from "material-react-table";
import { Link, Navigate, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
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
import {
  useDeleteAvailableOfferMutation,
  useUpdateOfferMutation,
  useUpdateTutorMutation,
} from "../../state/api";

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
const PendingOffers = () => {
  let status = useRef(null);

  let assignedTutor = useRef(null);

  let feeTaken = useRef(null);
  // for taking percentage of fee
  let feePercentage = useRef(null);
  let row_id = useRef(null);
  const [mutate] = useUpdateOfferMutation();
  const [updateTutor] = useUpdateTutorMutation();
  const handleUpdateOffer = async (offerId) => {
    // Replace 'offerId' with the actual offer ID
    // await addTutor(data).unwrap();
    try {
      // console.log(status);
      // console.log(assignedTutor);

      if (status.current === "available") {
        await mutate({
          id: offerId,
          status: status.current,
          assignedTutor: assignedTutor.current,
        }).unwrap();
        alert("The Offer is in Available List Now!!!");
      }
      if (status.current === "confirmed") {
        await mutate({
          id: offerId,
          status: status.current,
          assignedTutor: assignedTutor.current,
          feePercentage: feePercentage.current,
        }).unwrap();
        alert(`Offer ${offerId} is confirmed`);
      }
      window.location.reload();
    } catch (error) {
      // console.log(error);
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
  const [openOne, setOpenOne] = useState(false);

  const handleClickOpenOne = () => {
    setOpenOne(true);
  };

  const handleCloseOne = () => {
    setOpenOne(false);
  };
  const navigate = useNavigate();
  //data and fetching state

  const [deleteOffer] = useDeleteAvailableOfferMutation();

  const handleDeleteOffer = async (offerId) => {
    // Accept offerId as an argument
    try {
      const response = await deleteOffer(offerId).unwrap();
      alert(`Offer No. ${offerId} deleted successfully`);

      window.location.reload();
    } catch (err) {
      console.error("Error deleting offer:", err);
    }
  };
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
      const isProduction = false;
      const url = new URL(
        "/offer/getPendingOffers",
        isProduction
          ? "https://easy-tution-backend.onrender.com"
          : "http://localhost:8080"
      );
      // const url = new URL("/offer/getPendingOffers", "http://localhost:8080");
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
        accessorKey: "createdAt",
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
  return (
    <Box m="1.5rem 2.5rem">
      <Header
        title="Pending Offers"
        subtitle="Entire list of available offers"
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
          renderRowActions={({ row }) => (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                // flexWrap: "nowrap",
                gap: "0.5rem",
              }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  row_id.current = row.id;
                  handleClickOpenOne();
                }}
              >
                Not Confirm
              </Button>
              <Dialog
                open={openOne}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleCloseOne}
                aria-describedby="alert-dialog-slide-description"
              >
                <DialogTitle>
                  {"Are you sure you want to not confirm this offer?"}
                </DialogTitle>

                <DialogActions>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCloseOne}
                  >
                    No
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => {
                      status.current = "available";
                      assignedTutor.current = null;
                      handleUpdateOffer(row_id.current);
                    }}
                  >
                    Yes
                  </Button>
                </DialogActions>
              </Dialog>
              <Button
                variant="contained"
                color="error"
                onClick={() => {
                  // console.info(row);
                  // console.log(row.original.assignedTutor._id);
                  status.current = "confirmed";
                  assignedTutor.current = row.original.assignedTutor._id;
                  row_id.current = row.id;
                  // feePercentage.current =
                  handleClickOpen();
                }}
              >
                Confirm
              </Button>
              <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
              >
                <DialogTitle>
                  {"Are you sure you want to cornfirm this offer?"}
                </DialogTitle>
                <Box sx={{ margin: "1rem" }}>
                  <Grid item xs={12}>
                    <TextField
                      label="Percentage Fee" // Label for the fee TextField
                      variant="outlined"
                      fullWidth
                      value={feePercentage.current} // Value for the fee TextField
                      onChange={(e) => (feePercentage.current = e.target.value)} // Handle fee changes
                    />
                  </Grid>
                </Box>
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
                      // console.log(status.current);
                      // console.log(assignedTutor.current);
                      // console.log(row_id.current);
                      console.log(feePercentage.current);
                      handleUpdateOffer(row_id.current);
                    }}
                  >
                    Confirm
                  </Button>
                </DialogActions>
              </Dialog>
              {/* <Button
            variant="contained"
            color="error"
            onClick={() => {
              console.info("Remove", row);
            }}
          >
            Remove
          </Button> */}
            </div>
          )}
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

export default PendingOffers;
