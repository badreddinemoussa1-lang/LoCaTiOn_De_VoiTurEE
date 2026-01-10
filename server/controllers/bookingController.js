import Booking from "../models/Booking.js";
import Car from "../models/Car.js";

// ✅ CHECK AVAILABILITY (PUBLIC)
export const checkAvailabilityOfCar = async (req, res) => {
  try {
    const { location, pickupDate, returnDate } = req.body;

    // ✅ validation
    if (!location || !pickupDate || !returnDate) {
      return res.json({
        success: false,
        message: "location, pickupDate and returnDate are required",
      });
    }

    const pickup = new Date(pickupDate);
    const dropoff = new Date(returnDate);

    // ✅ validation date
    if (pickup >= dropoff) {
      return res.json({
        success: false,
        message: "Return date must be after pickup date",
      });
    }

    // ✅ 1) Get all cars in that location and available
    const cars = await Car.find({
  isAvailable: true,
  location: { $regex: new RegExp(`^${location}$`, "i") },
});


    if (cars.length === 0) {
      return res.json({
        success: true,
        availableCars: [],
        message: "No cars found in this location",
      });
    }

    // ✅ 2) Get all bookings that overlap this range
    // overlap condition:
    // booking.pickupDate < dropoff AND booking.returnDate > pickup
    const bookedCars = await Booking.find({
      status: { $ne: "cancelled" },
      pickupDate: { $lt: dropoff },
      returnDate: { $gt: pickup },
    }).select("car");

    // ✅ 3) Convert booked car IDs to array
    const bookedCarIds = bookedCars.map((b) => b.car.toString());

    // ✅ 4) Filter cars not booked
    const availableCars = cars.filter(
      (car) => !bookedCarIds.includes(car._id.toString())
    );

    return res.json({
      success: true,
      availableCars,
    });
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: error.message });
  }
};

// ✅ CREATE BOOKING
export const createBooking = async (req, res) => {
  try {
    const { carId, pickupDate, returnDate, location } = req.body;
    const { _id } = req.user;

    if (!carId || !pickupDate || !returnDate || !location) {
      return res.json({
        success: false,
        message: "All fields are required",
      });
    }

    const car = await Car.findById(carId);
    if (!car || !car.isAvailable) {
      return res.json({ success: false, message: "Car not available" });
    }

    const pickup = new Date(pickupDate);
    const dropoff = new Date(returnDate);

    // ✅ check if already booked
    const conflict = await Booking.findOne({
      car: carId,
      status: { $ne: "cancelled" },
      pickupDate: { $lt: dropoff },
      returnDate: { $gt: pickup },
    });

    if (conflict) {
      return res.json({
        success: false,
        message: "Car already booked for these dates",
      });
    }

    // ✅ calculate price (days * pricePerDay)
    const days = Math.ceil((dropoff - pickup) / (1000 * 60 * 60 * 24));
    const totalPrice = days * car.pricePerDay;

    const booking = await Booking.create({
      user: _id,
      owner: car.owner,
      car: carId,
      pickupDate: pickup,
      returnDate: dropoff,
      location,
      price: totalPrice,
      status: "pending",
    });

    return res.json({
      success: true,
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: error.message });
  }
};

// ✅ GET USER BOOKINGS
export const getUserBookings = async (req, res) => {
  try {
    const { _id } = req.user;

    const bookings = await Booking.find({ user: _id })
      .populate("car")
      .sort({ createdAt: -1 });

    return res.json({ success: true, bookings });
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: error.message });
  }
};

// ✅ GET OWNER BOOKINGS
export const getOwnerBookings = async (req, res) => {
  try {
    const { _id, role } = req.user;

    if (role !== "owner") {
      return res.json({ success: false, message: "Unauthorized" });
    }

    const bookings = await Booking.find({ owner: _id })
      .populate("car")
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    return res.json({ success: true, bookings });
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: error.message });
  }
};

// ✅ CHANGE BOOKING STATUS
export const changeBookingStatus = async (req, res) => {
  try {
    const { bookingId, status } = req.body;
    const { _id, role } = req.user;

    if (role !== "owner") {
      return res.json({ success: false, message: "Unauthorized" });
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.json({ success: false, message: "Booking not found" });
    }

    if (booking.owner.toString() !== _id.toString()) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    booking.status = status;
    await booking.save();

    return res.json({
      success: true,
      message: `Booking status changed to ${status}`,
    });
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: error.message });
  }
};
