import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { Button } from "@mui/material";
import NewCustomerModal from "../components/NewCustomerModal";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";

const Customer = () => {
  const [snackbar, setSnackbar] = useState(null);
  const handleCloseSnackbar = () => setSnackbar(null);
  const [customers, setCustomers] = useState([]);
  const [modalStatus, setModalStatus] = useState(false);

  const [open, setOpen] = useState(false);
  const [deleteUrl, setDeleteUrl] = useState(null);

  const handleClickOpen = (url) => {
    setOpen(true);
    setDeleteUrl(url);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const columns = [
    {
      field: "firstname",
      headerName: "First name",
      description: "This column has a value getter and is not sortable.",
      sortable: true,
      width: 110,
      editable: true,
    },
    {
      field: "lastname",
      headerName: "LastName",
      width: 150,
      editable: true,
      sortable: true,
    },
    {
      field: "streetaddress",
      headerName: "Street Address",
      width: 200,
      editable: true,
      sortable: true,
    },
    {
      field: "city",
      headerName: "City",
      width: 150,
      editable: true,
      sortable: true,
    },
    {
      field: "email",
      headerName: "Email",
      width: 200,
      editable: true,
      sortable: true,
    },
    {
      field: "phone",
      headerName: "Phone",
      width: 180,
      editable: true,
      sortable: true,
    },
    {
      field: "actions",
      headerName: "Action",
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Button onClick={() => handleClickOpen(params.row.links[1].href)}>
          Delete
        </Button>
      ),
    },
  ];

  useEffect(() => {
    getCustomerData();
  }, []);

  const getCustomerData = async () => {
    const getCustomers = await axios.get(
      "http://traineeapp.azurewebsites.net/api/customers"
    );
    const data = getCustomers.data.content;
    setCustomers(data);
  };
  const deleteCustomer = () => {
    try {
      axios.delete(deleteUrl).then(() => getCustomerData());
    } catch (error) {
      console.log(error);
    }
    setOpen(false)
  };

  const processRowUpdate = async (newRow) => {
    // const updatedRow = { ...newRow, isNew: false };
    const updateData = {
      firstname: newRow.firstname,
      lastname: newRow.lastname,
      email: newRow.email,
      phone: newRow.phone,
      streetaddress: newRow.streetaddress,
      postcode: newRow.postcode,
      city: newRow.city,
    };
    await axios
      .put(newRow.links[1].href, updateData)
      .then(() => getCustomerData());
  };
  const handleProcessRowUpdateError = useCallback((error) => {
    setSnackbar({ children: error.message, severity: "error" });
  }, []);
  return (
    <Box sx={{ height: 500, width: "100%" }}>
      <NewCustomerModal reloadCustomers={getCustomerData} />
      <DataGrid
        rows={customers}
        getRowId={(row) => row.links[1].href}
        columns={columns}
        experimentalFeatures={{ newEditingApi: true }}
        pageSize={5}
        rowsPerPageOptions={[5]}
        disableSelectionOnClick
        processRowUpdate={processRowUpdate}
        components={{ Toolbar: GridToolbar }}
        onProcessRowUpdateError={handleProcessRowUpdateError}
      />
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure you want to delete this customer?"}
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleClose}>No</Button>
          <Button onClick={deleteCustomer} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      {/* {!!snackbar && (
        <Snackbar
          open
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          onClose={handleCloseSnackbar}
          autoHideDuration={6000}
        >
          <Alert {...snackbar} onClose={handleCloseSnackbar} />
        </Snackbar>
      )} */}
    </Box>
  );
};

export default Customer;
