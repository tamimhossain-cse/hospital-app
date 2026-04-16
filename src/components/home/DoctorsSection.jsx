import React, { useState } from 'react';
import DoctorCard from '../DoctorCard';
import doctors from '../../services/doctorData';

const DoctorsSection = () => {
  const specialties = ['All', 'Cardiologist', 'Dermatologist', 'Neurologist', 'Pediatrician', 'Orthopedic Surgeon', 'Gynecologist', 'Ophthalmologist', 'Psychiatrist', 'Gastroenterologist', 'Endocrinologist', 'Urologist', 'Oncologist', 'Pulmonologist', 'Rheumatologist'];
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');

  const filteredDoctors = selectedSpecialty === 'All'
    ? doctors
    : doctors.filter(doc => doc.specialty === selectedSpecialty);

  return (
    <section id="doctors" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Our Expert Doctors
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-2">
            Meet our team of highly qualified healthcare professionals dedicated to your well-being
          </p>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {specialties.map((specialty) => (
            <button
              key={specialty}
              onClick={() => setSelectedSpecialty(specialty)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedSpecialty === specialty
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {specialty}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <p className="text-center text-gray-500 mb-6">
          Showing <span className="font-semibold text-primary-600">{filteredDoctors.length}</span> doctor{filteredDoctors.length !== 1 ? 's' : ''}
        </p>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDoctors.map((doc) => (
            <DoctorCard key={doc.id} doctor={doc} />
          ))}
        </div>

        {/* View All Link - only show when filtered */}
        {selectedSpecialty !== 'All' && (
          <div className="text-center mt-10">
            <button
              onClick={() => setSelectedSpecialty('All')}
              className="text-primary-600 font-medium hover:text-primary-700 inline-flex items-center gap-2"
            >
              View All Doctors
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default DoctorsSection;
