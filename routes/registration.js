const express = require("express");
const Registration = require("../models/Registration");
const { body, validationResult } = require("express-validator");
const fetchuser = require("../middleware/fetchuser");
const multer = require("multer");

// Storage staratagy for multer
const storageStrategy = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    if (
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png"
    ) {
      const extension = file.mimetype.slice(6, file.mimetype.length);
      cb(null, uniqueSuffix + "." + extension);
    }
  },
});
const upload = multer({ storage: storageStrategy });

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

//* Registration using POST: '/api/registration/'
router.post(
  "/",
  fetchuser,
  [
    //* Adding Validations using express-validator
    body("name", "Enter a Valid name").isLength({ min: 3 }),
    body("disability_type", "disability type is a required feild").exists(),
    body(
      "percentage_of_disability",
      "percentage of disability is a required field"
    ).exists(),
    body("udid", "UDID no. is a required feild").exists(),
    body("aadhar_number", "aadhar number is a required feild").exists(),
    body("address", "address is a required feild").exists(),
    body("zone", "zone is a required feild").exists(),
    body("annual_Income", "annual Income is a required feild").exists(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()[0] });
      }
      let user = await Registration.find({
        $or: [
          { user: req.user.id },
          { udid: req.body.udid },
          { aadhar_number: req.body.aadhar_number },
        ],
      });
      if (user.length) {
        return res.status(400).json({
          errors: "You have already Registered",
        });
      }
      const reg = new Registration({
        name: req.body.name,
        disability_type: req.body.disability_type,
        percentage_of_disability: req.body.percentage_of_disability,
        user: req.user.id,
        udid: req.body.udid,
        aadhar_number: req.body.aadhar_number,
        address: req.body.address,
        zone: req.body.zone,
        annual_Income: req.body.annual_Income,
      });
      const finalReg = await reg.save();
      res.json(finalReg);
    } catch (error) {
      //* Send Internal Server Error
      console.error(error.message);
      res.status(500).json({ errors: "Some error occured" });
    }
  }
);

//* UPLOAD UDID GET: '/api/registration/upload/udid'
router.post(
  "/upload/udid",
  fetchuser,
  upload.single("udid_url"),
  async (req, res) => {
    try {
      const user = await Registration.findOneAndUpdate(
        { user: req.user.id },
        {
          udid_url: req.file.path,
        },
        {
          new: true,
        }
      ).select("-password");
      res.json(user);
    } catch (error) {
      //* Send Internal Server Error
      console.error(error.message);
      res.status(500).send("Some error occured");
    }
  }
);

//* UPLOAD AADHAR GET: '/api/registration/upload/aadhar'
router.post(
  "/upload/aadhar",
  fetchuser,
  upload.single("aadhar_card_url"),
  async (req, res) => {
    try {
      const user = await Registration.findOneAndUpdate(
        { user: req.user.id },
        {
          aadhar_card_url: req.file.path,
        },
        {
          new: true,
        }
      ).select("-password");
      res.json(user);
    } catch (error) {
      //* Send Internal Server Error
      console.error(error.message);
      res.status(500).send("Some error occured");
    }
  }
);

//* UPLOAD IC GET: '/api/registration/upload/income'
router.post(
  "/upload/income",
  fetchuser,
  upload.single("income_certificate_url"),
  async (req, res) => {
    try {
      const user = await Registration.findOneAndUpdate(
        { user: req.user.id },
        {
          income_certificate_url: req.file.path,
        },
        {
          new: true,
        }
      ).select("-password");
      res.json(user);
    } catch (error) {
      //* Send Internal Server Error
      console.error(error.message);
      res.status(500).send("Some error occured");
    }
  }
);

//* GET Your info using GET: '/api/registration/info'
router.get("/info", fetchuser, async (req, res) => {
  try {
    const user = await Registration.findOne({ user: req.user.id });
    res.json(user);
  } catch (error) {
    //* Send Internal Server Error
    console.error(error.message);
    res.status(500).json({ errors: "Some error occured" });
  }
});
module.exports = router;
