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
  Slide,
  Typography,
} from "@mui/material";
import Header from "../../components/Header";
import { useDeleteAvailableOfferMutation } from "../../state/api";
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
const AvailableOffers = () => {
  const [open, setOpen] = useState(false);
  let row_id = useRef(null);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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
  const [sorting, setSorting] = useState([
    {
      id: "createdAt",
      desc: true, // This indicates descending order
    },
  ]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  //if you want to avoid useEffect, look at the React Query example instead
  useEffect(() => {
    console.log(columnFilters);
    const fetchData = async () => {
      if (!data.length) {
        setIsLoading(true);
      } else {
        setIsRefetching(true);
      }
      const isProduction = false;

      const url = new URL(
        "/offer/getAvailableOffers",
        isProduction
          ? "https://easy-tution-backend.onrender.com"
          : "http://localhost:8080"
      );

      // const url = new URL("/offer/getAvailableOffers", "http://localhost:8080");
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
        accessorKey: "educationBoard",
        header: "Education Board",
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
        <Typography variant="h2" color="secondary">
          LOADING
        </Typography>
        <CircularProgress color="secondary" />
      </Box>
    );
  }
  return (
    <Box m="1.5rem 2.5rem">
      <Header
        title="Available Offers"
        // subtitle="Entire list of available offers"
      />
      <Container>
        <MaterialReactTable
          columns={columns}
          data={data}
          getRowId={(row) => row._id}
          initialState={{
            showColumnFilters: true,
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
                  // console.info("View Profile", row.id);
                  navigate(`/availableoffer/${row.id}`);
                }}
              >
                View Matched Tutors
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => {
                  // console.info(row);
                  row_id.current = row.id;
                  handleClickOpen();
                }}
              >
                Delete
              </Button>
              <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
              >
                <DialogTitle>
                  {"Are you sure you want to delete this offer?"}
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
                    onClick={(row) => {
                      console.info(row);
                      // console.info("View Profile", row.id);
                      // console.log(row_id.current);
                      handleDeleteOffer(row_id.current);
                      // navigate(`/availableoffer/${row.id}`);
                    }}
                  >
                    Delete
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

export default AvailableOffers;
