import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const currency = import.meta.env.VITE_CURRENCY;

  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [cars, setCars] = useState([]);

  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user/data");

      if (data.success) {
        setUser(data.user);
        setIsOwner(data.user.role === "owner");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchCars = async () => {
    try {
      const { data } = await axios.get("/api/user/cars");
      if (data.success) setCars(data.cars);
      else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setIsOwner(false);
    axios.defaults.headers.common["Authorization"] = "";
    toast.success("You have been logged out");
  };

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    setToken(savedToken);
    fetchCars();
  }, []);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = token;
      fetchUser();
    }
  }, [token]);

  const value = {
    navigate,
    currency,
    token,
    setToken,
    user,
    setUser,
    isOwner,
    setIsOwner,
    showLogin,
    setShowLogin,
    pickupDate,
    setPickupDate,
    returnDate,
    setReturnDate,
    axios,
    fetchUser,
    logout,
    fetchCars,
    cars,
    setCars,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
