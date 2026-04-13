import doctors from "../services/doctorData";
import DoctorCard from "../components/DoctorCard";

function Home() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-8 md:p-12 text-white">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Welcome to Our Hospital
        </h1>
        <p className="text-primary-100 text-lg max-w-2xl">
          Book appointments with our experienced doctors and take the first step towards better health.
        </p>
      </div>

      {/* Doctors Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Our Doctors</h2>
        <p className="text-gray-500 mb-6">
          Meet our team of qualified healthcare professionals
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {doctors.map((doc) => (
            <DoctorCard key={doc.id} doctor={doc} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;  