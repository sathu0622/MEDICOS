// import './App.css';
// import { BrowserRouter, Route, Routes } from 'react-router-dom';

// import AppointmentBooking from './Appointment/AppointmentBooking';
// import AppointmentsPage from './Appointment/AppointmentsPage';
// import Schedule from './Appointment/Schedule';
// import Slots from './Appointment/Slots';
// import Available from './Appointment/Available';
// import UpdateAppointmentPage from './Appointment/UpdateAppointmentPage';
// import UpdateSlot from './Appointment/UpdateSlot';
// import Admin from './Admin/Admin';
// import AdminDashboard from './Admin/AdminDashboard';
// import UserBookings from './Appointment/UserBookings';
// import DoctorBookings from './Appointment/DoctorBookings';

// import Reviews from './FAQ/Reviews';
// import MyReviews from './FAQ/MyReviews';
// import UpdateReview from './FAQ/UpdateReview';
// import FAQs from './FAQ/FAQs';
// import Ask from './FAQ/Ask';
// import UpdateFAQ from './FAQ/UpdateFAQ';
// import Dashboard from './Users/Dashboard';

// import Welcomepage from './pages/Welcomepage';
// import Userhome from './pages/Userhome';
// // import Footer from './pages/Footer';

// import Payment from './Financial/Payment';
// import UpdatePayment from './Financial/UpdatePayment';
// import PayTable from './Financial/PayTable';
// import UserPayments from './Financial/UserPayments';
// import EditPay from './Financial/EditPay';

// import Order from './Order/Order';
// import OrderList from './Order/OrderList';
// import OrderUpdateForm from './Order/OrderUpdateForm';
// import OrdersTable from './Order/OrdersTable';

// import StockAdd from './Inventory/StockAdd';
// import SalePage from './Inventory/SalePage';
// import InventoryPage from './Inventory/InventoryPage';
// import UpdateInventory from './Inventory/UpdateInventory';

// import Login from './Users/Login';
// import Registration from './Users/Registration';
// import UserTable from './Users/UserTable';
// import UserUpdate from './Users/UserUpdate';
// import Profile from './Users/Profile';
// import { AuthProvider } from './context/AuthContext';

// function App() {
//   return (
//     <AuthProvider>
//     <BrowserRouter>
    
//           <Routes>
//             <Route path="/dashboard" element={<Dashboard />} />
//             <Route path="/Schedule" element={<Schedule />} />
//             <Route path="/Slots" element={<Slots />} />
//             <Route path="/AppointmentBooking/:id" element={<AppointmentBooking />} />
//             <Route path="/AppointmentsPage" element={<AppointmentsPage />} />
//             <Route path="/UpdateAppointmentPage/:id" element={<UpdateAppointmentPage />} />
//             <Route path="/Available" element={<Available />} />
//             <Route path="/updateslot/:id" element={<UpdateSlot />} />
//             <Route path="/UserBookings" element={<UserBookings />} />
//             <Route path="/DoctorBookings" element={<DoctorBookings />} />
   
//             <Route path="/Reviews" element={<Reviews />} />
//             <Route path="/MyReviews" element={<MyReviews />} />
//             <Route path="/UpdateReview" element={<UpdateReview />} />
//             <Route path="/Ask" element={<Ask />} />
//             <Route path="/FAQs" element={<FAQs />} />
//             <Route path="/UpdateFAQ/:id" element={<UpdateFAQ />} />


//             <Route path="/Admin" element={<Admin />} />
//             <Route path="/AdminDashboard" element={<AdminDashboard />} />
     
//             <Route path="/" element={<Welcomepage />} />
//             <Route path="/Userhome" element={<Userhome />} />

//             <Route path="/Payment" element={<Payment />} />
//             <Route path="/UpdatePayment/:id" element={<UpdatePayment />} />
//             <Route path="/EditPay/:id" element={<EditPay />} />
//             <Route path="/PayTable" element={<PayTable />} />
//             <Route path="/UserPayments" element={<UserPayments />} />

//             <Route path="/Order" element={<Order />} />
//             <Route path="/OrderList" element={<OrderList />} />
//             <Route path="/OrderUpdateForm/:id" element={<OrderUpdateForm />} />
//             <Route path="/OrdersTable" element={<OrdersTable />} />

//             <Route path="/StockAdd" element={<StockAdd />} />
//             <Route path="/SalePage" element={<SalePage />} />
//             <Route path="/InventoryPage" element={<InventoryPage />} />
//             <Route path="/UpdateInventory/:id" element={<UpdateInventory />} />

//             <Route path="/Login" element={<Login />} />
//             <Route path="/Registration" element={<Registration />} />
//             <Route path="/UserTable" element={<UserTable />} />
//             <Route path="/UserUpdate/:id" element={<UserUpdate />} />
//             <Route path="/Profile" element={<Profile />} />
            
//           </Routes>
      
//     </BrowserRouter>
//     </AuthProvider>
//   );
// }

