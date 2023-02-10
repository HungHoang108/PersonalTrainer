import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { duration } from "@mui/material";

const columns = [
  //   { field: "id", headerName: "ID", width: 70 },
  { field: "duration", headerName: "Duration", width: 130 },
  { field: "activity", headerName: "activity", width: 130 },
  //   {
  //     field: "age",
  //     headerName: "Age",
  //     type: "number",
  //     width: 90,
  //   },
  //   {
  //     field: "fullName",
  //     headerName: "Full name",
  //     description: "This column has a value getter and is not sortable.",
  //     sortable: false,
  //     width: 160,
  //     valueGetter: (params) =>
  //       `${params.row.firstName || ""} ${params.row.lastName || ""}`,
  //   },
  //   { field: "date", headerName: "Date", width: 130 },
];

const rows = [
  { id: 1, lastName: "Snow", firstName: "Jon", age: 35, date: "hello" },
  { id: 2, lastName: "Lannister", firstName: "Cersei", age: 42 },
  { id: 3, lastName: "Lannister", firstName: "Jaime", age: 45 },
  { id: 4, lastName: "Stark", firstName: "Arya", age: 16 },
  { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
  { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
  { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
  { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
  { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
];

export default function Training() {
  const [training, setTraining] = useState([

  ]);
  const [fullName, setFullName] = useState([]);

  useEffect(() => {
    getTrainingData();
  }, []);

  const getTrainingData = async () => {
    const training = await axios.get(
      "http://traineeapp.azurewebsites.net/api/trainings"
    );
    const data = training.data.content;
    console.log(data)
    const training1 = {
        activity: data.activity,
        duration: data.duration,
    }
    setTraining(data);
  };

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={training}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
        getRowId={(row) => row.duration}
      />
    </div>
  );
}
