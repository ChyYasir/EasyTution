import { useTheme } from "@emotion/react";
import { Box, Button, Container, Paper, Typography } from "@mui/material";
import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetAvailableOfferQuery } from "../../state/api";
import MaterialReactTable from "material-react-table";

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
  //table state
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const params = useParams();

  console.log(params.id);
  const theme = useTheme();

  const { data, isLoading, isError } = useGetAvailableOfferQuery(params.id);

  console.log(data?.matchedTutors);
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
    return <div> Loading...</div>;
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
          <div>Yasir</div>
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
              {row.contacted ? (
                <Button
                  variant="contained"
                  color="primary"
                  //   onClick={toggleContacted}
                >
                  Not Contacted
                </Button>
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
                    //   onClick={toggleContacted}
                  >
                    Not Assign
                  </Button>
                  <Button variant="contained" color="secondary">
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
