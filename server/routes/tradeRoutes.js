const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const Trade = require("../models/Trade");

const calculatePnL = require("../utils/pnl");

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

        const formattedTrades = trades.map((trade) => ({
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
            pnl: calculatePnL(trade),
        }));

        return res.status(200).json({
            trades: formattedTrades,
        });
    } catch (error) {
        console.error("Get trades error:", error);

        return res.status(500).json({
            message: "Server error while fetching trades",
        });
    }
});
// GET /api/trades/stats -> get dashboard statistics
router.get("/stats", authMiddleware, async (req, res) => {
    try {
        // Fetch all trades for the logged-in user
        const trades = await Trade.find({
            user: req.userId,
        });
        // Calculate statistics
        const totalTrades = trades.length;

        const closedTrades = trades.filter(
            (trade) => trade.status === "CLOSED"
        );

        const winningTrades = closedTrades.filter(
            (trade) => calculatePnL(trade) > 0
        ).length;

        const losingTrades = closedTrades.filter(
            (trade) => calculatePnL(trade) < 0
        ).length;

        const netPnL = closedTrades.reduce(
            (total, trade) => total + calculatePnL(trade),
            0
        );
        // Calculate win rate
        const winRate =
            closedTrades.length === 0
                ? 0
                : (winningTrades / closedTrades.length) * 100;

        const bestTrade =
            closedTrades.length === 0
                ? null
                : Math.max(...closedTrades.map((trade) => calculatePnL(trade)));

        const worstTrade =
            closedTrades.length === 0
                ? null
                : Math.min(...closedTrades.map((trade) => calculatePnL(trade)));

        // Calculate average win and average loss
        const averageWin =
            winningTrades === 0
                ? 0
                : closedTrades
                    .filter((trade) => calculatePnL(trade) > 0)
                    .reduce((total, trade) => total + calculatePnL(trade), 0) /
                winningTrades;

        const averageLoss =
            losingTrades === 0
                ? 0
                : closedTrades
                    .filter((trade) => calculatePnL(trade) < 0)
                    .reduce((total, trade) => total + calculatePnL(trade), 0) /
                losingTrades;
        // Return the statistics
        return res.status(200).json({
            totalTrades,
            closedTrades: closedTrades.length,
            winningTrades,
            losingTrades,
            netPnL,
            winRate,
            bestTrade,
            worstTrade,
            averageWin,
            averageLoss,
        });;

    } catch (error) {
        console.error("Get trade stats error:", error);

        return res.status(500).json({
            message: "Server error while fetching trade statistics",
        });
    }
});
// GET /api/trades/stats/strategies -> get P&L by strategy
router.get("/stats/strategies", authMiddleware, async (req, res) => {
    try {
        const trades = await Trade.find({
            user: req.userId,
            status: "CLOSED",
        });

        const strategyMap = {};

        trades.forEach((trade) => {
            const pnl = calculatePnL(trade);

            if (!strategyMap[trade.strategyName]) {
                strategyMap[trade.strategyName] = {
                    strategyName: trade.strategyName,
                    tradeCount: 0,
                    netPnL: 0,
                };
            }

            strategyMap[trade.strategyName].tradeCount += 1;
            strategyMap[trade.strategyName].netPnL += pnl;
        });

        return res.status(200).json({
            strategies: Object.values(strategyMap),
        });
    } catch (error) {
        console.error("Get strategy stats error:", error);

        return res.status(500).json({
            message: "Server error while fetching strategy statistics",
        });
    }
});
// GET /api/trades/stats/markets -> get P&L by market
router.get("/stats/markets", authMiddleware, async (req, res) => {
    try {
        const trades = await Trade.find({
            user: req.userId,
            status: "CLOSED",
        });

        const marketMap = {};

        trades.forEach((trade) => {
            const pnl = calculatePnL(trade);

            if (!marketMap[trade.market]) {
                marketMap[trade.market] = {
                    market: trade.market,
                    tradeCount: 0,
                    netPnL: 0,
                };
            }

            marketMap[trade.market].tradeCount += 1;
            marketMap[trade.market].netPnL += pnl;
        });

        return res.status(200).json({
            markets: Object.values(marketMap),
        });
    } catch (error) {
        console.error("Get market stats error:", error);

        return res.status(500).json({
            message: "Server error while fetching market statistics",
        });
    }
});
// GET /api/trades/stats/monthly -> get monthly P&L
router.get("/stats/monthly", authMiddleware, async (req, res) => {
    try {
        const trades = await Trade.find({
            user: req.userId,
            status: "CLOSED",
        });

        const monthlyMap = {};

        trades.forEach((trade) => {
            const month = trade.exitDate.toISOString().slice(0, 7);
            const key = `${month}_${trade.currency}`;

            const pnl = calculatePnL(trade);

            if (!monthlyMap[key]) {
                monthlyMap[key] = {
                    month,
                    currency: trade.currency,
                    tradeCount: 0,
                    netPnL: 0,
                };
            }

            monthlyMap[key].tradeCount += 1;
            monthlyMap[key].netPnL += pnl;
        });

        const monthly = Object.values(monthlyMap).sort((a, b) => {
            if (a.month !== b.month) {
                return a.month.localeCompare(b.month);
            }

            return a.currency.localeCompare(b.currency);
        });

        return res.status(200).json({
            monthly,
        });
    } catch (error) {
        console.error("Get monthly stats error:", error);

        return res.status(500).json({
            message: "Server error while fetching monthly statistics",
        });
    }
});
// GET /api/trades/:id -> get one trade for the logged-in user
router.get("/:id", authMiddleware, async (req, res) => {
    try {
        const trade = await Trade.findOne({
            _id: req.params.id,
            user: req.userId,
        });

        if (!trade) {
            return res.status(404).json({
                message: "Trade not found",
            });
        }

        return res.status(200).json({
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
                pnl: calculatePnL(trade),
            },
        });
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                message: "Invalid trade ID",
            });
        }

        console.error("Get trade error:", error);
        return res.status(500).json({
            message: "Server error while fetching trade",
        });
    }
});

