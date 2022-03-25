const mongoose = require("mongoose");

const RegistrationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  name: {
    type: String,
    required: true,
  },
  disability_type: {
    type: String,
    required: true,
  },
  percentage_of_disability: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  udid: {
    type: String,
    required: true,
    unique: true,
  },
  aadhar_number: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: String,
    required: true,
  },
  zone: {
    type: String,
    required: true,
  },
  annual_Income: {
    type: Number,
    required: true,
  },
  udid_url: {
    type: String,
  },
  aadhar_card_url: {
    type: String,
  },
  income_certificate_url: {
    type: String,
  },
  status: {
    type: String,
    enum: ["processed", "verified", "reject"],
    default: "processed",
  },
});
module.exports = mongoose.model("Registration", RegistrationSchema);
