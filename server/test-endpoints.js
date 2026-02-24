const http = require('http');
function testPing() {
    console.log('Testing /api/ping...');
    http.get('http://localhost:3000/api/ping?url=google.com', (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
            console.log('Ping Response:', res.statusCode, data);
        });
    }).on('error', (err) => {
        console.error('Ping Error:', err.message);
    });
}
function testScreenshot() {
    console.log('Testing /api/screenshot...');
    http.get('http://localhost:3000/api/screenshot?url=example.com&view=desktop', (res) => {
        console.log('Screenshot Response Status:', res.statusCode);
        console.log('Screenshot Content-Type:', res.headers['content-type']);
        let size = 0;
        res.on('data', (chunk) => size += chunk.length);
        res.on('end', () => {
            console.log('Screenshot Size:', size, 'bytes');
        });
    }).on('error', (err) => {
        console.error('Screenshot Error:', err.message);
    });
}
testPing();
setTimeout(testScreenshot, 2000); 
