/**
 * Service to interact with the Globalping API for real-time global latency measurements.
 */

/**
 * Initiates a global ping measurement and polls until completion.
 * 
 * @param {string} targetUrl - The domain or IP to ping.
 * @returns {Promise<Array>} - Array of ping results per location.
 */
const getRealGlobalLatency = async (targetUrl) => {
    try {
        let hostname = targetUrl;
        try {
            hostname = new URL(targetUrl.startsWith('http') ? targetUrl : `https://${targetUrl}`).hostname;
        } catch (e) {
            // fallback to using targetUrl as hostname directly if parsing fails
        }

        const locations = [
            { country: "US" },
            { country: "GB" },
            { country: "DE" },
            { country: "IN" },
            { country: "SG" },
            { country: "JP" },
            { country: "AU" },
            { country: "BR" }
        ];

        // Step 1: Create Measurement
        const payload = {
            type: "ping",
            target: hostname,
            locations: locations,
            measurementOptions: { packets: 3 }
        };

        const createRes = await fetch('https://api.globalping.io/v1/measurements', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!createRes.ok) {
            throw new Error(`Failed to create measurement: ${createRes.status}`);
        }

        const createData = await createRes.json();
        const measurementId = createData.id;

        if (!measurementId) {
            throw new Error("Failed to receive Measurement ID");
        }

        // Step 2: Poll Measurement
        let finished = false;
        let pollCount = 0;
        const MAX_POLLS = 10;
        let measurementData = null;

        /**
         * Polling mechanism: We wait 1000ms before each check.
         * The loop breaks when the status is 'finished' or we hit the 10s timeout (MAX_POLLS).
         */
        while (!finished && pollCount < MAX_POLLS) {
            await new Promise(r => setTimeout(r, 1000));

            const pollRes = await fetch(`https://api.globalping.io/v1/measurements/${measurementId}`, {
                method: 'GET',
                headers: { 'Accept': 'application/json' }
            });

            if (!pollRes.ok) {
                pollCount++;
                continue;
            }

            measurementData = await pollRes.json();

            if (measurementData.status === 'finished') {
                finished = true;
            } else {
                pollCount++;
            }
        }

        // Step 3: Data Mapper
        const results = measurementData?.results || [];

        const mappedData = results.map(res => {
            const probe = res.probe || {};
            const resultInfo = res.result || {};

            let status = 'Down';
            let min = 'N/A';
            let avg = 'N/A';
            let max = 'N/A';
            let packetLoss = '100%';
            let ip = 'Unknown';

            // Extract IP from rawOutput (e.g., "PING target.com (1.2.3.4)")
            if (resultInfo.rawOutput) {
                const ipMatch = resultInfo.rawOutput.match(/\((.*?)\)/);
                if (ipMatch && ipMatch[1]) {
                    ip = ipMatch[1];
                }
            }

            // Handle edge cases where a particular probe might have failed or timed out
            if (resultInfo.status === 'finished' && resultInfo.stats) {
                const stats = resultInfo.stats;

                if (stats.rcv > 0) {
                    status = 'Up';
                }

                packetLoss = stats.loss !== undefined ? `${stats.loss}%` : '0%';

                min = stats.min !== undefined ? Math.round(stats.min) : 'N/A';
                avg = stats.avg !== undefined ? Math.round(stats.avg) : 'N/A';
                max = stats.max !== undefined ? Math.round(stats.max) : 'N/A';
            } else {
                status = 'Down';
                packetLoss = '100%';
            }

            return {
                location: `${probe.city || 'Unknown'}, ${probe.country || ''}`,
                countryCode: probe.country || 'un',
                status: status,
                ip: ip,
                packetLoss: packetLoss,
                min: min,
                avg: avg,
                max: max
            };
        });

        return mappedData;
    } catch (error) {
        console.error("GlobalPing API Error:", error.message);
        throw error;
    }
};

module.exports = { getRealGlobalLatency };
