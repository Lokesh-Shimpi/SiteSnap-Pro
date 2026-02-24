const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
async function aiDiagnostics(url, httpStatus, visualDiffPercentage) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
        const prompt = `
      Act as a DevOps Engineer. A website check for ${url} failed with status ${httpStatus}. 
      The visual difference was ${visualDiffPercentage.toFixed(2)}%. 
      Provide a concise, 3-step root cause analysis and action plan.
      Return ONLY a raw JSON object (no markdown formatting) with the following structure:
      {
        "diagnosis": "Brief explanation of the likely issue.",
        "actionSteps": ["Step 1...", "Step 2...", "Step 3..."]
      }
    `;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        let cleanJson = text;
        if (cleanJson.includes('```')) {
            cleanJson = cleanJson.replace(/```json/g, '').replace(/```/g, '');
        }
        cleanJson = cleanJson.trim();
        return JSON.parse(cleanJson);
    } catch (error) {
        console.error('AI Diagnostics Failed:', error);
        return {
            diagnosis: "Automated diagnosis failed. Please check logs manually.",
            actionSteps: ["Check server logs", "Verify network connectivity", "Inspect application status"]
        };
    }
}
module.exports = { aiDiagnostics };
