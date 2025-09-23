import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv"; 
import UserOperations from './Controller/UserOperations.js';
import AppointmentOperations from './Controller/AppointmentOperations.js'
import ScheduleOperations from './Controller/ScheduleOperations.js'
import InventoryOperations from './Controller/InventoryOperations.js'
import PaymentOperations from './Controller/PaymentOperations.js'
import OrderOperations from './Controller/OrderOperations.js'
import FAQOperations from './Controller/FAQOperations.js'
import passport from "./config/passport.js";
import session from "express-session";
import helmet from "helmet";
import rateLimit from "express-rate-limit";


dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());

const limiter = rateLimit({ windowMs: 15*60*1000, max: 100 });
app.use(limiter);

app.use('/uploads', express.static('public/uploads'));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 1000*60*60
  }
}));


app.use(passport.initialize());
app.use(passport.session());

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed"), false);
    }
  },
  methods: ["GET","POST","PUT","DELETE"],
  credentials: true
}));


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
