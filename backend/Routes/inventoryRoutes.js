// import express from "express";
// import multer from "multer";
// import path from "path";
// import { body, param } from "express-validator";

// import {
//   createStock,
//   getAllStock,
//   getStockById,
//   deleteStock,
//   updateStock,
// } from "../Controller/InventoryOperations.js";

// const router = express.Router();

// // Multer config
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public/uploads/");
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });
// const upload = multer({ storage });

// // Validation rules
// const stockValidation = [
//   body("Product").trim().escape().notEmpty().withMessage("Product is required"),
//   body("category").trim().escape().notEmpty().withMessage("Category is required"),
//   body("Formulation").trim().escape(),
//   body("manufecturer").trim().escape(),
//   body("Regulatory_status").trim().escape(),
//   body("Description").trim().escape(),
//   body("lastUpadte").isISO8601().withMessage("Invalid date"),
// ];

// // Routes with parameter validation
// router.post("/Stock", upload.single("Img"), stockValidation, createStock);
// router.get("/getstock", getAllStock);
// router.get("/getstock/:id", param("id").isMongoId().withMessage("Invalid stock ID"), getStockById);
// router.delete("/deletestock/:id", param("id").isMongoId().withMessage("Invalid stock ID"), deleteStock);
// router.put("/updatestock/:id", upload.single("Img"), param("id").isMongoId().withMessage("Invalid stock ID"), updateStock);

// export default router;


import express from "express";
import multer from "multer";
import path from "path";
import { body, param } from "express-validator";
import {
  createStock,
  getAllStock,
  getStockById,
  deleteStock,
  updateStock,
} from "../Controller/InventoryOperations.js";
import { authenticateUser, authorizeRoles } from "../middleware/authenticateUser.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

const stockValidation = [
  body("Product").trim().escape().notEmpty().withMessage("Product is required"),
  body("category").trim().escape().notEmpty().withMessage("Category is required"),
  body("Formulation").trim().escape(),
  body("manufecturer").trim().escape(),
  body("Regulatory_status").trim().escape(),
  body("Description").trim().escape(),
  body("lastUpadte").isISO8601().withMessage("Invalid date"),
];

router.post("/Stock", authenticateUser, authorizeRoles("admin"), upload.single("Img"), stockValidation, createStock);
router.get("/getstock", authenticateUser, authorizeRoles("admin", "user", "doctor"), getAllStock);
router.get("/getstock/:id", authenticateUser, param("id").isMongoId(), getStockById);
router.delete("/deletestock/:id", authenticateUser, authorizeRoles("admin"), param("id").isMongoId(), deleteStock);
router.put("/updatestock/:id", authenticateUser, authorizeRoles("admin"), upload.single("Img"), param("id").isMongoId(), updateStock);

export default router;
