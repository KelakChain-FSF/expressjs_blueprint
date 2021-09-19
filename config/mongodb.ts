import mongoose from "mongoose";
require("dotenv").config();
const UsersCore = mongoose.createConnection("mongodb://localhost:27017/users", {
  dbName: "users",
  user: "root",
  pass: "",
  autoIndex: true,
  autoCreate: true,
  bufferCommands: true,
});

exports.UsersCore = UsersCore;
