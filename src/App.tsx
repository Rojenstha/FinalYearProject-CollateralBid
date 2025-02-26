import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import UserDashboard from "./components/UserDashboard";
import Landing from "./components/Landing";
import ForgotPassword from "./components/ForgotPassword";

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgotpassword" element={<ForgotPassword/>}/>
        <Route path="/user-dashboard" element={<UserDashboard />} /> 

      </Routes>
    </Router>
  );
}

export default App;
