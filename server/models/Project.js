const mongoose = require('mongoose');
const projectSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    url: {
        type: String,
        required: true,
        trim: true
    },
    baselineScreenshot: {
        type: Buffer,
        required: false
    },
    lastScreenshot: {
        type: Buffer,
        required: false
    },
    lastChecked: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['Healthy', 'Silent Failure', 'Down', 'Pending'],
        default: 'Pending'
    },
    lastCheckResult: {
        httpStatus: Number,
        visualDiffPercentage: Number,
        diagnosis: {
            diagnosis: String,
            actionSteps: [String]
        }
    }
}, { timestamps: true });
module.exports = mongoose.model('Project', projectSchema);
