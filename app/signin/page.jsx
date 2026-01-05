"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage("✅ Login berhasil");
        router.push("/dashboard");
      } else {
        setMessage("❌ " + (data.message || "Login gagal"));
      }
    } catch (error) {
      setMessage("❌ Gagal terhubung ke server");
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

          <h2 className="text-xl font-bold mb-2 text-center">Hello IoTown-ers!</h2>
          <p className="text-sm text-center leading-relaxed max-w-xs">
            IoTown is an educational web platform that connects a smart city miniature with 
            visual coding and video tutorials, allowing children to learn, experiment, 
            and control IoT technology in an interactive and fun way.
          </p>
          <p className="mt-auto text-xs pt-20">©2025 All rights reserved</p>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-1/2 bg-[#d6eaf8] flex flex-col justify-center items-center px-8 py-12">
          <div className="w-full max-w-sm">
            <h2 className="text-2xl font-bold text-blue-900 mb-4 text-center">Welcome!</h2>

            <form className="space-y-4" onSubmit={handleLogin}>
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

              <button
                type="submit"
                className="w-full bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 transition"
              >
                Sign In
              </button>

              {message && (
                <p className="text-sm text-center text-red-600 mt-2">{message}</p>
              )}
            </form>

            <p className="mt-4 text-sm text-center text-gray-700">
              New to IoTown?{" "}
              <a href="/signup" className="text-pink-500 underline">Sign Up</a>
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
