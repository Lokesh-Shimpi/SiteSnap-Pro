const mongoose = require('mongoose');
const analysisHistorySchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    url: {
        type: String,
        required: true
    },
    screenshotUrl: {
        type: String, 
        default: ''
    },
    metrics: {
        type: Object, 
        default: {}
    }
}, {
    timestamps: true
});
module.exports = mongoose.model('AnalysisHistory', analysisHistorySchema);
