import "./App.scss";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Register from "./features/auth/register";
import Login from "./features/auth/login";
import UserManagement from "./features/userManagement/dashboard";
import ProtectedRoute from "./protectedRoutes";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <UserManagement />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
