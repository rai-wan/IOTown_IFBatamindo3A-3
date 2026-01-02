"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const menu = [
    { name: "Home", link: "/dashboard" },
    { name: "Products", link: "/products" },
    { name: "Videos", link: "/video" },
    { name: "Team", link: "/team" },
    { name: "About", link: "/about" },
  ];

  const handleLogout = () => {
    localStorage.clear();
    router.push("/");
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/70 backdrop-blur-md shadow-md z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

        {/* LOGO KIRI (TIDAK DIUBAH) */}
        <Link href="/dashboard" className="flex items-center gap-3">
          <img src="/iotown_logo.png" className="w-14 h-14 rounded-2xl shadow-md" />
          <span className="text-2xl font-extrabold text-blue-700">IoTown</span>
        </Link>

        {/* MENU */}
        <div className="hidden md:flex gap-10 text-lg font-semibold text-gray-700">
          {menu.map((item) => (
            <Link key={item.name} href={item.link} className="hover:text-blue-600 transition">
              {item.name}
            </Link>
          ))}
        </div>

        {/* PROFIL */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow hover:bg-blue-50 transition"
          >
            {/* AVATAR BARU (TAILWIND TEMPLATE) */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-inner">
              U
            </div>
            <span className="font-semibold text-gray-700">Profil</span>
          </button>

          {open && (
            <div className="absolute right-0 mt-3 w-44 bg-white rounded-xl shadow-lg overflow-hidden">
              <Link
                href="/profile"
                className="block px-4 py-3 hover:bg-blue-100"
                onClick={() => setOpen(false)}
              >
                👤 Profil Saya
              </Link>

              <button
                onClick={handleLogout}
                className="w-full text-left block px-4 py-3 text-red-600 hover:bg-red-100"
              >
                🚪 Keluar
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
