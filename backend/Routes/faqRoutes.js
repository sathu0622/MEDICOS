// // routes/faqRoutes.js
// import express from "express";
// import {
//     createFAQ,
//     getFAQsByUser,
//     getAllFAQs,
//     getFAQById,
//     deleteFAQ,
//     updateFAQ
// } from "../Controller/FAQOperations.js";

// const router = express.Router();

// router.post("/ask", createFAQ);
// router.get("/getfaq/user/:userId", getFAQsByUser);
// router.get("/getfaq", getAllFAQs);
// router.get("/getfaq/:id", getFAQById);
// router.delete("/deletefaq/:id", deleteFAQ);
// router.put("/updatefaq/:id", updateFAQ);

// export default router;


import express from "express";
import {
  createFAQ,
  getFAQsByUser,
  getAllFAQs,
  getFAQById,
  deleteFAQ,
  updateFAQ
} from "../Controller/FAQOperations.js";
import { authenticateUser, authorizeRoles } from "../middleware/authenticateUser.js";

const router = express.Router();

router.post("/ask", authenticateUser, authorizeRoles("user", "admin"), createFAQ);
router.get("/getfaq/user/:userId", authenticateUser, getFAQsByUser);
router.get("/getfaq", authenticateUser, authorizeRoles("admin"), getAllFAQs);
router.get("/getfaq/:id", authenticateUser, getFAQById);
router.delete("/deletefaq/:id", authenticateUser, authorizeRoles("admin"), deleteFAQ);
router.put("/updatefaq/:id", authenticateUser, authorizeRoles("admin"), updateFAQ);

export default router;
