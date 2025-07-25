import { Routes, Route } from "react-router-dom";
import "./App.css";

import Navbar from "./LandingPage/components/Navbar";
import Hero from "./LandingPage/components/Hero";
import Fleet from "./LandingPage/components/Fleet";
import HowItWorks from "./LandingPage/components/Howitworks";
import Testimonials from "./LandingPage/components/Testimonials";
import Footer from "./LandingPage/components/Footer";

import Login from "./LandingPage/components/Login";
import Register from "./LandingPage/components/Register";
import Dashboard from "./LandingPage/components/UserDashboard"; // Added Dashboard 
import AdminDashboard from "./LandingPage/components/AdminDashboard"

function LandingPage() {
  return (
    <>
      <Navbar />
      <Hero />
      <Fleet />
      <HowItWorks />
      <Testimonials />
      <Footer />
    </>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} /> {/* Added Dashboard route */}
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="*" element={<div>Page Not Found</div>} />
    </Routes>
  );
}

export default App;