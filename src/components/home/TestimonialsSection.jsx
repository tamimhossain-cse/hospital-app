import React from 'react';
import SectionHeader from '../ui/SectionHeader';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
      feedback: 'The care I received at this hospital was exceptional. The doctors were knowledgeable and the staff was incredibly supportive throughout my treatment.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
      feedback: 'From the moment I walked in, I felt cared for. The online booking system made it so easy to schedule my appointment. Highly recommend!',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      avatar: 'https://randomuser.me/api/portraits/women/67.jpg',
      feedback: 'The pediatric care my daughter received was outstanding. Dr. Chen was gentle and thorough, making the entire experience stress-free.',
      rating: 5
    }
  ];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <svg
        key={i}
        className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <section id="testimonials" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader
          title="What Our Patients Say"
          subtitle="Real stories from real patients about their experience with our healthcare services"
        />

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div className="flex gap-1 mb-4">
                {renderStars(testimonial.rating)}
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                "{testimonial.feedback}"
              </p>
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">Verified Patient</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
