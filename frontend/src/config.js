const isDevelopment = process.env.NODE_ENV === 'development';

export const API_URL = isDevelopment 
  ? 'http://localhost:8000'
  : 'https://blackroseb.deepaksilaych.me';

export const WS_URL = isDevelopment
  ? 'ws://localhost:8000'
  : 'wss://blackroseb.deepaksilaych.me';

export default {
  API_URL,
  WS_URL
};
