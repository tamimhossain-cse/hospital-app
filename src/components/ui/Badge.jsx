import React from 'react';

const Badge = ({ children, variant = 'default', size = 'md', className = '' }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    primary: 'bg-primary-100 text-primary-700',
    success: 'bg-success-100 text-success-700',
    warning: 'bg-warning-100 text-warning-700',
    danger: 'bg-danger-100 text-danger-700',
    info: 'bg-blue-100 text-blue-700',
    pending: 'bg-warning-100 text-warning-700',
    confirmed: 'bg-success-100 text-success-700',
    completed: 'bg-primary-100 text-primary-700',
    cancelled: 'bg-danger-100 text-danger-700',
    approved: 'bg-success-100 text-success-700',
    rejected: 'bg-danger-100 text-danger-700',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  const classes = `${variants[variant]} ${sizes[size]} inline-flex items-center font-medium rounded-full ${className}`.trim();

  return (
    <span className={classes}>
      {children}
    </span>
  );
};

export default Badge;
