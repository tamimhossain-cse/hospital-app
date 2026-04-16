import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section id="home" className="bg-gradient-to-r from-primary-600 to-indigo-700 text-white">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 lg:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Your Health,<br />Our Priority
            </h1>
            <p className="text-xl text-primary-100 max-w-xl">
              Experience world-class healthcare with our team of expert doctors. Book appointments online and take the first step towards a healthier life.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/#doctors"
                className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 hover:scale-105 transition-all duration-200 inline-block"
              >
                Get Appointment
              </Link>
              <Link
                to="/#about"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-all duration-200 inline-block"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Image/Illustration */}
          <div className="hidden md:block">
            <img
              src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=600&h=500&fit=crop"
              alt="Healthcare"
              className="rounded-2xl shadow-2xl w-full max-w-md mx-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
