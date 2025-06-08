import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AttentionTracker from "./pages/StudentCamera";

import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";


function App() {
  


  return (

    
    <Router>
      
      <Routes>
        <Route path="/Camera" element={<AttentionTracker />} />
       
  
        
     
      </Routes>

    </Router>
  );
}

export default App;
