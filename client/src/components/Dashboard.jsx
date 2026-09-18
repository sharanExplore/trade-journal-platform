import { useEffect, useState } from 'react'

function Dashboard() {
    const [trades, setTrades] = useState([])

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
    }, [])

    return (
        <main>
            <h1>Tradefolio Dashboard</h1>
            <p>You are logged in successfully.</p>
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