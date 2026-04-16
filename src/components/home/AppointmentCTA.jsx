import React from 'react';
import { Link } from 'react-router-dom';

const AppointmentCTA = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-primary-600 to-indigo-700">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-white space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Make an Appointment Today
            </h2>
            <p className="text-primary-100 text-lg">
              Don't wait for your health concerns to worsen. Book an appointment with our expert doctors and take the first step towards a healthier you.
            </p>
            <Link
              to="/#doctors"
              className="inline-flex items-center gap-2 bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-primary-50 hover:scale-105 transition-all duration-200 shadow-lg"
            >
              Book Appointment Now
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {/* Illustration */}
          <div className="hidden md:flex justify-center">
            <svg
              className="w-80 h-80 text-white opacity-20"
              viewBox="0 0 400 400"
              fill="currentColor"
            >
              <circle cx="200" cy="200" r="150" />
              <circle cx="200" cy="200" r="100" className="opacity-50" />
              <circle cx="200" cy="200" r="50" className="opacity-75" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppointmentCTA;
