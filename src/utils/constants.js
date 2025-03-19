// src/utils/constants.js
export const MAP_DEFAULTS = {
  center: [-74.5, 40],
  zoom: 9,
};

export const ANALYTICS_TIMEFRAMES = {
  DAY: '24h',
  WEEK: '7d',
  MONTH: '30d',
  YEAR: '1y',
};

export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest',
};

export const WEBSOCKET_EVENTS = {
  LOCATION_UPDATE: 'locationUpdate',
  USER_UPDATE: 'userUpdate',
  ANALYTICS_UPDATE: 'analyticsUpdate',
};