// PUT /api/trades/:id -> update a trade for the logged-in user
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        // 1. Find the trade belonging to the logged-in user
        const trade = await Trade.findOne({
            _id: req.params.id,
            user: req.userId,
        });

        // 2. Check whether the trade exists
        if (!trade) {
            return res.status(404).json({
                message: "Trade not found",
            });
        }

        // 3. Get the fields that are allowed to change
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

        // 4. Update only fields that were provided
        if (symbol !== undefined) trade.symbol = symbol;
        if (market !== undefined) trade.market = market;
        if (tradeType !== undefined) trade.tradeType = tradeType;
        if (quantity !== undefined) trade.quantity = quantity;
        if (entryPrice !== undefined) trade.entryPrice = entryPrice;
        if (exitPrice !== undefined) trade.exitPrice = exitPrice;
        if (entryDate !== undefined) trade.entryDate = entryDate;
        if (exitDate !== undefined) trade.exitDate = exitDate;
        if (currency !== undefined) trade.currency = currency;
        if (strategyName !== undefined) trade.strategyName = strategyName;

        // 5. Check exit price and exit date
        // They must either both exist or both be absent.
        const hasExitPrice =
            trade.exitPrice !== undefined &&
            trade.exitPrice !== null;

        const hasExitDate =
            trade.exitDate !== undefined &&
            trade.exitDate !== null;

        if (hasExitPrice !== hasExitDate) {
            return res.status(400).json({
                message: "Exit price and exit date must be provided together",
            });
        }

        // 6. Check that exit date is not before entry date
        if (hasExitDate) {
            const parsedEntryDate = new Date(trade.entryDate);
            const parsedExitDate = new Date(trade.exitDate);

            if (
                Number.isNaN(parsedEntryDate.getTime()) ||
                Number.isNaN(parsedExitDate.getTime())
            ) {
                return res.status(400).json({
                    message: "Entry date and exit date must be valid dates",
                });
            }

            if (parsedExitDate < parsedEntryDate) {
                return res.status(400).json({
                    message: "Exit date cannot be earlier than entry date",
                });
            }
        }

        // 7. Server decides the status
        trade.status = hasExitPrice ? "CLOSED" : "OPEN";

        // 8. Save the updated trade
        await trade.save();

        // 9. Return the updated trade
        return res.status(200).json({
            message: "Trade updated successfully",
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
        // Invalid MongoDB ID
        if (error.name === "CastError") {
            return res.status(400).json({
                message: "Invalid trade ID",
            });
        }

        // Mongoose validation error
        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: error.message,
            });
        }

        // Unexpected server/database error
        console.error("Update trade error:", error);

        return res.status(500).json({
            message: "Server error while updating trade",
        });
    }
});

// DELETE /api/trades/:id -> delete a trade for the logged-in user
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        //finding the trade and deleting it in one step
        const trade = await Trade.findOneAndDelete({
            _id: req.params.id,
            user: req.userId,
        });

        //if the trade was not found, return a 404 error
        if (!trade) {
            return res.status(404).json({
                message: "Trade not found",
            });
        }

        //if the trade was found and deleted, return a success message
        return res.status(200).json({
            message: "Trade deleted successfully",
        });
    } catch (error) {
        // Invalid MongoDB ID
        if (error.name === "CastError") {
            return res.status(400).json({
                message: "Invalid trade ID",
            });
        }

        // Unexpected server/database error
        console.error("Delete trade error:", error);

        return res.status(500).json({
            message: "Server error while deleting trade",
        });
    }
});

module.exports = router;