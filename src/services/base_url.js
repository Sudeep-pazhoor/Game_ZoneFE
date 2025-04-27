/* const BASE_URL = 'https://game-zoneserver.onrender.com';
export default BASE_URL; */

const BASE_URL = process.env.NODE_ENV === 'production'
    ? 'https://game-zoneserver.onrender.com/api'
    : 'http://localhost:3000/api';

export default BASE_URL;