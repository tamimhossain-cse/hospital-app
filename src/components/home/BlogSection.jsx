import React from 'react';
import SectionHeader from '../ui/SectionHeader';
import { Link } from 'react-router-dom';

const BlogSection = () => {
  const blogPosts = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=400&h=250&fit=crop',
      title: '10 Tips for Maintaining a Healthy Heart',
      excerpt: 'Learn about the best practices for keeping your heart healthy and preventing cardiovascular diseases.',
      date: 'March 15, 2024'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop',
      title: 'The Importance of Regular Health Checkups',
      excerpt: 'Discover why regular health screenings are crucial for early detection and prevention of diseases.',
      date: 'March 10, 2024'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=250&fit=crop',
      title: 'Understanding Mental Health: A Complete Guide',
      excerpt: 'A comprehensive guide to understanding and managing your mental health for overall well-being.',
      date: 'March 5, 2024'
    }
  ];

  return (
    <section id="blog" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader
          title="Latest Health Tips"
          subtitle="Stay informed with the latest health news, tips, and insights from our medical experts"
        />

        <div className="grid md:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 group"
            >
              <div className="overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <p className="text-sm text-primary-600 mb-2">{post.date}</p>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {post.excerpt}
                </p>
                <Link
                  to={`/blog/${post.id}`}
                  className="inline-flex items-center gap-1 text-primary-600 font-medium hover:gap-2 transition-all"
                >
                  Read More
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
