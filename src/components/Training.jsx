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
import NewTrainingModal from "./NewTrainingModal";

const Training = () => {
  const dayconvert = dayjs("2023-06-09").format();
  // const day1 = dayjs(dayconvert).format("DD MMM YYYY");
  // console.log(dayconvert)

  const [training, setTraining] = useState([]);
  const [modalStatus, setModalStatus] = useState(false);

  const columns = [
    {
      field: "customer",
      headerName: "Full name",
      description: "This column has a value getter and is not sortable.",
      sortable: true,
      width: 240,
      editable: true,
      valueGetter: (params) =>
        params.row.customer
          ? `${params.row.customer.firstname || ""} ${
              params.row.customer.lastname || ""
            }`
          : "null",
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
      valueGetter: (params) => dayjs(params.row.date).format("DD MMM YYYY"),
      // renderCell: (params) => {
      //   return (
      //     <LocalizationProvider dateAdapter={AdapterDayjs}>
      //       <DesktopDatePicker
      //         value={dayjs(params.row.date)}
      //         onChange={async (newValue) => {
      //           const newDate = `${newValue.$M}/${newValue.$D}/${newValue.$y}`;
      //           const dayconvert = dayjs(newDate).format();
      //           console.log(params.row.id)

      //           await axios
      //             .patch(`http://traineeapp.azurewebsites.net/api/trainings/${params.row.id}`, { date: dayconvert })
      //             .then(() => getTrainingData());
      //          ;
      //         }}
      //         renderInput={(params) => <TextField {...params} />}
      //       />
      //     </LocalizationProvider>
      //   );
      // },
    },
    {
      field: "actions",
      headerName: "Action",
      width: 230,
      sortable: false,
      renderCell: (params) => {
        return (
          <Button onClick={(e) => deleteTraining(params.id)}>Delete</Button>
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

  // const processRowUpdate = (newRow) => {
  //   const updatedRow = { ...newRow, isNew: false };
  //   console.log(updatedRow);
  //   return updatedRow;
  // };
  const AddNewTraining = () => {
    setModalStatus(!modalStatus);
  };

  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <NewTrainingModal />
      {/* {modalStatus && <NewTrainingModal />}
      <Button onClick={AddNewTraining} size="small" variant="outlined">
        Add New Training
      </Button> */}
      <DataGrid
        rows={training}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
        disableSelectionOnClick
        // processRowUpdate={processRowUpdate}
        experimentalFeatures={{ newEditingApi: true }}
        components={{ Toolbar: GridToolbar }}
      />
    </Box>
  );
};

export default Training;
