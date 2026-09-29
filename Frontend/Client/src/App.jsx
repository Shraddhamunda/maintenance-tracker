import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Requests from "./Pages/Request";
import CreateRequest from "./Pages/CreateRequest";
import EditRequest  from "./Pages/EditRequest";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Navigate to="/requests" />} />

          <Route path="/requests" element={<Requests />} />

          <Route path="/requests/new" element={<CreateRequest />} />
          <Route path="/requests/:id/edit" element={<EditRequest />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

