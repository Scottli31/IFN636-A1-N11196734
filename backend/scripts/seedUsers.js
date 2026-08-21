const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const connectDB = require("../config/db");
const User = require("../models/User");

const seedUsers = async () => {
  try {
    await connectDB();

    const users = [
      {
        email: process.env.PASSENGER_EMAIL,
        password: process.env.PASSENGER_PASSWORD,
        role: "Passenger",
      },
      {
        email: process.env.STAFF_EMAIL,
        password: process.env.STAFF_PASSWORD,
        role: "Staff",
      },
    ];

    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);

      await User.findOneAndUpdate(
        { email: user.email },
        {
          email: user.email,
          password: hashedPassword,
          role: user.role,
        },
        {
          upsert: true,
          new: true,
          runValidators: true,
        }
      );
    }

    console.log("Test users seeded successfully");
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Failed to seed users:", error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedUsers();