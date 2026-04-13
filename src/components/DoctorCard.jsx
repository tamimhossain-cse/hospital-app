import { useNavigate } from "react-router-dom";
import Badge from "./ui/Badge";

function DoctorCard({ doctor }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/doctor/${doctor.id}`)}
      className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer text-center group"
    >
      <div className="relative inline-block mb-4">
        <img
          src={doctor.image}
          alt={doctor.name}
          className="w-28 h-28 mx-auto rounded-full object-cover border-4 border-white shadow-md group-hover:scale-105 transition-transform duration-200"
        />
        <div className="absolute -bottom-1 -right-1 bg-success-500 text-white p-1.5 rounded-full">
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mb-1">{doctor.name}</h3>
      <Badge variant="primary" className="mb-3">{doctor.specialty}</Badge>

      {doctor.experience && (
        <p className="text-sm text-gray-500 mb-1">
          <span className="font-medium">Experience:</span> {doctor.experience}
        </p>
      )}

      {doctor.fee && (
        <p className="text-sm text-gray-500 mb-3">
          <span className="font-medium">Consultation:</span> ${doctor.fee}
        </p>
      )}

      {doctor.bio && (
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {doctor.bio}
        </p>
      )}

      <button className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-lg font-medium transition-colors">
        Book Appointment
      </button>
    </div>
  );
}

export default DoctorCard;