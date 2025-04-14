import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

axios.defaults.withCredentials = true;

import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./components/user/Home";

import Landing from "./components/landing/Landing";
import ForgotPassword from "./components/ForgotPassword";
import ForgotBank from "./components/forgotbankcode";
import ResetPassword from "./components/ResetPassword";
import ResetBank from "./components/resetBank";

import UserDashboard from "./components/user/UserDashboard";

import AuctionCard from "./components/Products/AuctionCard";
import ProductDetail from "./components/Products/ProductDetails";

import ManagerDashboard from "./components/manager/ManagerDashboard";
import InAuction from "./components/manager/InAuction";
import ManagerNotification from "./components/manager/Notifications";
import SuccessAuction from "./components/manager/SuccessAuction";
import SendMessage from "./components/manager/SendMessage";
import Transaction from "./components/manager/Transaction";

import AdminDashboard from "./components/admin/AdminDashboard";
import AdminLogin from "./components/admin/Login";
import AdminBanks from "./components/admin/Banks";
import AdminInAuction from "./components/admin/InAuction";
import AdminManager from "./components/admin/Managers";
import AdminMessages from "./components/admin/Messages";
import AdminRegister from "./components/admin/Register";
import AdminTransaction from "./components/admin/Transaction";
import AdminUsers from "./components/admin/Users";
import AdminVerifyAuction from "./components/admin/VerifyAuction";
import AdminVerifyUser from "./components/admin/VerifyUser";
import axios from "axios";
import { AuthProvider } from "./components/AuthContext";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/forgotbankcode" element={<ForgotBank />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/reset-bank/:token" element={<ResetBank />} />

        <Route path="/user-dashboard" element={<UserDashboard />} />

        <Route path="/product" element={<AuctionCard />} />
        <Route path="/product/:productId" element={<ProductDetail />} />

        <Route path="/home" element={<Home />} />
        <Route path="/manager-dashboard" element={<ManagerDashboard />} />
        <Route path="/in-auction" element={<InAuction />} />
        <Route path="/manager-notification" element={<ManagerNotification />} />
        <Route path="/send-message" element={<SendMessage />} />
        <Route path="/success-auction" element={<SuccessAuction />} />
        <Route path="/transaction" element={<Transaction />} />

        <Route path="/cb-ad" element={<AdminLogin />} />
        <Route path="/cb-ad/register" element={<AdminRegister />} />
        <Route path="/cb-ad/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/cb-ad/banks" element={<AdminBanks />} />
        <Route path="/cb-ad/in-auction" element={<AdminInAuction />} />
        <Route path="/cb-ad/managers" element={<AdminManager />} />
        <Route path="/cb-ad/messages" element={<AdminMessages />} />
        <Route path="/cb-ad/transaction" element={<AdminTransaction />} />
        <Route path="/cb-ad/users" element={<AdminUsers />} />
        <Route path="/cb-ad/verifyauctions" element={<AdminVerifyAuction />} />
        <Route path="/cb-ad/verifyusers" element={<AdminVerifyUser />} />
      </Routes>
    </Router>
  );
}

export default App;
