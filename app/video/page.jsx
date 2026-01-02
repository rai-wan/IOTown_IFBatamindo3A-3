"use client";

import Navbar from "../../components/Navbar";

export default function VideosPage() {
  const videos = [
    {
      title: "Smart Traffic Light",
      desc: "Demonstrates how LED traffic lights switch automatically using timers and sensors to control car movement.",
      thumbnail: "/thumb1.png",
    },
    {
      title: "Smart Car",
      desc: "A mini IoT car that detects red lights and stops automatically, then moves when the light turns green.",
      thumbnail: "/thumb2.png",
    },
    {
      title: "Smart Alarm System",
      desc: "A sound module that gives voice alerts depending on the traffic condition — 'Stop, it's red!' or 'Go, it's green!'",
      thumbnail: "/thumb3.png",
    },
    {
      title: "Smart Rain Sensor",
      desc: "Detects rain and triggers automatic actions, such as stopping the car or activating the smart drying system.",
      thumbnail: "/thumb4.png",
    },
  ];

  return (
    <main className="min-h-screen bg-[#3E5C76] font-sans">

      {/* NAVBAR */}
      <Navbar />

      {/* ================= HEADER BANNER (REVISI) ================= */}
      <section className="relative w-full h-[260px] bg-gradient-to-r from-[#A78BFA] via-[#7DD3FC] to-[#A5B4FC] overflow-hidden">

        {/* Wave Background */}
        <div className="absolute inset-0 opacity-40">
          <svg
            viewBox="0 0 1440 320"
            className="w-full h-full"
            preserveAspectRatio="none"
          >
            <path
              fill="#ffffff"
              fillOpacity="0.4"
              d="M0,64L60,85.3C120,107,240,149,360,165.3C480,181,600,171,720,165.3C840,160,960,160,1080,176C1200,192,1320,224,1380,240L1440,256L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
            ></path>
          </svg>
        </div>

        {/* Glass Header Text */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                        bg-white/20 backdrop-blur-md border border-white/30
                        px-10 py-6 rounded-3xl shadow-xl text-center">
          <h1 className="text-4xl font-extrabold text-white drop-shadow-lg">
            IoTown Learning Videos
          </h1>
          <p className="text-white/80 mt-2 text-lg">
            Pelajari teknologi IoT dengan visual yang menarik!
          </p>
        </div>
      </section>

      {/* ================= VIDEO SECTION ================= */}
      <section className="px-10 py-12 text-white">
        <h2 className="text-3xl font-extrabold mb-8">Learning Videos</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {videos.map((video, idx) => (
            <div
              key={idx}
              className="bg-purple-300 p-6 rounded-2xl cursor-pointer shadow-lg 
                         hover:scale-[1.03] hover:shadow-2xl transition-all"
            >
              {/* Thumbnail Placeholder */}
              <div className="w-full h-40 bg-purple-200 rounded-xl flex items-center justify-center mb-4">
                <div className="w-16 h-16 border-4 border-white rounded-full flex items-center justify-center">
                  <div className="w-0 h-0 border-l-[20px] border-l-white border-y-[12px] border-y-transparent ml-1"></div>
                </div>
              </div>

              <h3 className="text-lg font-bold">{video.title}</h3>
              <p className="text-sm text-purple-100 mt-2">{video.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
