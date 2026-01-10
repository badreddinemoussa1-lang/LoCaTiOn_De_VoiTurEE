// server/controllers/ownerController.js
import User from "../models/User.js";
import Car from "../models/Car.js";
import imagekit from "../configs/imageKit.js";
import fs from "fs";
import Booking from "../models/Booking.js";

// ✅ Change role to owner
export const changeRoleToOwner = async (req, res) => {
  try {
    const { _id } = req.user;

    await User.findByIdAndUpdate(_id, { role: "owner" });

    return res.json({ success: true, message: "Now you can list cars" });
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: error.message });
  }
};

// ✅ Add car
export const addCar = async (req, res) => {
  try {
    const { _id } = req.user;

    if (!req.body.carData) {
      return res.json({ success: false, message: "carData is required" });
    }

    if (!req.file) {
      return res.json({ success: false, message: "image is required" });
    }

    const carData = JSON.parse(req.body.carData);
    const imageFile = req.file;

    // ✅ Upload image to ImageKit
    const fileBuffer = fs.readFileSync(imageFile.path);

    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "/cars",
    });

    // ✅ Remove temp file
    fs.unlinkSync(imageFile.path);

    // ✅ Optimize URL
    const optimizedImageUrl = imagekit.url({
      path: response.filePath,
      transformation: [
        { width: "1280" },
        { quality: "auto" },
        { format: "webp" },
      ],
    });

    await Car.create({
      ...carData,
      owner: _id,
      image: optimizedImageUrl,
      isAvailable: true, // ✅ default available
    });

    return res.json({ success: true, message: "Car Added" });
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: error.message });
  }
};

// ✅ Get owner cars
export const getOwnerCars = async (req, res) => {
  try {
    const { _id } = req.user;

    const cars = await Car.find({ owner: _id }).sort({ createdAt: -1 });

    return res.json({ success: true, cars });
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: error.message });
  }
};

// ✅ Toggle availability
export const toggleCarAvailability = async (req, res) => {
  try {
    const { _id } = req.user;
    const { carId } = req.body;

    const car = await Car.findById(carId);

    if (!car) {
      return res.json({ success: false, message: "Car not found" });
    }

    if (car.owner?.toString() !== _id.toString()) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    car.isAvailable = !car.isAvailable;
    await car.save();

    return res.json({
      success: true,
      message: `Car is now ${car.isAvailable ? "Available" : "Unavailable"}`,
      isAvailable: car.isAvailable,
    });
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: error.message });
  }
};

// ✅ Delete car (soft delete)
export const deleteCar = async (req, res) => {
  try {
    const { _id } = req.user;
    const { carId } = req.body;

    const car = await Car.findById(carId);

    if (!car) {
      return res.json({ success: false, message: "Car not found" });
    }

    if (car.owner?.toString() !== _id.toString()) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    // ✅ Soft delete
    car.owner = null;
    car.isAvailable = false;
    await car.save();

    return res.json({ success: true, message: "Car Removed" });
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: error.message });
  }
};

// ✅ Dashboard data
export const getDashboardData = async (req, res) => {
  try {
    const { _id, role } = req.user;

    if (role !== "owner") {
      return res.json({ success: false, message: "Unauthorized" });
    }

    const cars = await Car.find({ owner: _id });

    const bookings = await Booking.find({ owner: _id })
      .populate("car")
      .sort({ createdAt: -1 });

    const pendingBookings = bookings.filter((b) => b.status === "pending");
    const completedBookings = bookings.filter((b) => b.status === "confirmed");

    // ✅ monthly revenue
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const monthlyRevenue = bookings
      .filter(
        (b) =>
          b.status === "confirmed" &&
          new Date(b.createdAt) >= firstDayOfMonth &&
          new Date(b.createdAt) < nextMonth
      )
      .reduce((acc, b) => acc + b.price, 0);

    return res.json({
      success: true,
      dashboardData: {
        totalCars: cars.length,
        totalBookings: bookings.length,
        pendingBookings: pendingBookings.length,
        completedBookings: completedBookings.length,
        recentBookings: bookings.slice(0, 3),
        monthlyRevenue,
      },
    });
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: error.message });
  }
};

// ✅ Update user image
export const updateUserImage = async (req, res) => {
  try {
    const { _id } = req.user;

    if (!req.file) {
      return res.json({ success: false, message: "Image is required" });
    }

    const imageFile = req.file;
    const fileBuffer = fs.readFileSync(imageFile.path);

    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "/users",
    });

    fs.unlinkSync(imageFile.path);

    const optimizedImageUrl = imagekit.url({
      path: response.filePath,
      transformation: [
        { width: "400" },
        { quality: "auto" },
        { format: "webp" },
      ],
    });

    const user = await User.findByIdAndUpdate(
      _id,
      { image: optimizedImageUrl },
      { new: true }
    ).select("-password");

    return res.json({ success: true, message: "Image updated", user });
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: error.message });
  }
};
