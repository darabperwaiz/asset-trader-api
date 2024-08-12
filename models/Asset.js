import mongoose from "mongoose";

const assetSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'draft'
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    currentHolder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    tradingJourney: [
        {
            holder: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            date: {
                type: Date,
                default: Date.now
            },
            price: {type: Number, default: 0}
        }
    ],
    averageTradingPrice: {
        type: Number,
        default: 0
    },
    lastTradingPrice: {
        type: Number,
        default: 0
    },
    numberOfTransfers: {
        type: Number, default: 0
    },
    isListed: {
        type: Boolean,
        default: false
    },
    proposals: {
        type: Number, default: 0
    }
})

export const Asset = mongoose.model('Asset', assetSchema)