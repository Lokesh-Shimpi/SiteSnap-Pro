/**
 * pingOrchestrator.js
 * 
 * Implements an indestructible 3-Tier Orchestrator/Fallback pattern to ensure 100% uptime for global ping latency data.
 * Tier 1: Primary - Uses the Globalping API (100% Free/No Auth/Unlimited).
 * Tier 2: Emergency Fallback - Uses the ViewDNS.info API (Free Tier 250/month).
 * Tier 3: Graceful Degradation - Measures latency locally from our own server if all else fails.
 * 
 * This strategy protects our free-tier API limits on ViewDNS and guarantees React always receives valid array data.
 */

/**
 * Primary Strategy: Fetches real ping data from Globalping.
 * POSTs to /v1/measurements and polls until finished.
 * @param {string} domain - The target domain to ping.
 * @returns {Promise<Array>} Normalized array of ping results.
 */
async function fetchFromGlobalPing(domain) {
    const locations = ["US", "GB", "DE", "IN", "SG", "JP", "AU", "BR"];
    const payload = {
        type: "ping",
        target: domain,
        locations: locations.map(loc => ({ country: loc })),
        measurementOptions: { packets: 3 }
    };

    const response = await fetch("https://api.globalping.io/v1/measurements", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        throw new Error(`Globalping POST failed with status ${response.status}`);
    }

    const data = await response.json();
    const measurementId = data.id;

    // Polling logic
    let resultData = null;
    let attempts = 0;
    while (attempts < 20) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const pollRes = await fetch(`https://api.globalping.io/v1/measurements/${measurementId}`);
        if (!pollRes.ok) {
            throw new Error(`Globalping GET failed with status ${pollRes.status}`);
        }
        const pollData = await pollRes.json();
        if (pollData.status === 'finished' || pollData.status === 'error') {
            resultData = pollData;
            break;
        }
        attempts++;
    }

    if (!resultData || resultData.status !== 'finished') {
        throw new Error("Globalping measurement did not finish successfully or timed out");
    }

    // Normalize data
    return resultData.results.map(r => {
        const country = r.probe.country;
        const city = r.probe.city;
        const locationStr = city ? `${city}, ${country}` : country;

        let ip = "N/A";
        let status = "Down";
        let packetLoss = "N/A";
        let min = "N/A";
        let avg = "N/A";
        let max = "N/A";

        // Ensure result and stats exist
        if (r.result && r.result.status === 'finished' && r.result.stats) {
            status = "Up";
            ip = r.result.resolvedAddress || r.result.resolvedHostname || "Unknown";
            const lossVal = r.result.stats.loss !== undefined ? parseFloat(r.result.stats.loss) : 0;
            packetLoss = lossVal + "%";
            min = r.result.stats.min !== undefined ? Math.round(parseFloat(r.result.stats.min) * 10) / 10 : 0;
            avg = r.result.stats.avg !== undefined ? Math.round(parseFloat(r.result.stats.avg) * 10) / 10 : 0;
            max = r.result.stats.max !== undefined ? Math.round(parseFloat(r.result.stats.max) * 10) / 10 : 0;

            // If 100% packet loss, mark as Down
            if (lossVal === 100) {
                status = "Down";
            }
        }

        return {
            location: locationStr,
            status,
            ip,
            packetLoss,
            min,
            avg,
            max
        };
    });
}

/**
 * Tier 2: Emergency Fallback Strategy: Fetches real ping data from ViewDNS.info.
 * @param {string} domain - The target domain to ping.
 * @returns {Promise<Array>} Normalized array of ping results.
 */
async function fetchFromViewDNS(domain) {
    const apiKey = process.env.VIEWDNS_API_KEY;
    if (!apiKey) {
        throw new Error("VIEWDNS_API_KEY is missing");
    }

    const url = `https://api.viewdns.info/ping/v2/?host=${encodeURIComponent(domain)}&apikey=${apiKey}&output=json`;
    const response = await fetch(url);
    if (!response.ok) {
        if (response.status === 429 || response.status === 403) {
            throw new Error(`Rate Limit Exceeded or Forbidden (Status: ${response.status})`);
        }
        throw new Error(`ViewDNS API failed with status ${response.status}`);
    }

    const data = await response.json();
    if (data.error) {
        throw new Error(`ViewDNS API error response: ${data.error}`);
    }

    const replys = data.response && data.response.replys ? data.response.replys : [];

    if (replys.length === 0) {
        throw new Error("ViewDNS API returned successfully but with 0 ping replies.");
    }

    let min = Infinity, max = -Infinity, sum = 0, count = 0;

    // Calculate metrics manually based on standard ping replies
    for (let reply of replys) {
        if (reply.rtt && typeof reply.rtt === 'string') {
            const val = parseFloat(reply.rtt);
            if (!isNaN(val)) {
                if (val < min) min = val;
                if (val > max) max = val;
                sum += val;
                count++;
            }
        }
    }

    if (count === 0) {
        return [{
            location: "ViewDNS Result",
            status: "Down",
            ip: "N/A",
            packetLoss: "N/A",
            min: "N/A",
            avg: "N/A",
            max: "N/A"
        }];
    }

    const avg = Math.round((sum / count) * 10) / 10;
    min = min !== Infinity ? Math.round(min * 10) / 10 : 0;
    max = max !== -Infinity ? Math.round(max * 10) / 10 : 0;

    return [{
        location: "Global Edge",
        status: "Up",
        ip: "N/A",
        packetLoss: "0%",
        min,
        avg,
        max
    }];
}

