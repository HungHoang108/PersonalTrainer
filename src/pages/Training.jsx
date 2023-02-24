import { useState, useContext } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { Button } from "@mui/material";
import NewTrainingModal from "../components/NewTrainingModal";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import { TrainingContext } from "../context/TrainingContext";

const Training = () => {
  const { training, getTrainingData } = useContext(TrainingContext);

  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const handleClickOpen = (id) => {
    setOpen(true);
    setDeleteId(id);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const columns = [
    {
      field: "customer.id",
      headerName: "Trainer Id",
      width: 140,
      editable: false,
      sortable: true,
      valueGetter: (params) =>
        params.row.customer
          ? `${params.row.customer.id || ""}`
          : "null",
    },
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
      width: 220,
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
      width: 180,
      sortable: false,
      renderCell: (params) => {
        return (
          <Button onClick={() => handleClickOpen(params.id)}>Delete</Button>
        );
      },
    },
  ];

  const deleteTraining = () => {
    try {
      axios
        .delete(
          `https://traineeapp.azurewebsites.net/api/trainings/${deleteId}`
        )
        .then(() => getTrainingData());
    } catch (error) {
      console.log(error);
    }
    setOpen(false);
  };

  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <NewTrainingModal reloadTraining={getTrainingData} />
      <DataGrid
        rows={training}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        disableSelectionOnClick
        experimentalFeatures={{ newEditingApi: true }}
        components={{ Toolbar: GridToolbar }}
        sx={{ mx: "auto", maxWidth: "80%" }} // add the sx prop here

      />
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure you want to delete this training?"}
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleClose}>No</Button>
          <Button onClick={deleteTraining} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Training;
