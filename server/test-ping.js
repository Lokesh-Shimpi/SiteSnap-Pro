const https = require('https');

const makeRequest = (url, options, body = null) => {
    return new Promise((resolve, reject) => {
        const req = https.request(url, options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(JSON.parse(data));
                } else {
                    reject(new Error(`API Error: ${res.statusCode} - ${data}`));
                }
            });
        });
        req.on('error', (e) => reject(e));
        if (body) {
            req.write(JSON.stringify(body));
        }
        req.end();
    });
};

const testPing = async () => {
    try {
        const payload = {
            type: "ping",
            target: "google.com",
            locations: [{ country: "IN" }],
            measurementOptions: { packets: 3 }
        };
        const postOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };
        const createRes = await makeRequest('https://api.globalping.io/v1/measurements', postOptions, payload);
        const measurementId = createRes.id;
        console.log("Measurement ID:", measurementId);

        let finished = false;
        let data = null;
        while (!finished) {
            await new Promise(r => setTimeout(r, 1000));
            data = await makeRequest(`https://api.globalping.io/v1/measurements/${measurementId}`, {
                method: 'GET',
                headers: { 'Accept': 'application/json' }
            });
            if (data.status === 'finished') finished = true;
        }
        console.log(JSON.stringify(data.results[0], null, 2));
    } catch (e) {
        console.error(e);
    }
};

testPing();
