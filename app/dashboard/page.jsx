"use client";

import Navbar from "../../components/Navbar";

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#A8D8FF] to-[#FFE6F7] font-sans overflow-x-hidden">

      {/* GLOBAL NAVBAR */}
      <Navbar />

      {/* ================= HERO SECTION ================= */}
      <section className="relative flex flex-col items-center justify-center py-24 px-6 text-center">

        <h1 className="text-5xl font-extrabold text-blue-800 mb-4 drop-shadow-sm">
          Selamat Datang di <span className="text-pink-600">IoTown!</span>
        </h1>

        <p className="text-lg text-gray-700 max-w-2xl mb-12">
          Tempat belajar IoT dengan cara yang super seru!
          Ayo buat lampu pintar, robot, sensor hujan, dan banyak lagi hanya dengan drag-and-drop!
        </p>

        {/* ================= VIDEO + DECORATIONS ================= */}
        <div className="relative flex items-center justify-center w-full max-w-5xl px-10">

          {/* --- FLOATING DECORATIONS (BEHIND VIDEO) --- */}
          <img src="/crayon2.png" className="hidden md:block absolute -left-40 top-10 w-32 opacity-20 animate-floating-slow z-0" />
          <img src="/crayon3.png" className="hidden md:block absolute -left-24 bottom-20 w-28 opacity-20 animate-floating-medium z-0" />
          <img src="/crayon4.png" className="hidden md:block absolute left-1/2 -translate-x-[350px] -top-20 w-24 opacity-15 animate-floating-fast z-0" />
          <img src="/crayon5.png" className="hidden md:block absolute right-1/2 translate-x-[340px] bottom-10 w-24 opacity-15 animate-floating-medium z-0" />
          <img src="/crayon6.png" className="hidden md:block absolute right-20 top-16 w-32 opacity-20 animate-floating-slow z-0" />
          <img src="/crayon7.png" className="hidden md:block absolute right-40 bottom-0 w-28 opacity-20 animate-floating-medium z-0" />

          {/* --- VIDEO (FOREGROUND) --- */}
          <div className="w-full max-w-3xl aspect-video rounded-2xl overflow-hidden shadow-[0_10px_25px_rgba(0,0,0,0.2)] border-4 border-white z-10">
            <iframe
              className="w-full h-full"
              src="/video_home.mp4"
              title="Video Perkenalan IoTown"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>

      </section>

      {/* ================= FLOAT ANIMATION CSS ================= */}
      <style>{`
        @keyframes floatingSlow {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        @keyframes floatingMedium {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
        @keyframes floatingFast {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(3deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }

        .animate-floating-slow { animation: floatingSlow 4s ease-in-out infinite; }
        .animate-floating-medium { animation: floatingMedium 3s ease-in-out infinite; }
        .animate-floating-fast { animation: floatingFast 3s ease-in-out infinite; }
      `}</style>

    </main>
  );
}
