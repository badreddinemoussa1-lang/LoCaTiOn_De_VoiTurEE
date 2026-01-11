import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Cars from "./pages/Cars";
import CarDetails from "./pages/CarDetails";
import MyBookings from "./pages/MyBookings";

import Layout from "./pages/owner/Layout";
import Dashboard from "./pages/owner/Dashboard";
import ManageCars from "./pages/owner/ManageCars";
import ManageBookings from "./pages/owner/ManageBookings";
import Addcar from "./pages/owner/Addcar";
import Login from "./components/owner/Login";

import { Toaster } from "react-hot-toast";
import { useAppContext } from "./context/AppContext";

const App = () => {
  const { showLogin } = useAppContext();
  const isOwnerPath = useLocation().pathname.startsWith("/owner");

  return (
    <div className="min-h-screen flex flex-col">
      <Toaster />

      {showLogin && <Login />}

      {!isOwnerPath && <Navbar />}

      {/* ✅ main takes all remaining height */}
      <div className="flex-1 pb-16">

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/car-details/:id" element={<CarDetails />} />
          <Route path="/cars" element={<Cars />} />
          <Route path="/my-bookings" element={<MyBookings />} />

          <Route path="/owner" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="add-car" element={<Addcar />} />
            <Route path="manage-cars" element={<ManageCars />} />
            <Route path="manage-bookings" element={<ManageBookings />} />
          </Route>
        </Routes>
      </div>

      {/* ✅ footer forced to bottom */}
      {!isOwnerPath && (
        <div className="mt-auto">
          <Footer />
        </div>
      )}
    </div>
  );
};

export default App;
