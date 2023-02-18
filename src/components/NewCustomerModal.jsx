import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import moment from "moment";
import axios from "axios";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function NewCustomerModal(props) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: 0,
    streetaddress: "",
    postcode: 0,
    city: "",
  });
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleInput = (e) => {
    const name = e.target.name;
    const newValue = e.target.value;
    setInput((prev) => {
      return {
        ...prev,
        [name]: newValue,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // const newTraining = {
    //   activity: input.activity,
    //   duration: input.duration,
    //   customer: `http://traineeapp.azurewebsites.net/api/customers/${input.customerId}`,
    //   date: moment(input.date).toISOString(),
    // };
    await axios
      .post("http://traineeapp.azurewebsites.net/api/customers", input)
      .then(() => props.reloadCustomers());
    setOpen(false);
  };
  return (
    <div>
      <Button onClick={handleOpen}>Add New Customer</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} component="form" onSubmit={handleSubmit}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            New Customer
          </Typography>
          <TextField
            margin="normal"
            required
            fullWidth
            type="text"
            label="First Name"
            name="firstname"
            autoComplete="text"
            autoFocus
            onChange={handleInput}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            type="text"
            label="Last Name"
            name="lastname"
            autoComplete="text"
            autoFocus
            onChange={handleInput}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            type="email"
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={handleInput}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="phone"
            label="Phone"
            type="number"
            autoComplete="number"
            onChange={handleInput}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            type="text"
            label="Street Address"
            name="streetaddress"
            autoComplete="text"
            autoFocus
            onChange={handleInput}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="postcode"
            label="Post Code"
            type="number"
            autoComplete="number"
            onChange={handleInput}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            type="text"
            label="City"
            name="city"
            autoComplete="text"
            autoFocus
            onChange={handleInput}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClose={handleClose}
          >
            Create
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