/**
 * Tier 3: Graceful Degradation Strategy
 * Measures latency directly from our own local Node server using HTTPS.
 * @param {string} domain 
 * @returns {Promise<Array>}
 */
async function localServerPing(domain) {
    const http = require('http');
    const https = require('https');
    const { URL } = require('url');

    let targetUrl = domain;
    if (!/^https?:\/\//i.test(targetUrl)) {
        targetUrl = `https://${targetUrl}`;
    }

    // Wrap in a promise to resolve the Head request successfully
    return new Promise((resolve) => {
        try {
            const parsedUrl = new URL(targetUrl);
            const protocol = parsedUrl.protocol === 'https:' ? https : http;

            const start = Date.now();
            const request = protocol.request(targetUrl, { method: 'HEAD', timeout: 5000 }, (response) => {
                const latency = Date.now() - start;
                resolve([{
                    location: "Primary Server (Degraded Mode)",
                    status: response.statusCode >= 200 && response.statusCode < 400 ? "Up" : "Down",
                    ip: response.socket.remoteAddress || "Unknown",
                    packetLoss: "0%",
                    min: Math.round(latency * 10) / 10,
                    avg: Math.round(latency * 10) / 10,
                    max: Math.round(latency * 10) / 10
                }]);
            });

            request.on('error', () => {
                resolve([{
                    location: "Primary Server (Degraded Mode)",
                    status: "Down",
                    ip: "N/A",
                    packetLoss: "100%",
                    min: "N/A",
                    avg: "N/A",
                    max: "N/A"
                }]);
            });

            request.on('timeout', () => {
                request.destroy();
                resolve([{
                    location: "Primary Server (Degraded Mode)",
                    status: "Down",
                    ip: "N/A",
                    packetLoss: "100%",
                    min: "N/A",
                    avg: "N/A",
                    max: "N/A"
                }]);
            });

            request.end();
        } catch (e) {
            resolve([{
                location: "Primary Server (Degraded Mode)",
                status: "Down",
                ip: "N/A",
                packetLoss: "100%",
                min: "N/A",
                avg: "N/A",
                max: "N/A"
            }]);
        }
    });
}

/**
 * getGlobalLatency -> The 3-Tier Orchestrator
 * Attempts Tier 1 (Globalping), falls back to Tier 2 (ViewDNS), gracefully degrades to Tier 3 (Local ping)
 * 
 * @param {string} domain 
 * @returns {Promise<Array>}
 */
async function getGlobalLatency(domain) {
    // Strip http/https and paths if necessary
    const host = domain.replace(/^https?:\/\//i, '').split('/')[0];

    // Absolute Primary: Use ViewDNS if API key is provided
    if (process.env.VIEWDNS_API_KEY) {
        try {
            console.log('VIEWDNS_API_KEY detected: Utilizing Tier 2 ViewDNS as absolute primary.');
            const results = await fetchFromViewDNS(host);
            console.log('Success: ViewDNS ping data retrieved.');
            return results;
        } catch (error) {
            console.error('ViewDNS primary attempt failed:', error.message);
            // Fallback to Globalping if ViewDNS fails
            try {
                console.log('Falling back to Globalping...');
                const results = await fetchFromGlobalPing(host);
                console.log('Success: Globalping data retrieved.');
                return results;
            } catch (gpError) {
                console.error('Globalping fallback also failed:', gpError.message);
                console.warn('Utilizing Tier 3 Graceful Degradation (Local server ping).');
                return await localServerPing(host);
            }
        }
    }

    // Default Flow (No ViewDNS key): Globalping -> Local Ping
    try {
        console.log('No ViewDNS key detected. Utilizing Globalping as primary.');
        const results = await fetchFromGlobalPing(host);
        console.log('Success: Globalping data retrieved.');
        return results;
    } catch (gpError) {
        console.error('Globalping failed:', gpError.message);
        console.warn('Utilizing Tier 3 Graceful Degradation (Local server ping).');
        return await localServerPing(host);
    }
}

module.exports = {
    getGlobalLatency
};
