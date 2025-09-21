// import React from 'react';
// // import Header from '../Components/welcomeheader';
// // import Footer from '../Components/footer';
// // import { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import welcomeImage from '../assets/images/welcome.jpg'; 
// import Header from '../pages/Header';

// const Userhome = () => {
// //   const navigate = useNavigate();
// //   useEffect(() => {
// //     const token = localStorage.getItem('token');
// //     if (!token) {
// //         navigate('/login');
// //     }
// //   }, []);

//   return (
//     <div className=" bg-gray-50">
//       <div className="mb-2.5 shadow-md py-2"> 
//         <Header />
//       </div>
      
//       {/* Popular Services Section */}


//         <section
//               className="max-w-[1250px] h-[500px] bg-[#d2d8e4] mx-auto my-[10px] relative overflow-hidden rounded-[10px] p-5 flex justify-center items-center bg-cover bg-center bg-no-repeat"
//               style={{ backgroundImage: `url(${welcomeImage})`, marginTop: '50px' }}
//             ></section>
//       <section className="text-center py-12 px-5 bg-gray-50"> {/* #popular-services */}
//         <div className="mb-5"> {/* service-heading */}
//           <h3 className="text-2xl font-semibold text-blue-600">Select Our Quality Services</h3>
//         </div>

//         <div className="flex justify-center gap-10 flex-wrap"> {/* service-container */}
//           {/* Service Box 1 */}
//           <div className="bg-white p-5 rounded-xl shadow-md text-center w-[300px]"> {/* service-box */}
//             <img alt="Consultation" src="#" className="w-[100px] h-[100px] object-cover mx-auto mb-2.5" />
//             <strong className="block">Consultation</strong>
//             <a href="#" className="block bg-blue-600 text-white py-2.5 px-3 rounded mt-2.5 mb-2.5 hover:bg-blue-700 transition-colors">
//               <i className="fas fa-calendar-check mr-1"></i> Book an Appointment
//             </a>
//             <a className="text-red-500 cursor-pointer">
//               <i className="far fa-heart"></i>
//             </a>
//           </div>

//           {/* Service Box 2 */}
//           <div className="bg-white p-5 rounded-xl shadow-md text-center w-[300px]">
//             <img alt="Specialized Care" src="#" className="w-[100px] h-[100px] object-cover mx-auto mb-2.5" />
//             <strong className="block">Specialized Care</strong>
//             <a href="#" className="block bg-blue-600 text-white py-2.5 px-3 rounded mt-2.5 mb-2.5 hover:bg-blue-700 transition-colors">
//               <i className="fas fa-calendar-check mr-1"></i> Book an Appointment
//             </a>
//             <a className="text-red-500 cursor-pointer">
//               <i className="far fa-heart"></i>
//             </a>
//           </div>

//           {/* Service Box 3 */}
//           <div className="bg-white p-5 rounded-xl shadow-md text-center w-[300px]">
//             <img alt="Emergency Care" src="#" className="w-[100px] h-[100px] object-cover mx-auto mb-2.5" />
//             <strong className="block">Emergency Care</strong>
//             <a href="#" className="block bg-blue-600 text-white py-2.5 px-3 rounded mt-2.5 mb-2.5 hover:bg-blue-700 transition-colors">
//               <i className="fas fa-calendar-check mr-1"></i> Book an Appointment
//             </a>
//             <a className="text-red-500 cursor-pointer">
//               <i className="far fa-heart"></i>
//             </a>
//           </div>
//         </div>
//       </section>



//       {/* Client Feedback Section */}
//       <section className="max-w-[1250px] mx-auto my-12 p-5"> {/* #client-feedback */}
//         <div className="mb-7.5"> {/* feedback-heading */}
//           <h3 className="text-center text-3xl text-gray-800">Patient Ratings About Our Services</h3>
//         </div>

//         <div className="flex justify-between gap-5"> 
         


