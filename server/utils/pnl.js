const calculatePnL = (trade) => {
    // Open trades don't have realized P&L
    if (trade.status !== "CLOSED") {
        return null;
    }

    if (trade.tradeType === "BUY") {
        return (trade.exitPrice - trade.entryPrice) * trade.quantity;
    }

    if (trade.tradeType === "SELL") {
        return (trade.entryPrice - trade.exitPrice) * trade.quantity;
    }

    return null;
};

module.exports = calculatePnL;