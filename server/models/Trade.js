const mongoose = require("mongoose");

const tradeSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        symbol: {
            type: String,
            required: true,
            trim: true,
            uppercase: true,
        },
        market: {
            type: String,
            required: true,
            enum: ["stocks", "crypto", "forex", "indices", "commodities"],
        },
        tradeType: {
            type: String,
            required: true,
            enum: ["BUY", "SELL"],
        },
        quantity: {
            type: Number,
            required: true,
            min: [0.0000001, "Quantity must be greater than 0"],
        },
        entryPrice: {
            type: Number,
            required: true,
            min: [0.0000001, "Entry price must be greater than 0"],
        },
        exitPrice: {
            type: Number,
            min: [0.0000001, "Exit price must be greater than 0"],
        },
        entryDate: {
            type: Date,
            required: true,
        },
        exitDate: {
            type: Date,
        },
        currency: {
            type: String,
            required: true,
            enum: ["INR", "USD"],
        },
        strategyName: {
            type: String,
            required: true,
            trim: true,
        },
        status: {
            type: String,
            required: true,
            enum: ["OPEN", "CLOSED"],
            default: "OPEN",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Trade", tradeSchema);