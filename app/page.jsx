"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <main className="min-h-screen bg-gradient-to-b from-cyan-100 via-white to-blue-50 text-gray-800 overflow-hidden relative font-['Baloo_2']">
        {/* Hero Section */}
        <section className="relative text-center pt-24 pb-20 px-6">
          {/* Efek Bubbles animasi */}
          <motion.div
            className="absolute -top-10 left-10 w-24 h-24 bg-cyan-300 rounded-full blur-2xl opacity-40"
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
          />
          <motion.div
            className="absolute top-20 right-20 w-32 h-32 bg-blue-200 rounded-full blur-3xl opacity-40"
            animate={{ y: [20, 0, 20] }}
            transition={{ duration: 5, repeat: Infinity }}
          />

          {/* Logo besar transparan di belakang tulisan */}
          <motion.img
            src="/iotown_logo.png"
            alt="IoTown Background Logo"
            className="absolute left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2 w-[650px] opacity-20 blur-[1px] pointer-events-none select-none"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.2 }}
            transition={{ duration: 2 }}
          />

          {/* Logo utama di atas */}
          <motion.img
            src="/iotown_logo.png"
            alt="IoTown Logo"
            className="mx-auto mb-8 w-52 drop-shadow-2xl relative z-10"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          />

          {/* Gambar Kanan & Kiri */}
          <motion.img
            src="/crayon4.png"
            alt="Crayon Left"
            className="absolute left-[10%] top-[55%] w-28 opacity-60 rotate-6"
            animate={{ y: [0, 15, 0], rotate: [5, 10, 5] }}
            transition={{ duration: 5, repeat: Infinity }}
          />
          <motion.img
            src="/crayon5.png"
            alt="Crayon Right"
            className="absolute right-[10%] top-[55%] w-28 opacity-60 -rotate-6"
            animate={{ y: [10, 0, 10], rotate: [-5, -10, -5] }}
            transition={{ duration: 5.5, repeat: Infinity }}
          />
          <motion.img
            src="/crayon2.png"
            alt="Floating Crayon Small"
            className="absolute left-[25%] top-[65%] w-14 opacity-40 rotate-[20deg]"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.img
            src="/crayon6.png"
            alt="Floating Crayon Small"
            className="absolute right-[25%] top-[68%] w-14 opacity-40 -rotate-[20deg]"
            animate={{ y: [10, 0, 10] }}
            transition={{ duration: 4.5, repeat: Infinity }}
          />

          {/* Tulisan utama */}
          <motion.h1
            className="text-5xl font-bold mb-4 text-cyan-800 relative z-10 drop-shadow-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Selamat Datang di <span className="text-cyan-600">IoTown</span>
          </motion.h1>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8 relative z-10 leading-relaxed">
            Dunia kreatif tempat kamu bisa membangun proyek <b>IoT pintar</b> dengan cara yang menyenangkan.
            <br />
            Drag, drop, dan kembangkan ide jadi nyata!
          </p>

          {/* Tombol CTA */}
          <div className="relative z-10">
            <Button
              className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 text-lg rounded-2xl shadow-lg transition-transform hover:scale-105"
              onClick={() => (window.location.href = "/signin")}
            >
              Login
            </Button>
          </div>
        </section>

        {/* Playground Section */}
        <section className="bg-white py-20 px-8 text-center relative">
          <h2 className="text-3xl font-bold text-cyan-800 mb-12">
            Jelajahi Dunia IoT seperti di Taman Bermain!
          </h2>

          <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
            {[
              {
                title: "🧠 Drag & Drop",
                desc: "Bangun program ESP32 cukup dengan menyusun blok-blok logika sederhana.",
              },
              {
                title: "⚙️ Simulasi Nyata",
                desc: "Uji proyek kamu secara visual sebelum di-upload ke perangkat.",
              },
              {
                title: "💾 Download Kode",
                desc: "Hasilkan file .ino siap pakai untuk Arduino IDE hanya dengan satu klik.",
              },
            ].map((card, index) => (
              <motion.div
                key={index}
                className="bg-cyan-50 rounded-3xl shadow-md p-6 hover:shadow-xl transition-transform hover:-translate-y-2"
                whileHover={{ scale: 1.05 }}
              >
                <h3 className="text-2xl font-semibold mb-3 text-cyan-700">{card.title}</h3>
                <p className="text-gray-600">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-6 text-center mt-10">
          <p>© 2025 <b>IoTown Project</b> | Made with 💡 for Smart DIY IoT</p>
        </footer>
      </main>
    </>
  );
}
