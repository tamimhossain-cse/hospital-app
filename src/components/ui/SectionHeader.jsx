import React from 'react';

const SectionHeader = ({ title, subtitle, centered = true }) => {
  return (
    <div className={`${centered ? 'text-center' : ''} mb-12`}>
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;
