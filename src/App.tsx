import { DarkThemeToggle } from "flowbite-react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Board from "./Components/Board";
import TopNav from "./Components/TopNav";
import Dashboard from "./Pages/Dashboard";
import Tasks from "./Pages/Tasks";
import TaskManagementApp from "./kanban";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />}></Route>
        <Route
          path="/projectmanagementview"
          element={<TaskManagementApp />}
        ></Route>
        <Route path="/Projects/:projectId" element={<Tasks />}></Route>
      </Routes>
    </Router>
  );
}

export default App;

// import React from "react";
// import TaskManagementApp from "./kanban";
// import KanBanJoin from "./kanbanjoin";

// const App: React.FC = () => {
//   return (
//     <div className="app-container">
//       <TaskManagementApp />
//     </div>
//   );
// };

// export default App;
