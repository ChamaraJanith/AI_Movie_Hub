try {
    const axios = require('axios');
    console.log('Axios is installed version:', axios.version || 'unknown');
} catch (e) {
    console.log('Axios NOT found');
}
