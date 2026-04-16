import React from 'react';
import SectionHeader from '../ui/SectionHeader';
import { Link } from 'react-router-dom';

const AboutSection = () => {
  const stats = [
    { number: '15+', label: 'Years Experience' },
    { number: '50+', label: 'Expert Doctors' },
    { number: '10K+', label: 'Happy Patients' },
    { number: '24/7', label: 'Support Available' }
  ];

  return (
    <section id="about" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&h=500&fit=crop"
              alt="About Our Hospital"
              className="rounded-2xl shadow-xl w-full"
            />
            <div className="absolute -bottom-6 -right-6 bg-primary-600 text-white p-6 rounded-xl shadow-lg hidden md:block">
              <p className="text-3xl font-bold">15+</p>
              <p className="text-sm">Years of Excellence</p>
            </div>
          </div>

          {/* Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              About Our Hospital
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              We are committed to providing exceptional healthcare services with compassion and expertise. Our state-of-the-art facility is equipped with the latest medical technology, and our team of experienced professionals ensures that every patient receives personalized care.
            </p>
            <p className="text-gray-600 mb-8 leading-relaxed">
              From routine check-ups to complex procedures, we offer comprehensive medical services to address all your health concerns. Your well-being is our top priority.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-2xl font-bold text-primary-600">{stat.number}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              ))}
            </div>

            <Link
              to="/about"
              className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Learn More
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
