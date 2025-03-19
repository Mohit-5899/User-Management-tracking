// src/utils/helpers.js
export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
};

export const calculateEngagementScore = (interactions) => {
  const weights = {
    profileView: 1,
    messagesSent: 2,
    timespent: 0.5,
  };

  return Object.entries(interactions).reduce((score, [key, value]) => {
    return score + (value * (weights[key] || 1));
  }, 0);
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};