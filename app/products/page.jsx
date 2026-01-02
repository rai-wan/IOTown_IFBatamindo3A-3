"use client";

import Navbar from "../../components/Navbar";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Products() {
  const router = useRouter();

  const products = [
    {
      name: "TrafficLight",
      image: "/lampu.jpg",
      desc: "Arduino adalah papan mikrokontroler yang dapat diprogram untuk membaca sensor dan mengontrol aktuator. Cocok untuk pemula.",
      link: "/TrafficLight8266"
    },
    {
      name: "Motor Servo",
      image: "/motor.jpg",
      desc: "Coding blok untuk motor servo dan memahami konsep dasar tools IOT.",
      link: "/servo"
    },
    {
      name: "NodeMCU ESP8266",
      image: "/ESP.jpg",
      desc: "NodeMCU adalah mikrokontroler ESP8266 dengan WiFi. Bagus untuk proyek IoT yang membutuhkan koneksi internet.",
    },
    {
      name: "PIR",
      image: "/PIR.jpg",
      desc: "Breadboard adalah papan untuk merangkai rangkaian elektronik tanpa solder.",
      link: "/PIR"
    },
    {
      name: "Project jemuran otomatis",
      image: "/OIP.jpg",
      desc: "Menggunakan sensor hujan, jumper, breadboard, dan motor servo. Klik untuk mulai coding blok!",
      link: "/raindrop8266",
    },
        {
      name: "ultrasonik",
      image: "/ultrasonic.jpg",
      desc: "Menggunakan sensor hujan, jumper, breadboard, dan motor servo. Klik untuk mulai coding blok!",
      link: "/parkiran",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 font-sans">

      {/* GLOBAL NAVBAR */}
      <Navbar />

      {/* ================= INTRO SECTION ================= */}
      <section className="text-center py-12 px-6">
        <h1 className="text-4xl font-bold text-blue-900 mb-4">IoTown’s Products</h1>

       

        {/* ================= PRODUCT GRID ================= */}
        <div className="flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl">

            {products.map((product, index) => (
              <div
                key={index}
                onClick={() => product.link && router.push(product.link)}
                className="bg-white rounded-xl shadow-lg p-6 w-full cursor-pointer 
                hover:shadow-xl hover:scale-[1.02] transition-transform duration-300"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-24 h-24 object-contain mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold text-blue-800 mb-2 text-center">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 text-center">
                  {product.desc}
                </p>
              </div>
            ))}

          </div>
        </div>
      </section>

    </main>
  );
}
