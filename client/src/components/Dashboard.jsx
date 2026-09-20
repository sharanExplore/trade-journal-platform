import { useEffect, useState } from 'react'
import '../styles/dashboard/Dashboard.css'

function Dashboard() {
    const [trades, setTrades] = useState([])
    const [stats, setStats] = useState(null)
    const [user, setUser] = useState(null)
    const [monthlyStats, setMonthlyStats] = useState([])
    const inrMonthlyStats = monthlyStats.filter(
        (item) => item.currency === 'INR'
    )
    const [strategyStats, setStrategyStats] = useState([])

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

        // Fetch monthly stats data
        fetch('http://localhost:5000/api/trades/stats/monthly', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('Monthly stats:', data)
                setMonthlyStats(data.monthly)
            })
            .catch((error) => {
                console.error('Error fetching monthly stats:', error)
            })
        fetch('http://localhost:5000/api/trades/stats/strategies', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('Strategy stats:', data)
                setStrategyStats(data.strategies)
            })
            .catch((error) => {
                console.error('Error fetching strategy stats:', error)
            })
    }, [])

    return (
        <div className="dashboard">
            <aside className="dashboard-sidebar">
                <div className="dashboard-logo">
                    Trade<span>Folio</span>
                </div>

                <nav className="dashboard-nav">
                    <div className="dashboard-nav-item active">
                        Dashboard
                    </div>

                    <div className="dashboard-nav-item">
                        Trades
                    </div>

                    <div className="dashboard-nav-item">
                        Analytics
                    </div>

                    <div className="dashboard-nav-item">
                        Calendar
                    </div>

                    <div className="dashboard-nav-item">
                        Watchlist
                    </div>

                    <div className="dashboard-nav-item">
                        Journal
                    </div>

                    <div className="dashboard-nav-item">
                        Goals
                    </div>

                    <div className="dashboard-nav-item">
                        Settings
                    </div>
                </nav>
            </aside>

            {/* Main content area */}
            <section className="dashboard-content">
                <header className="dashboard-header">
                    <input
                        className="dashboard-search"
                        type="text"
                        placeholder="Search trades, notes, symbols..."
                    />

                    {user && (
                        <div className="dashboard-user">
                            {user.name}
                        </div>
                    )}
                </header>

                <main className="dashboard-main">
                    <h1>Dashboard</h1>

                    {user && (
                        <p>
                            Here's an overview of your trading performance.
                        </p>
                    )}

                    {/* Key Performance Indicators */}
                    <div className="dashboard-kpi-grid">
                        <div className="dashboard-card dashboard-kpi">
                            <p className="dashboard-kpi-label">Net P&L</p>

                            <p className="dashboard-kpi-value is-positive">
                                {stats?.netPnL?.toFixed(2)}
                            </p>

                            <p className="dashboard-kpi-note">
                                Overall trading result
                            </p>
                        </div>

                        <div className="dashboard-card dashboard-kpi">
                            <p className="dashboard-kpi-label">Win Rate</p>

                            <p className="dashboard-kpi-value">
                                {stats?.winRate?.toFixed(2)}%
                            </p>

                            <p className="dashboard-kpi-note">
                                {stats?.winningTrades} winning trades
                            </p>
                        </div>

                        <div className="dashboard-card dashboard-kpi">
                            <p className="dashboard-kpi-label">
                                Total Trades
                            </p>

                            <p className="dashboard-kpi-value">
                                {stats?.totalTrades}
                            </p>

                            <p className="dashboard-kpi-note">
                                {stats?.closedTrades} closed trades
                            </p>
                        </div>

                        <div className="dashboard-card dashboard-kpi">
                            <p className="dashboard-kpi-label">
                                Best Trade
                            </p>

                            <p className="dashboard-kpi-value is-positive">
                                {stats?.bestTrade?.toFixed(2)}
                            </p>

                            <p className="dashboard-kpi-note">
                                Highest individual P&L
                            </p>
                        </div>
                    </div>

                    {/* Recent Trades */}
                    <section className="dashboard-card dashboard-trades">
                        <div className="dashboard-section-header">
                            <div>
                                <h2>Recent Trades</h2>
                                <p>Your latest trading activity</p>
                            </div>
                        </div>

                        <div className="dashboard-table-wrapper">
                            <table className="dashboard-table">
                                <thead>
                                    <tr>
                                        <th>Symbol</th>
                                        <th>Type</th>
                                        <th>Quantity</th>
                                        <th>Entry Price</th>
                                        <th>Exit Price</th>
                                        <th>Status</th>
                                        <th>P&L</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {trades.map((trade) => (
                                        <tr key={trade.id}>
                                            <td>{trade.symbol}</td>
                                            <td>{trade.tradeType}</td>
                                            <td>{trade.quantity}</td>
                                            <td>{trade.entryPrice}</td>
                                            <td>{trade.exitPrice ?? '-'}</td>
                                            <td>{trade.status}</td>
                                            <td>{trade.pnl ?? '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* Monthly Performance */}
                    <section className="dashboard-card dashboard-performance">
                        <div className="dashboard-section-header">
                            <div>
                                <h2>Monthly Performance</h2>
                                <p>Your trading performance by month</p>
                            </div>
                        </div>

                        <div className="dashboard-monthly-list">
                            {monthlyStats.map((item) => (
                                <div
                                    className="dashboard-monthly-item"
                                    key={`${item.month}-${item.currency}`}
                                >
                                    <div>
                                        <p className="dashboard-month">
                                            {item.month}
                                        </p>

                                        <p className="dashboard-monthly-meta">
                                            {item.tradeCount} {item.tradeCount === 1 ? 'trade' : 'trades'} · {item.currency}
                                        </p>
                                    </div>

                                    <p
                                        className={`dashboard-monthly-pnl ${item.netPnL >= 0
                                            ? 'is-positive'
                                            : 'is-negative'
                                            }`}
                                    >
                                        {item.netPnL.toFixed(2)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                    <section className="dashboard-card dashboard-performance-chart">
                        <div className="dashboard-section-header">
                            <div>
                                <h2>Performance Overview</h2>
                                <p>Monthly INR net P&amp;L</p>
                            </div>
                        </div>

                        <div className="dashboard-chart">
                            {inrMonthlyStats.map((item) => {
                                const isPositive = item.netPnL >= 0
                                const barHeight = Math.max(
                                    Math.abs(item.netPnL) / 10,
                                    8
                                )

                                return (
                                    <div
                                        className="dashboard-chart-item"
                                        key={`${item.month}-${item.currency}`}
                                    >
                                        <div
                                            className="dashboard-chart-bar"
                                            style={{
                                                height: `${barHeight}px`,
                                                backgroundColor: isPositive
                                                    ? '#20e0b2'
                                                    : '#ff5f6d',
                                                bottom: isPositive ? '50%' : 'auto',
                                                top: isPositive ? 'auto' : '50%',
                                            }}
                                        />

                                        <div
                                            className="dashboard-chart-value"
                                            style={{
                                                bottom: isPositive
                                                    ? `calc(50% + ${barHeight + 10}px)`
                                                    : 'auto',
                                                top: isPositive
                                                    ? 'auto'
                                                    : `calc(50% + ${barHeight + 10}px)`,
                                            }}
                                        >
                                            {item.netPnL.toFixed(0)}
                                        </div>

                                        <div
                                            className="dashboard-chart-label"
                                            style={{
                                                top: isPositive
                                                    ? 'auto'
                                                    : `calc(50% + ${barHeight + 35}px)`,
                                                bottom: isPositive ? '0' : 'auto',
                                            }}
                                        >
                                            {item.month}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </section>
                    <section className="dashboard-card dashboard-strategy-section">
                        <div className="dashboard-section-header">
                            <div>
                                <h2>Strategy Performance</h2>
                                <p>Your results by trading strategy</p>
                            </div>
                        </div>

                        <div className="dashboard-strategy-list">
                            {strategyStats.map((strategy) => (
                                <div
                                    className="dashboard-strategy-row"
                                    key={strategy.strategyName}
                                >
                                    <div>
                                        <p className="dashboard-strategy-name">
                                            {strategy.strategyName}
                                        </p>

                                        <p className="dashboard-strategy-trades">
                                            {strategy.tradeCount}{' '}
                                            {strategy.tradeCount === 1 ? 'trade' : 'trades'}
                                        </p>
                                    </div>

                                    <p
                                        className={`dashboard-strategy-pnl ${strategy.netPnL >= 0
                                                ? 'is-positive'
                                                : 'is-negative'
                                            }`}
                                    >
                                        {strategy.netPnL.toFixed(2)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                </main>
            </section>
        </div>
    )
}

export default Dashboard