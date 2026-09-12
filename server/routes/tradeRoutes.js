const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const Trade = require("../models/Trade");

// POST /api/trades -> create a new trade for the logged-in user
router.post("/", authMiddleware, async (req, res) => {
    try {
        const {
            symbol,
            market,
            tradeType,
            quantity,
            entryPrice,
            exitPrice,
            entryDate,
            exitDate,
            currency,
            strategyName,
        } = req.body;

        // Required fields
        if (
            !symbol ||
            !market ||
            !tradeType ||
            quantity === undefined ||
            entryPrice === undefined ||
            !entryDate ||
            !currency ||
            !strategyName
        ) {
            return res.status(400).json({
                message: "Missing required trade fields",
            });
        }

        // Number validation
        if (
            typeof quantity !== "number" ||
            !Number.isFinite(quantity) ||
            quantity <= 0
        ) {
            return res.status(400).json({
                message: "Quantity must be a valid number greater than 0",
            });
        }

        if (
            typeof entryPrice !== "number" ||
            !Number.isFinite(entryPrice) ||
            entryPrice <= 0
        ) {
            return res.status(400).json({
                message: "Entry price must be a valid number greater than 0",
            });
        }

        if (exitPrice !== undefined) {
            if (
                typeof exitPrice !== "number" ||
                !Number.isFinite(exitPrice) ||
                exitPrice <= 0
            ) {
                return res.status(400).json({
                    message: "Exit price must be a valid number greater than 0",
                });
            }
        }

        // Date validation
        const parsedEntryDate = new Date(entryDate);

        if (Number.isNaN(parsedEntryDate.getTime())) {
            return res.status(400).json({
                message: "Entry date must be a valid date",
            });
        }

        let parsedExitDate;

        if (exitDate !== undefined) {
            parsedExitDate = new Date(exitDate);

            if (Number.isNaN(parsedExitDate.getTime())) {
                return res.status(400).json({
                    message: "Exit date must be a valid date",
                });
            }
        }

        // Server decides the status
        const status =
            exitPrice !== undefined && exitDate !== undefined
                ? "CLOSED"
                : "OPEN";

        const trade = await Trade.create({
            user: req.userId,
            symbol,
            market,
            tradeType,
            quantity,
            entryPrice,
            exitPrice,
            entryDate: parsedEntryDate,
            exitDate: parsedExitDate,
            currency,
            strategyName,
            status,
        });

        return res.status(201).json({
            message: "Trade created successfully",
            trade: {
                id: trade._id,
                symbol: trade.symbol,
                market: trade.market,
                tradeType: trade.tradeType,
                quantity: trade.quantity,
                entryPrice: trade.entryPrice,
                exitPrice: trade.exitPrice,
                entryDate: trade.entryDate,
                exitDate: trade.exitDate,
                currency: trade.currency,
                strategyName: trade.strategyName,
                status: trade.status,
            },
        });
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: error.message,
            });
        }

        console.error("Create trade error:", error);

        return res.status(500).json({
            message: "Server error while creating trade",
        });
    }
});
// GET /api/trades -> get trades for the logged-in user
router.get("/", authMiddleware, async (req, res) => {
    try {
        const trades = await Trade.find({
            user: req.userId,
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            trades,
        });
    } catch (error) {
        console.error("Get trades error:", error);

        return res.status(500).json({
            message: "Server error while fetching trades",
        });
    }
});

module.exports = router;