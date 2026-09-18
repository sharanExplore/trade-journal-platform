import { useEffect, useState } from 'react'

function Dashboard() {
    const [trades, setTrades] = useState([])
    const [stats, setStats] = useState(null)

    useEffect(() => {
        const token = localStorage.getItem('token')

        fetch('http://localhost:5000/api/trades', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setTrades(data.trades)
            })
            .catch((error) => {
                console.error('Error fetching trades:', error)
            })
        fetch('http://localhost:5000/api/trades/stats', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setStats(data)
            })
            .catch((error) => {
                console.error('Error fetching stats:', error)
            })
    }, [])

    return (
        <main>
            <h1>Tradefolio Dashboard</h1>
            <p>You are logged in successfully.</p>
            {stats && (
                <p>Total P&L: {stats.netPnL.toFixed(2)}</p>
            )}
            <p>Total trades: {trades.length}</p>

            {trades.map((trade) => (
                <div key={trade.id}>
                    <h2>{trade.symbol}</h2>
                    <p>Type: {trade.tradeType}</p>
                    <p>Quantity: {trade.quantity}</p>
                    <p>P&L: {trade.pnl}</p>
                </div>
            ))}
        </main>
    )
}

export default Dashboard