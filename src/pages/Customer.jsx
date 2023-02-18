import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { Button } from "@mui/material";
import NewCustomerModal from "../components/NewCustomerModal";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";

const Customer = () => {
  const [snackbar, setSnackbar] = useState(null);
  const handleCloseSnackbar = () => setSnackbar(null);
  const [customers, setCustomers] = useState([]);
  const [modalStatus, setModalStatus] = useState(false);

  const nav = useNavigate();
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
        return <Button onClick={() => deleteCustomer(params.row.links[1].href)}>Delete</Button>
       
      
      },
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
  const deleteCustomer = (url) => {
    try {
      axios.delete(url).then(() => getCustomerData());
    } catch (error) {
      console.log(error);
    }
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
