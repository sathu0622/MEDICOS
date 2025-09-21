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

dotenv.config();
const app = express();
app.use(express.json());

app.use('/uploads', express.static('public/uploads'));

app.use(
  session({
    secret: "mysecret",
    resave: false,
    saveUninitialized: true,
  })
);


app.use(passport.initialize());
app.use(passport.session());


app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'], 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.options('*', cors());

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


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
