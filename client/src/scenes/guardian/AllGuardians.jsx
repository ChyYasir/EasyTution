import React, { useEffect, useMemo, useState } from "react";
import { MaterialReactTable } from "material-react-table";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import Header from "../../components/Header";

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
const AllGuardians = () => {
  const navigate = useNavigate();
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
    pageSize: 10,
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
        "/guardian/getAllGuardians",
        isProduction
          ? "https://easy-tution-backend.onrender.com"
          : "http://localhost:8080"
      );
      // const url = new URL("/tutor/getAllGuardians", "http://localhost:8080");
      url.searchParams.set(
        "start",
        `${pagination.pageIndex * pagination.pageSize}`
      );
      url.searchParams.set("size", `${pagination.pageSize}`);
      url.searchParams.set("filters", JSON.stringify(columnFilters ?? [])); // [{}, {}, {}]
      url.searchParams.set("globalFilter", globalFilter ?? "");
      url.searchParams.set("sorting", JSON.stringify(sorting ?? []));

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
        header: "Name",
        Header: ({ column }) => <HeaderCell column={column} />,
      },
      {
        accessorKey: "guardianPhoneNumber",
        header: "Phone Number",
        Header: ({ column }) => <HeaderCell column={column} />,
      },

      {
        accessorKey: "address",
        header: "Address",
        Header: ({ column }) => <HeaderCell column={column} />,
      },
      {
        accessorKey: "offerList",
        header: "Number of Offers",
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
                {cell.getValue().length}
              </Box>
            </>
          );
        },
      },
      {
        accessorKey: "tutor",
        header: "Tutor",
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
                {cell.getValue()}
              </Box>
            </>
          );
        },
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
      <Header title="All Tutors" subtitle="Entire list of tutors" />
      <MaterialReactTable
        columns={columns}
        data={data}
        getRowId={(row) => row._id}
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
        rowCount={rowCount}
        enableRowActions
        renderRowActions={({ row }) => (
          <div
            style={{
              display: "flex",
              flexWrap: "nowrap",
              gap: "0.5rem",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                // console.info("View Profile", row.id);
                navigate(`/tutorprofile/${row.id}`);
              }}
            >
              View Profile
            </Button>
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
    </Box>
  );
};

export default AllGuardians;
