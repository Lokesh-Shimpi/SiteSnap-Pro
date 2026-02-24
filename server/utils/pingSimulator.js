const dns = require('dns').promises;
const resolveIP = async (url) => {
    try {
        const hostname = new URL(url).hostname;
        const addresses = await dns.resolve4(hostname);
        return addresses[0] || 'Unknown';
    } catch (error) {
        return 'Unresolvable';
    }
};
module.exports = { resolveIP };
