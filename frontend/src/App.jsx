import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import AppointmentBooking from './Appointment/AppointmentBooking';
import AppointmentsPage from './Appointment/AppointmentsPage';
import Schedule from './Appointment/Schedule';
import Slots from './Appointment/Slots';
import Available from './Appointment/Available';
import UpdateAppointmentPage from './Appointment/UpdateAppointmentPage';
import UpdateSlot from './Appointment/UpdateSlot';
import Admin from './Admin/Admin';
import AdminDashboard from './Admin/AdminDashboard';
import UserBookings from './Appointment/UserBookings';
import DoctorBookings from './Appointment/DoctorBookings';

import Reviews from './FAQ/Reviews';
import MyReviews from './FAQ/MyReviews';
import UpdateReview from './FAQ/UpdateReview';
import FAQs from './FAQ/FAQs';
import Ask from './FAQ/Ask';
import UpdateFAQ from './FAQ/UpdateFAQ';
import Dashboard from './Users/Dashboard';

import Welcomepage from './pages/Welcomepage';
import Userhome from './pages/Userhome';
// import Footer from './pages/Footer';

import Payment from './Financial/Payment';
import UpdatePayment from './Financial/UpdatePayment';
import PayTable from './Financial/PayTable';
import UserPayments from './Financial/UserPayments';
import EditPay from './Financial/EditPay';

import Order from './Order/Order';
import OrderList from './Order/OrderList';
import OrderUpdateForm from './Order/OrderUpdateForm';
import OrdersTable from './Order/OrdersTable';

import StockAdd from './Inventory/StockAdd';
import SalePage from './Inventory/SalePage';
import InventoryPage from './Inventory/InventoryPage';
import UpdateInventory from './Inventory/UpdateInventory';

import Login from './Users/Login';
import Registration from './Users/Registration';
import UserTable from './Users/UserTable';
import UserUpdate from './Users/UserUpdate';
import Profile from './Users/Profile';

function App() {
  return (
    <BrowserRouter>
    
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/Schedule" element={<Schedule />} />
            <Route path="/Slots" element={<Slots />} />
            <Route path="/AppointmentBooking/:id" element={<AppointmentBooking />} />
            <Route path="/AppointmentsPage" element={<AppointmentsPage />} />
            <Route path="/UpdateAppointmentPage/:id" element={<UpdateAppointmentPage />} />
            <Route path="/Available" element={<Available />} />
            <Route path="/updateslot/:id" element={<UpdateSlot />} />
            <Route path="/UserBookings" element={<UserBookings />} />
            <Route path="/DoctorBookings" element={<DoctorBookings />} />
   
            <Route path="/Reviews" element={<Reviews />} />
            <Route path="/MyReviews" element={<MyReviews />} />
            <Route path="/UpdateReview" element={<UpdateReview />} />
            <Route path="/Ask" element={<Ask />} />
            <Route path="/FAQs" element={<FAQs />} />
            <Route path="/UpdateFAQ/:id" element={<UpdateFAQ />} />


            <Route path="/Admin" element={<Admin />} />
            <Route path="/AdminDashboard" element={<AdminDashboard />} />
     
            <Route path="/" element={<Welcomepage />} />
            <Route path="/Userhome" element={<Userhome />} />

            <Route path="/Payment" element={<Payment />} />
            <Route path="/UpdatePayment/:id" element={<UpdatePayment />} />
            <Route path="/EditPay/:id" element={<EditPay />} />
            <Route path="/PayTable" element={<PayTable />} />
            <Route path="/UserPayments" element={<UserPayments />} />

            <Route path="/Order" element={<Order />} />
            <Route path="/OrderList" element={<OrderList />} />
            <Route path="/OrderUpdateForm/:id" element={<OrderUpdateForm />} />
            <Route path="/OrdersTable" element={<OrdersTable />} />

            <Route path="/StockAdd" element={<StockAdd />} />
            <Route path="/SalePage" element={<SalePage />} />
            <Route path="/InventoryPage" element={<InventoryPage />} />
            <Route path="/UpdateInventory/:id" element={<UpdateInventory />} />

            <Route path="/Login" element={<Login />} />
            <Route path="/Registration" element={<Registration />} />
            <Route path="/UserTable" element={<UserTable />} />
            <Route path="/UserUpdate/:id" element={<UserUpdate />} />
            <Route path="/Profile" element={<Profile />} />
            
          </Routes>
      
    </BrowserRouter>
  );
}

export default App;