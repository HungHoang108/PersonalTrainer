import { useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { Button } from "@mui/material";
import TextField from "@mui/material/TextField";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";

const Training = () => {

  const dayconvert = dayjs("02/11/2023").format()
  console.log(dayconvert, "1ssssss")
  const day1 = dayjs(dayconvert).format("DD MMM YYYY")
  console.log("day1", day1)

  const [training, setTraining] = useState([]);
  const [value, setValue] = useState(null);
  const columns = [
    {
      field: "customer",
      headerName: "Full name",
      description: "This column has a value getter and is not sortable.",
      sortable: true,
      width: 240,
      editable: true,
      valueGetter: (params) =>
        `${params.row.customer.firstname || ""} ${
          params.row.customer.lastname || ""
        }`,
    },
    {
      field: "duration",
      headerName: "Duration (mins)",
      width: 240,
      editable: true,
    },
    {
      field: "activity",
      headerName: "Activity",
      width: 240,
      editable: true,
    },
    {
      field: "date",
      headerName: "Date",
      width: 220,
      editable: false,
      // valueGetter: (params) => dayjs(params.row.date).format("DD MMM YYYY"),
      renderCell: (params) => {
        return (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              value={value ? value : dayjs(params.row.date)}
              onChange={(newValue) => {
                
                console.log(newValue.$D)
                setValue(newValue);
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        );
      },
    },
    {
      field: "actions",
      headerName: "Action",
      width: 230,
      sortable: false,
      renderCell: (params) => {
        return (
          <div>
            <Button onClick={(e) => deleteTraining(params.id)}>Delete</Button>

            <Button onClick={(e) => console.log(params.id)} variant="contained">
              Edit
            </Button>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    getTrainingData();
  }, []);

  const getTrainingData = async () => {
    const getTraining = await axios.get(
      "https://traineeapp.azurewebsites.net/gettrainings"
    );
    const data = getTraining.data;
    setTraining(data);
  };
  const deleteTraining = (id) => {
    try {
      axios
        .delete(`http://traineeapp.azurewebsites.net/api/trainings/${id}`)
        .then(() => getTrainingData());
    } catch (error) {
      console.log(error);
    }
  };

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    console.log(updatedRow);
    return updatedRow;
  };

  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={training}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
        disableSelectionOnClick
        processRowUpdate={processRowUpdate}
        experimentalFeatures={{ newEditingApi: true }}
        components={{ Toolbar: GridToolbar }}
      />
    </Box>
  );
};

export default Training;
