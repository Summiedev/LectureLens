import { BrowserRouter as Router, Route, Routes, Form } from "react-router-dom";
import AttentionTracker from "./pages/StudentCamera";
import Navbar from "./components/navigation/navbar";
import PageForm from "./components/form/form";
import "./App.css";

import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import ViewPage from "./pages/StudentView";
import TeacherViewSession from "./pages/TeacherView";
import Dashboard from "./pages/TeacherDashboard";


function App() {
  


  return (
    <div className="w-screen">
      <PageForm />
    </div>

    
    // <Router>
      
    //   <Routes>
    //     <Route path="/Camera" element={<AttentionTracker />} />
       
   <Route path="/Student" element={<ViewPage />} />
         <Route path="/Teacher-view" element={<TeacherViewSession />} />
          <Route path="/Teacher-dashboard" element={<Dashboard />} />
     
    //   </Routes>

    // </Router>
  );
}

export default App;
