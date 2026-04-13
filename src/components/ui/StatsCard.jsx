import React from 'react';

const StatsCard = ({
  title,
  value,
  icon = null,
  trend = null,
  color = 'primary',
  className = '',
}) => {
  const colorStyles = {
    primary: {
      bg: 'bg-primary-50',
      text: 'text-primary-600',
      border: 'border-primary-200',
    },
    success: {
      bg: 'bg-success-50',
      text: 'text-success-600',
      border: 'border-success-200',
    },
    warning: {
      bg: 'bg-warning-50',
      text: 'text-warning-600',
      border: 'border-warning-200',
    },
    danger: {
      bg: 'bg-danger-50',
      text: 'text-danger-600',
      border: 'border-danger-200',
    },
    info: {
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      border: 'border-blue-200',
    },
  };

  const styles = colorStyles[color] || colorStyles.primary;

  return (
    <div className={`bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow duration-200 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {trend && (
            <p className={`text-sm mt-2 ${trend.positive ? 'text-success-600' : 'text-danger-600'}`}>
              {trend.positive ? '↑' : '↓'} {trend.value}
            </p>
          )}
        </div>
        {icon && (
          <div className={`${styles.bg} ${styles.text} p-4 rounded-xl`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
