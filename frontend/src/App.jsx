import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignIn from "./pages/SignIn";
import Home from "./pages/Home";
import UnauthorizeUserLogin from "./pages/UnauthorizeUserLogin";

import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/home" element={<Home />} />
        <Route path="/unauthorize" element={<UnauthorizeUserLogin />} />
      </Routes>
    </BrowserRouter>
  );
}
