import { useEffect, useState } from 'react'

function Dashboard() {
    const [trades, setTrades] = useState([])
    const [stats, setStats] = useState(null)
    const [user, setUser] = useState(null)

    useEffect(() => {
        const token = localStorage.getItem('token')

        // Fetch trades data
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
        // Fetch stats data
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
        // Fetch user data
        fetch('http://localhost:5000/api/auth/me', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setUser(data)
            })
            .catch((error) => {
                console.error('Error fetching user:', error)
            })
    }, [])

    return (
        <main>
            <h1>Tradefolio Dashboard</h1>
            {user && (
                <>
                    <h2>Welcome, {user.name}</h2>
                    <p>{user.email}</p>
                </>
            )}
            {stats && (
                <p>Total P&L: {stats.netPnL.toFixed(2)}</p>
            )}
            <p>Total trades: {trades.length}</p>

            <table>
                <thead>
                    <tr>
                        <th>Symbol</th>
                        <th>Market</th>
                        <th>Type</th>
                        <th>Quantity</th>
                        <th>Entry Price</th>
                        <th>Exit Price</th>
                        <th>Strategy</th>
                        <th>Status</th>
                        <th>P&L</th>
                    </tr>
                </thead>

                <tbody>
                    {trades.map((trade) => (
                        <tr key={trade.id}>
                            <td>{trade.symbol}</td>
                            <td>{trade.market}</td>
                            <td>{trade.tradeType}</td>
                            <td>{trade.quantity}</td>
                            <td>{trade.entryPrice}</td>
                            <td>{trade.exitPrice}</td>
                            <td>{trade.strategyName}</td>
                            <td>{trade.status}</td>
                            <td>{trade.pnl}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </main>
    )
}

export default Dashboard