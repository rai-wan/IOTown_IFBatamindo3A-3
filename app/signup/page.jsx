"use client";
import { useState } from "react";

export default function SignUp() {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");

    if (password !== confirmPassword) {
      setMessage("❌ Password tidak cocok");
      return;
    }

    const res = await fetch("http://localhost:3001/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (data.success) {
      setMessage("✅ Register berhasil");
      setPhone(""); setEmail(""); setPassword(""); setConfirmPassword("");
    } else {
      setMessage("❌ " + (data.message || "Register gagal"));
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 flex items-center justify-center font-sans">
      <div className="w-full max-w-4xl flex rounded-xl overflow-hidden shadow-xl">

        {/* LEFT SIDE */}
        <div className="w-1/2 bg-[#2c3e50] text-white flex flex-col justify-center items-center px-8 py-12">

          {/* LOGO IOTOWN */}
          <div className="w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center mb-4 overflow-hidden">
            <img
              src="/iotown_logo.png"
              alt="IoTown Logo"
              className="w-full h-full object-contain"
            />
          </div>

          <h2 className="text-xl font-bold mb-2 text-center">Join IoTown!</h2>
          <p className="text-sm text-center leading-relaxed max-w-xs">
            Daftarkan dirimu dan mulai belajar IoT dengan Blockly & Arduino.
          </p>
          <p className="mt-auto text-xs pt-20">©2025 All rights reserved</p>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-1/2 bg-[#d6eaf8] flex flex-col justify-center items-center px-8 py-12">
          <div className="w-full max-w-sm">
            <h2 className="text-2xl font-bold text-blue-900 mb-4 text-center">Create Account</h2>

            <form className="space-y-4" onSubmit={handleRegister}>
              <input
                type="text"
                placeholder="Phone Number"
                className="w-full px-4 py-2 rounded-lg border border-gray-300"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-2 rounded-lg border border-gray-300"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-2 rounded-lg border border-gray-300"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full px-4 py-2 rounded-lg border border-gray-300"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              <button
                type="submit"
                className="w-full bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 transition"
              >
                Sign Up
              </button>

              {message && (
                <p className="text-sm text-center text-red-600 mt-2">{message}</p>
              )}
            </form>

            <p className="mt-4 text-sm text-center text-gray-700">
              Already have an account?{" "}
              <a href="/signin" className="text-pink-500 underline">Log In</a>
            </p>

            <p className="text-xs text-center text-gray-500 mt-6">
              © 2025 All rights reserved
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
