import { useState, useEffect, useCallback } from "react";
import axios from "axios";
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
  const [cusId, setCusId] = useState(null);

  const handleClickOpen = (customerId) => {
    setOpen(true);
    setCusId(customerId);
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
      renderCell: (params) => {
        const url = params.row.links[1].href;
        return (
          <Button
            onClick={() =>
              handleClickOpen(url.slice(url.length - 3, url.length))
            }
          >
            Delete
          </Button>
        );
      },
    },
  ];

  useEffect(() => {
    getCustomerData();
  }, []);

  const getCustomerData = async () => {
    try {
      const getCustomers = await axios.get(
        "https://traineeapp.azurewebsites.net/api/customers"
      );
      const data = getCustomers.data.content;
      setCustomers(data);
    } catch (error) {
      console.log(error);
    }
  };
  const deleteCustomer = () => {
    try {
      axios
        .delete(`https://traineeapp.azurewebsites.net/api/customers/${cusId}`)
        .then(() => getCustomerData());
    } catch (error) {
      console.log(error);
    }
    setOpen(false);
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
        sx={{ mx: "auto", maxWidth: "80%" }}
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