// export default App;


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

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import RoleBasedRoute from './components/RoleBasedRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* Public Routes */}
          <Route path="/" element={<Welcomepage />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Registration" element={<Registration />} />

          {/* User Dashboard */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />

          <Route path="/Userhome" element={
            <ProtectedRoute>
              <Userhome />
            </ProtectedRoute>
          } />

          {/* Appointments (user & doctor access) */}
          <Route path="/Schedule" element={
            <RoleBasedRoute allowedRoles={["doctor", "admin"]}>
              <Schedule />
            </RoleBasedRoute>
          } />
          <Route path="/Slots" element={
            <RoleBasedRoute allowedRoles={["doctor", "admin"]}>
              <Slots />
            </RoleBasedRoute>
          } />
          <Route path="/AppointmentBooking/:id" element={
            <ProtectedRoute>
              <AppointmentBooking />
            </ProtectedRoute>
          } />
          <Route path="/AppointmentsPage" element={
            <RoleBasedRoute allowedRoles={["admin"]}>
              <AppointmentsPage />
            </RoleBasedRoute>
          } />
          <Route path="/UpdateAppointmentPage/:id" element={
            <RoleBasedRoute allowedRoles={["admin"]}>
              <UpdateAppointmentPage />
            </RoleBasedRoute>
          } />
          <Route path="/Available" element={<ProtectedRoute><Available /></ProtectedRoute>} />
          <Route path="/updateslot/:id" element={
            <RoleBasedRoute allowedRoles={["doctor", "admin"]}>
              <UpdateSlot />
            </RoleBasedRoute>
          } />
          <Route path="/UserBookings" element={<ProtectedRoute><UserBookings /></ProtectedRoute>} />
          <Route path="/DoctorBookings" element={
            <RoleBasedRoute allowedRoles={["doctor"]}>
              <DoctorBookings />
            </RoleBasedRoute>
          } />

          {/* FAQs */}
          <Route path="/Reviews" element={<ProtectedRoute><Reviews /></ProtectedRoute>} />
          <Route path="/MyReviews" element={<ProtectedRoute><MyReviews /></ProtectedRoute>} />
          <Route path="/UpdateReview" element={<ProtectedRoute><UpdateReview /></ProtectedRoute>} />
          <Route path="/Ask" element={<ProtectedRoute><Ask /></ProtectedRoute>} />
          <Route path="/FAQs" element={<ProtectedRoute><FAQs /></ProtectedRoute>} />
          <Route path="/UpdateFAQ/:id" element={
            <RoleBasedRoute allowedRoles={["admin"]}>
              <UpdateFAQ />
            </RoleBasedRoute>
          } />

          {/* Admin */}
          <Route path="/Admin" element={
            <RoleBasedRoute allowedRoles={["admin"]}>
              <Admin />
            </RoleBasedRoute>
          } />
          <Route path="/AdminDashboard" element={
            <RoleBasedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </RoleBasedRoute>
          } />

          {/* Payments */}
          <Route path="/Payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
          <Route path="/UpdatePayment/:id" element={
            <RoleBasedRoute allowedRoles={["admin"]}>
              <UpdatePayment />
            </RoleBasedRoute>
          } />
          <Route path="/EditPay/:id" element={<ProtectedRoute><EditPay /></ProtectedRoute>} />
          <Route path="/PayTable" element={
            <RoleBasedRoute allowedRoles={["admin"]}>
              <PayTable />
            </RoleBasedRoute>
          } />
          <Route path="/UserPayments" element={<ProtectedRoute><UserPayments /></ProtectedRoute>} />

          {/* Orders */}
          <Route path="/Order" element={<ProtectedRoute><Order /></ProtectedRoute>} />
          <Route path="/OrderList" element={
            <RoleBasedRoute allowedRoles={["admin"]}>
              <OrderList />
            </RoleBasedRoute>
          } />
          <Route path="/OrderUpdateForm/:id" element={
            <RoleBasedRoute allowedRoles={["admin"]}>
              <OrderUpdateForm />
            </RoleBasedRoute>
          } />
          <Route path="/OrdersTable" element={
            <RoleBasedRoute allowedRoles={["admin"]}>
              <OrdersTable />
            </RoleBasedRoute>
          } />

          {/* Inventory */}
          <Route path="/StockAdd" element={
            <RoleBasedRoute allowedRoles={["admin"]}>
              <StockAdd />
            </RoleBasedRoute>
          } />
          <Route path="/SalePage" element={<ProtectedRoute><SalePage /></ProtectedRoute>} />
          <Route path="/InventoryPage" element={
            <RoleBasedRoute allowedRoles={["admin", "doctor"]}>
              <InventoryPage />
            </RoleBasedRoute>
          } />
          <Route path="/UpdateInventory/:id" element={
            <RoleBasedRoute allowedRoles={["admin"]}>
              <UpdateInventory />
            </RoleBasedRoute>
          } />

          {/* Users */}
          <Route path="/UserTable" element={
            <RoleBasedRoute allowedRoles={["admin"]}>
              <UserTable />
            </RoleBasedRoute>
          } />
          <Route path="/UserUpdate/:id" element={
            <RoleBasedRoute allowedRoles={["admin"]}>
              <UserUpdate />
            </RoleBasedRoute>
          } />
          <Route path="/Profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
