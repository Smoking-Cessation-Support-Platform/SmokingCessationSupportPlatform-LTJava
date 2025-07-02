import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./components/home";
import GioiThieu from "./components/gioithieu";
import HuongDanCaiThuoc from "./components/huongdancaithuoc"; 
import Login from "./components/login";
import Register from "./components/register";
import Payment from "./components/payment";
import TuVan from "./components/tuvan";
import CauChuyenThanhCong from "./components/blog";
import LienHe from "./components/lienhe";
import DuocPham from "./components/duocpham";
import Member from "./components/member";

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
        <Route path="/tuvan" element={<TuVan />} />
        <Route path="/blog" element={<CauChuyenThanhCong />} />
        <Route path="/lienhe" element={<LienHe />} />
        <Route path="/duocpham" element={<DuocPham />} />
        <Route path="/member" element={<Member />} />
      </Routes>
    </Router>
  );
}

export default App;
