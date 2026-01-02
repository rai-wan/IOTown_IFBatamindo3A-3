"use client";

import Navbar from "../../components/Navbar";

export default function TeamPage() {
  const team = [
    {
      name: "Agnes Gultom",
      role: "Frontend Developer",
      desc: "Mengerjakan laporan dan dokuemn pendukung project.",
      campus: "POLITEKNIK BATAM",
      class: "INFORMATIKA BATAMINDO",
      nim: "3312411107",
      image: "/agnes.jpg",   // ⬅ REVISI DI SINI
    },
    {
      name: "Raihan Ikhwan Madani",
      role: "Backend Developer",
      desc: "Membangun API, database, serta autentikasi sistem.",
      campus: "POLITEKNIK BATAM",
      class: "INFORMATIKA BATAMINDO",
      nim: "3312411107",
      image: "/raihan.jpg",   // ⬅ REVISI DI SINI
    },
    {
      name: "Manpro",
      role: "Manager Project",
      desc: "Mengatur timeline, dokumentasi, dan alur kerja tim.",
      campus: "POLITEKNIK NEGRI BATAM",
      class: "-",
      nim: "A13.2022.54321",
      image: "/kevin.png", // ⬅ REVISI DI SINI
    },
    {
      name: "Dita Aflaha",
      role: "Design Develoer",
      desc: "Mengerjakan desain UI/UX dan implementasi tampilan website.",
      campus: "POLITEKNIK BATAM",
      class: "INFORMATIKA BATAMINDO",
      nim: "3312411107",
      image: "/dita.jpg",  // ⬅ REVISI DI SINI
    },
     {
      name: "Omega calriza",
      role: "design develover",
      desc: "Mengerjakan desain UI/UX dan implementasi tampilan website.",
      campus: "POLITEKNIK BATAM",
      class: "INFORMATIKA BATAMINDO",
      nim: "3312411109",
      image: "/mega.jpg",  // ⬅ REVISI DI SINI
    },
  ];

  return (
    <main className="min-h-screen bg-[#3E5C76] text-white font-sans">

      {/* ================= NAVBAR ================= */}
      <Navbar />

      {/* ================= HEADER BANNER ================= */}
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
              d="M0,64L60,85.3C120,107,240,149,360,165.3C480,181,600,171,720,165.3C840,160,960,160,1080,176C1200,192,1320,224,1380,240L1440,256L1440,0L0,0Z"
            ></path>
          </svg>
        </div>

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                        bg-white/20 backdrop-blur-md border border-white/30
                        px-10 py-6 rounded-3xl shadow-xl text-center">
          <h1 className="text-4xl font-extrabold text-white drop-shadow-lg">
            Meet the IoTown Team
          </h1>
          <p className="text-white/80 mt-2 text-lg">
            Kreator, Developer, dan Content Specialist IoT
          </p>
        </div>
      </section>

      {/* ================= TEAM SECTION ================= */}
      <section className="px-10 py-14">
        <h2 className="text-4xl font-extrabold mb-10">Meet the IoTown Team</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {team.map((person, i) => (
            <div
              key={i}
              className="bg-purple-300 text-blue-900 p-6 rounded-2xl shadow-lg
                         hover:scale-[1.03] hover:shadow-2xl transition-all"
            >
              {/* ========== REVISI BAGIAN FOTO ========== */}
              <div className="w-full h-40 rounded-xl overflow-hidden shadow-lg mb-4">
                <img
                  src={person.image}
                  alt={person.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* ========== END REVISI FOTO ========== */}

              <h3 className="text-xl font-bold text-center">{person.name}</h3>
              <p className="text-md text-center font-semibold text-blue-700">{person.role}</p>

              <div className="mt-4 text-sm text-blue-800">
                <p><strong>NIM:</strong> {person.nim}</p>
                <p><strong>Kelas:</strong> {person.class}</p>
                <p><strong>Kampus:</strong> {person.campus}</p>
                <p className="mt-2 text-blue-900">{person.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
