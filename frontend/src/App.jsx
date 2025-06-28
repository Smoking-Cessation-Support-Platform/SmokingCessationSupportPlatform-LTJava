import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./components/home";
import GioiThieu from "./components/gioithieu";
import HuongDanCaiThuoc from "./components/huongdancaithuoc"; 
import Login from "./components/login";
import Register from "./components/register";
import Payment from "./components/payment";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gioithieu" element={<GioiThieu />} />
        <Route path="/huongdancaithuoc" element={<HuongDanCaiThuoc />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/payment" element={<Payment />} />
      </Routes>
    </Router>
  );
}

export default App;
