import React from 'react';

const InfoCard = ({ icon, title, description, className = '' }) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm p-6 hover:shadow-lg hover:scale-105 transition-all duration-300 ${className}`}>
      {icon && (
        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4 text-primary-600">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      {description && (
        <p className="text-gray-600 text-sm">{description}</p>
      )}
    </div>
  );
};

export default InfoCard;
