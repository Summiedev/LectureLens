import { BrowserRouter as Router, Route, Routes, Form } from "react-router-dom";
import AttentionTracker from "./pages/StudentCamera";
import Navbar from "./components/navigation/navbar";
import PageForm from "./components/form/form";
import "./App.css";

import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";


function App() {
  


  return (
    <div className="w-screen">
      <PageForm />
    </div>

    
    // <Router>
      
    //   <Routes>
    //     <Route path="/Camera" element={<AttentionTracker />} />
       
  
        
     
    //   </Routes>

    // </Router>
  );
}

export default App;
