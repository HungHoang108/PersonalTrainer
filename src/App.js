
import { Routes, Route } from "react-router-dom";
import Training from "./components/Training";
import Home from "./pages/Home";
import SideBar from "./components/SideBar";

import "./App.css";

function App() {
  return (
    <div className="App">

      <SideBar />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/training" element={<Training />}></Route>
        {/* <Route path="/projects" element={<ProjectsList />}></Route>
        <Route path="/projects/:projectId" element={<ProjectDetail />}></Route>
        <Route path="/create" element={<CreateProjectsPage />}></Route>
        <Route path="/users" element={<Users />}></Route> */}
      </Routes>
    </div>
  );
}

export default App;
