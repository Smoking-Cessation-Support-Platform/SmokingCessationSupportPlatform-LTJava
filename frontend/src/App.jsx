import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

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
import CaNhan from "./components/canhan";
import BaiLam from "./components/bailam";
import CamKet from "./components/camket";
import KeHoach from "./components/kehoach";
import CoachHome from "./components/huanluyenvien_home";
import LoginCoach from "./components/login-coach";
import RegisterCoach from "./components/register-coach";
import PaymentCoach from "./components/payment-coach";
import CauHoiDaDat from "./components/cauhoi_dadat";
import CauHoiDaXuLy from "./components/cauhoi_daxuly";
import ThongKeHuanLuyenVien from "./components/thongke_huanluyenvien";
import LoginAdmin from "./components/login-admin";
import AdminPage from "./components/admin";
import DanhSachNguoiDung from "./components/danhsachnguoidung";
import AdminStatistics from "./components/thongke1";
import DanhSachHuanLuyenVien from "./components/danhsachhuanluyenvien";
import CoachStatistics from './components/thongke2';


function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* Public Routes */}
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
          
          {/* Protected Member Routes */}
          <Route path="/member" element={<Member />} />
          <Route path="/canhan" element={<CaNhan />} />
          <Route path="/bailam" element={<BaiLam />} />
          <Route path="/camket" element={<CamKet />} />
          <Route path="/kehoach" element={<KeHoach />} />
          
          {/* Coach Routes */}
          <Route path="/huanluyenvien_home" element={<CoachHome />} />
          <Route path="/login-coach" element={<LoginCoach />} />
          <Route path="/register-coach" element={<RegisterCoach />} />
          <Route path="/payment-coach" element={<PaymentCoach />} />
          <Route path="/cauhoi_dadat" element={<CauHoiDaDat />} />
          <Route path="/cauhoi_daxuly" element={<CauHoiDaXuLy />} />
          <Route path="/thongke_huanluyenvien" element={<ThongKeHuanLuyenVien />} />
          
          {/* Admin Routes */}
          <Route path="/login-admin" element={<LoginAdmin />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/danhsachnguoidung" element={<DanhSachNguoiDung />} />
          <Route path="/danhsachhuanluyenvien" element={<DanhSachHuanLuyenVien />} />
          <Route path="/thongke1" element={<AdminStatistics />} />
          <Route path="/thongke2" element={<CoachStatistics />} />
          
          {/* 404 Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
