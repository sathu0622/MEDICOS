import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv"; 
import UserOperations from './Controller/UserOperations.js';
import AppointmentOperations from './Routes/appointmentRoutes.js'
import ScheduleOperations from './Routes/scheduleRoutes.js'
import InventoryOperations from './Routes/inventoryRoutes.js'
import PaymentOperations from './Routes/paymentRoutes.js'
import OrderOperations from './Routes/orderRoutes.js'
import FAQOperations from './Routes/faqRoutes.js'
import passport from "./config/passport.js";
import session from "express-session";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import csurf from "csurf";
import { sanitizeInput } from './middleware/sanitizeInput.js';


dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(cookieParser())

// Enhanced rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: "Too many requests from this IP, please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to API routes only
app.use('/UserOperations', limiter);
app.use('/PaymentOperations', limiter);
app.use('/OrderOperations', limiter);
app.use('/InventoryOperations', limiter);
app.use('/AppointmentOperations', limiter);
app.use('/ScheduleOperations', limiter);
app.use('/FAQOperations', limiter);

app.use('/uploads', express.static('public/uploads'));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 1000 * 60 * 60
  }
}));

const isProd = process.env.NODE_ENV === "production";
const csrfProtection = csurf({
  cookie: {
    httpOnly: true, // frontend should be able to read CSRF cookie (or you can use CSRF endpoint response)
    secure: false,
    sameSite: "lax",
  },
});

app.get("/csrf-token", csrfProtection, (req, res) => {
  // set cookie AND return token
  res.cookie("_csrf", req.csrfToken(), {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });
  res.json({ csrfToken: req.csrfToken() });
});


// CSRF error handler - make sure it's before your generic error handler (or inside it)
app.use((err, req, res, next) => {
  if (err && err.code === "EBADCSRFTOKEN") {
    // invalid CSRF token
    return res.status(403).json({ message: "Invalid CSRF token" });
  }
  next(err);
});


app.use(passport.initialize());
app.use(passport.session());

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || ["http://localhost:5173"];
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin); // Add logging for debugging
      callback(new Error("CORS not allowed"), false);
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Add OPTIONS method
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'], // Add necessary headers
}));

// TEMPORARY - Only for development
app.use(cors({
  origin: true, // Allow all origins
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
}));

// Apply global input sanitization (blocks dangerous keys)
app.use(sanitizeInput());

// Apply to specific routes with field whitelisting
app.use('/PaymentOperations', sanitizeInput([
  'userId', 'Repname', 'email', 'Contactno', 'BookRef', 'payRef', 'cnum', 'type', 'cmonth', 'cyear'
]), PaymentOperations);

app.use('/OrderOperations', sanitizeInput([
  'name', 'email', 'contactNo', 'orderDate', 'shippingAddress', 'qty', 'remarks'
]), OrderOperations);

app.use('/UserOperations', sanitizeInput([
  'name', 'email', 'mobile', 'gender', 'type', 'password'
]), UserOperations);

app.use("/UserOperations", UserOperations);
app.use("/AppointmentOperations", AppointmentOperations);
app.use("/ScheduleOperations", ScheduleOperations);
app.use("/InventoryOperations", InventoryOperations);
app.use("/PaymentOperations", PaymentOperations);
app.use("/OrderOperations", OrderOperations);
app.use("/FAQOperations", FAQOperations);


mongoose.connect(process.env.db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.log("MongoDB connection error:", err));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Server error" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
