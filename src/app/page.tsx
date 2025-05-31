export default function Home() {
  return (
    <div className="min-h-screen bg-[#f9f9f9] p-6">
      {/* Header */}
      <header className="bg-gradient-to-r from-red-600 to-red-500 text-white py-4 px-6 rounded-lg shadow">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Rokto Lagbe</h1>
          <div className="w-8 h-8 bg-white text-red-500 rounded-full flex items-center justify-center">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5.121 17.804A13.937 13.937 0 0112 15c2.485 0 4.796.755 6.879 2.045M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
        </div>
      </header>

      {/* Grid Section */}
      <section className="grid grid-cols-2 gap-4 mt-6">
        {/* Request Card */}
        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center justify-center text-center hover:shadow-md transition">
          <img
            src="/icons/request.png"
            alt="Request"
            className="w-12 h-12 mb-2"
          />
          <p className="font-medium">Request</p>
        </div>

        {/* MyDonor Card */}
        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center justify-center text-center hover:shadow-md transition">
          <img
            src="/icons/mydonor.png"
            alt="MyDonor"
            className="w-12 h-12 mb-2"
          />
          <p className="font-medium">MyDonor</p>
        </div>
      </section>
    </div>
  );
}