//           <div className="bg-gray-100 p-5 rounded-xl flex-1 text-center"> {/* feedback-box */}
//             <div className="mb-3.5"> {/* patient-profile */}
//               <div className="profile-text">
//                 <strong className="text-2xl text-blue-600">#</strong>
//                 <span className="block">#</span>
//               </div>
//             </div>
//             <p className="text-lg text-gray-600">Feedback from patient #1</p>
//           </div>



       
//           <div className="bg-gray-100 p-5 rounded-xl flex-1 text-center">
//             <div className="mb-3.5">
//               <div className="profile-text">
//                 <strong className="text-2xl text-blue-600">#</strong>
//                 <span className="block">#</span>
//               </div>
//             </div>
//             <p className="text-lg text-gray-600">Feedback from patient #2</p>
//           </div>

       
//           <div className="bg-gray-100 p-5 rounded-xl flex-1 text-center">
//             <div className="mb-3.5">
//               <div className="profile-text">
//                 <strong className="text-2xl text-blue-600">#</strong>
//                 <span className="block">#</span>
//               </div>
//             </div>
//             <p className="text-lg text-gray-600">Feedback from patient #3</p>
//           </div>


//         </div>
//       </section>


//     </div>
//   );
// }

// export default Userhome;

import React from 'react';
// import Header from '../Components/welcomeheader';
import Footer from '../pages/Footer';
// import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import welcomeImage from '../assets/images/welcome.jpg'; 
import Header from '../pages/Header';
import { FaUserMd, FaCalendarCheck,FaShoppingCart, FaComments,FaChartLine,FaHandshake } from 'react-icons/fa';


const Userhome = () => {
  const navigate = useNavigate();

  const services = [
    {
      id: 1,
      title: "Medical Consultation",
      description: "Schedule appointments with expert doctors",
      icon: <FaUserMd className="text-4xl text-[#007bff]" />,
      link: "/Available"
    },
    {
      id: 2,
      title: "Product Orders",
      description: "Browse and order medical supplies",
      icon: <FaShoppingCart className="text-4xl text-[#007bff]" />,
      link: "/SalePage"
    },
    {
      id: 3,
      title: "Communication",
      description: "Connect with medical professionals",
      icon: <FaComments className="text-4xl text-[#007bff]" />,
      link: "/Ask"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-md">
        <Header />
      </div>
      
      {/* Hero Section */}
      <section
        className="relative h-[400px] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${welcomeImage})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="max-w-2xl text-white">
            <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
              Welcome to MEDICOS
            </h1>
            <p className="text-lg md:text-xl text-gray-200">
              Your trusted platform for medical services and supplies
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Our Services
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Access a wide range of medical services and products to meet your healthcare needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div 
                key={service.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4">
                    {service.icon}
                  </div>
                  <h3 className="text-xl text-black font-semibold mb-2">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <button
                    onClick={() => navigate(service.link)}
                    className="w-full bg-[#007bff] text-white py-2 px-4 rounded-lg hover:bg-[#0056b3] transition-colors duration-300"
                  >
                    Get Started
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


       {/* How It Works Section */}
            <section className="py-16 px-4 bg-white">
              <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
                  How It Works
                </h2>
                <div className="grid grid-cols-1 text-black md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[
                    {
                      step: 1,
                      title: "Create Your Profile",
                      description: "Sign up and complete your profile with relevant information",
                      icon: <FaUserMd />
                    },
                    {
                      step: 2,
                      title: "Connect & Communicate",
                      description: "Find and connect with medical professionals",
                      icon: <FaComments />
                    },
                    {
                      step: 3,
                      title: "Schedule Meetings",
                      description: "Book appointments at convenient times",
                      icon: <FaCalendarCheck />
                    },
                    {
                      step: 4,
                      title: "Place Orders",
                      description: "Order medical supplies and products",
                      icon: <FaShoppingCart />
                    },
                    {
                      step: 5,
                      title: "Track Progress",
                      description: "Monitor your orders and appointments",
                      icon: <FaChartLine />
                    },
                    {
                      step: 6,
                      title: "Build Relationships",
                      description: "Develop long-term professional connections",
                      icon: <FaHandshake />
                    }
                  ].map((item) => (
                    <div key={item.step} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="text-[#007bff] text-2xl">
                          {item.icon}
                        </div>
                        <div className="text-[#007bff] text-xl font-bold">Step {item.step}</div>
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
            <Footer/>
    </div>
  );
}

export default Userhome;