import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { JSX, useContext } from "react";
import { AuthContext, AuthProvider } from "./pages/Login/authContext";
import { Login } from "./pages/Login/LoginPage";

import Dashboard from "./pages/Dashboard/Dashboard";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { token } = useContext(AuthContext)!;
  return token ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
