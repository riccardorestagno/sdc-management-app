import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { JSX, useContext } from "react";
import { AuthContext, AuthProvider } from "./pages/Login/authContext";
import { Login } from "./pages/Login/LoginPage";

import Dashboard from "./pages/Dashboard/Dashboard";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useContext(AuthContext)!;
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useContext(AuthContext)!;
  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
