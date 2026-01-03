"use client";

import Navbar from "../../components/Navbar";

export default function VideosPage() {

  const videos = [
    {
      title: "Smart Traffic Light",
      desc: "Demontrasi tutoraol perakitan project trafig light, pengenalan dan pembelajaran mengenai dunia IOT.",
      file: "/video_agnes.mp4",
    },
    {
      title: "Ultrasonic alaram parkir",
      desc: "Pekrakitan peralatan project SENSOR ultarasonic, buzzer dan LED.",
      file: "/video_raihan.mp4",
    },
    {
      title: "Motor sevo",
      desc: "pengenalan tool IOT motor servo G90 perakitan dan pengodingan sederhana unutk mengerakkan motor servo '",
      file: "/video_agnes.mp4",
    },
    {
      title: "Smart Rain Sensor",
      desc: "Detects rain and triggers automatic actions, such as stopping the car or activating the smart drying system.",
      file: "/video_raihan.mp4",
    },
    {
      title: "PIR Sensor",
      desc: "pembelajaran dan pengenalan tool IOT PIR sensor cara kerja dan fungsi sebagai input pada pejct IOT.",
      file: "/video_raihan.mp4",
    },
  ];

  return (
    <main className="min-h-screen bg-[#3E5C76] text-white">

      <Navbar />

      {/* HEADER */}
      <section className="relative h-[230px] bg-gradient-to-r from-indigo-500 via-sky-400 to-indigo-400 flex items-center justify-center">
        <div className="bg-white/20 backdrop-blur-lg px-10 py-6 rounded-3xl text-center">
          <h1 className="text-4xl font-extrabold">IoTown Learning Videos</h1>
          <p className="text-white/80 mt-1">Pelajari teknologi IoT dengan visual menarik</p>
        </div>
      </section>

      {/* VIDEO GRID */}
      <section className="px-10 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {videos.map((v, i) => (
            <div key={i} className="bg-purple-400 rounded-2xl p-4 shadow-xl hover:scale-[1.03] transition">

              {/* VIDEO REAL */}
              <video
                src={v.file}
                controls
                className="w-full h-40 object-cover rounded-xl mb-3 bg-black"
              />

              <h3 className="font-bold text-lg">{v.title}</h3>
              <p className="text-sm text-purple-100 mt-1">{v.desc}</p>
            </div>
          ))}

        </div>
      </section>
    </main>
  );
}
