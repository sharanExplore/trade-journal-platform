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
    const [equityCurve, setEquityCurve] = useState([])
    const [equityRange, setEquityRange] = useState('ALL')


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
        // Fetch strategy stats data
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
        // Fetch equity curve data
        fetch(
            `http://localhost:5000/api/trades/stats/equity-curve?range=${equityRange}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )
            .then((response) => response.json())
            .then((data) => {
                console.log('Equity curve:', data)
                setEquityCurve(data.equityCurve)
            })
            .catch((error) =>
                console.error('Error fetching equity curve:', error)
            )
    }, [equityRange]) // Re-run when equityRange changes

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
                    {/* Trade Distribution */}
                    <section className="dashboard-card dashboard-distribution">
                        <div className="dashboard-section-header">
                            <div>
                                <h2>Trade Distribution</h2>
                                <p>Closed trade results</p>
                            </div>
                        </div>

                        {stats ? (
                            (() => {
                                const closedTrades = stats.closedTrades || 0
                                const winningTrades = stats.winningTrades || 0
                                const losingTrades = stats.losingTrades || 0
                                const breakevenTrades =
                                    closedTrades - winningTrades - losingTrades

                                const winPercentage =
                                    closedTrades > 0
                                        ? (winningTrades / closedTrades) * 100
                                        : 0

                                const lossPercentage =
                                    closedTrades > 0
                                        ? (losingTrades / closedTrades) * 100
                                        : 0

                                const breakevenPercentage =
                                    closedTrades > 0
                                        ? (breakevenTrades / closedTrades) * 100
                                        : 0

                                const winEnd = winPercentage
                                const lossEnd = winPercentage + lossPercentage

                                return (
                                    <div className="dashboard-distribution-content">
                                        <div className="dashboard-donut-wrapper">
                                            <div
                                                className="dashboard-donut"
                                                style={{
                                                    background: `conic-gradient(
                                    #20e0b2 0% ${winEnd}%,
                                    #ff5757 ${winEnd}% ${lossEnd}%,
                                    #8b9ca3 ${lossEnd}% 100%
                                )`,
                                                }}
                                            >
                                                <div className="dashboard-donut-center">
                                                    <strong>{closedTrades}</strong>
                                                    <span>Trades</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="dashboard-distribution-legend">
                                            <div className="dashboard-distribution-item">
                                                <span className="dashboard-distribution-label">
                                                    <span className="dashboard-distribution-dot win"></span>
                                                    Win
                                                </span>

                                                <strong>
                                                    {winningTrades} ({winPercentage.toFixed(0)}%)
                                                </strong>
                                            </div>

                                            <div className="dashboard-distribution-item">
                                                <span className="dashboard-distribution-label">
                                                    <span className="dashboard-distribution-dot loss"></span>
                                                    Loss
                                                </span>

                                                <strong>
                                                    {losingTrades} ({lossPercentage.toFixed(0)}%)
                                                </strong>
                                            </div>

                                            <div className="dashboard-distribution-item">
                                                <span className="dashboard-distribution-label">
                                                    <span className="dashboard-distribution-dot breakeven"></span>
                                                    Breakeven
                                                </span>

                                                <strong>
                                                    {breakevenTrades} ({breakevenPercentage.toFixed(0)}%)
                                                </strong>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })()
                        ) : (
                            <p className="dashboard-chart-empty">
                                Loading trade distribution...
                            </p>
                        )}
                    </section>

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
                                <h2>Equity Curve</h2>
                                <p>Cumulative INR P&amp;L</p>
                            </div>

                            <div className="dashboard-range-buttons">
                                {['7D', '1W', '1M', '3M', '6M', '1Y', 'ALL'].map((range) => (
                                    <button
                                        key={range}
                                        className={`dashboard-range-button ${equityRange === range ? 'active' : ''
                                            }`}
                                        onClick={() => setEquityRange(range)}
                                    >
                                        {range}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="dashboard-equity-chart">
                            {equityCurve.length === 0 ? (
                                <p className="dashboard-chart-empty">
                                    No closed INR trades found for this period.
                                </p>
                            ) : (
                                (() => {
                                    const chartWidth = 1000
                                    const chartHeight = 320

                                    const paddingLeft = 55
                                    const paddingRight = 25
                                    const paddingTop = 25
                                    const paddingBottom = 40

                                    const chartData = [
                                        {
                                            date: new Date(
                                                new Date(equityCurve[0].date).getTime() - 86400000
                                            ),
                                            cumulativePnL: 0,
                                        },
                                        ...equityCurve,
                                    ]

                                    const values = chartData.map(
                                        (point) => point.cumulativePnL
                                    )

                                    const minValue = Math.min(0, ...values)
                                    const maxValue = Math.max(0, ...values)

                                    const valueRange = maxValue - minValue || 1

                                    const dates = chartData.map(
                                        (point) => new Date(point.date).getTime()
                                    )

                                    const minDate = Math.min(...dates)
                                    const maxDate = Math.max(...dates)

                                    const dateRange = maxDate - minDate || 1

                                    const getY = (value) => {
                                        return (
                                            chartHeight -
                                            paddingBottom -
                                            ((value - minValue) / valueRange) *
                                            (chartHeight - paddingTop - paddingBottom)
                                        )
                                    }

                                    const getX = (date) => {
                                        return (
                                            paddingLeft +
                                            ((new Date(date).getTime() - minDate) / dateRange) *
                                            (chartWidth - paddingLeft - paddingRight)
                                        )
                                    }

                                    const points = chartData.map((point) => ({
                                        ...point,
                                        x: getX(point.date),
                                        y: getY(point.cumulativePnL),
                                    }))

                                    const linePath = points
                                        .map((point, index) => {
                                            return `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
                                        })
                                        .join(' ')

                                    const areaPath = `
                ${linePath}
                L ${points[points.length - 1].x} ${chartHeight - paddingBottom}
                L ${points[0].x} ${chartHeight - paddingBottom}
                Z
            `

                                    const zeroY = getY(0)

                                    const yTicks = 5

                                    const yAxisValues = Array.from(
                                        { length: yTicks },
                                        (_, index) => {
                                            return (
                                                maxValue -
                                                (index / (yTicks - 1)) *
                                                (maxValue - minValue)
                                            )
                                        }
                                    )

                                    return (
                                        <svg
                                            className="dashboard-equity-svg"
                                            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                                            preserveAspectRatio="none"
                                        >
                                            <defs>
                                                <linearGradient
                                                    id="equityGradient"
                                                    x1="0"
                                                    y1="0"
                                                    x2="0"
                                                    y2="1"
                                                >
                                                    <stop
                                                        offset="0%"
                                                        stopColor="#20e0b2"
                                                        stopOpacity="0.22"
                                                    />

                                                    <stop
                                                        offset="100%"
                                                        stopColor="#20e0b2"
                                                        stopOpacity="0"
                                                    />
                                                </linearGradient>
                                            </defs>

                                            {/* Horizontal grid */}
                                            {yAxisValues.map((value, index) => {
                                                const y = getY(value)

                                                return (
                                                    <g key={`grid-${index}`}>
                                                        <line
                                                            x1={paddingLeft}
                                                            y1={y}
                                                            x2={chartWidth - paddingRight}
                                                            y2={y}
                                                            className="dashboard-equity-grid-line"
                                                        />

                                                        <text
                                                            x={paddingLeft - 10}
                                                            y={y + 4}
                                                            textAnchor="end"
                                                            className="dashboard-equity-axis-label"
                                                        >
                                                            {Math.round(value).toLocaleString()}
                                                        </text>
                                                    </g>
                                                )
                                            })}

                                            {/* Vertical grid */}
                                            {points.map((point, index) => (
                                                <line
                                                    key={`vertical-${index}`}
                                                    x1={point.x}
                                                    y1={paddingTop}
                                                    x2={point.x}
                                                    y2={chartHeight - paddingBottom}
                                                    className="dashboard-equity-grid-line vertical"
                                                />
                                            ))}

                                            {/* Zero line */}
                                            <line
                                                x1={paddingLeft}
                                                y1={zeroY}
                                                x2={chartWidth - paddingRight}
                                                y2={zeroY}
                                                className="dashboard-equity-zero-line"
                                            />

                                            {/* Area */}
                                            <path
                                                d={areaPath}
                                                className="dashboard-equity-area"
                                            />

                                            {/* Main curve */}
                                            <path
                                                d={linePath}
                                                className="dashboard-equity-line"
                                            />

                                            {/* Important points */}
                                            {points.map((point, index) => {
                                                const isFirst = index === 0
                                                const isLast = index === points.length - 1
                                                const isExtreme =
                                                    point.cumulativePnL === minValue ||
                                                    point.cumulativePnL === maxValue

                                                if (
                                                    !isFirst &&
                                                    !isLast &&
                                                    !isExtreme
                                                ) {
                                                    return null
                                                }

                                                return (
                                                    <g
                                                        key={`point-${index}`}
                                                    >
                                                        <circle
                                                            cx={point.x}
                                                            cy={point.y}
                                                            r="4.5"
                                                            className="dashboard-equity-dot"
                                                        />

                                                        <text
                                                            x={point.x}
                                                            y={point.y - 12}
                                                            textAnchor="middle"
                                                            className="dashboard-equity-value"
                                                        >
                                                            {point.cumulativePnL.toFixed(0)}
                                                        </text>
                                                    </g>
                                                )
                                            })}

                                            {/* Date labels */}
                                            {points.map((point, index) => {
                                                const date = new Date(point.date)

                                                const label = date.toLocaleDateString(
                                                    'en-IN',
                                                    {
                                                        day: '2-digit',
                                                        month: 'short',
                                                    }
                                                )

                                                const shouldShow =
                                                    index === 0 ||
                                                    index === points.length - 1 ||
                                                    index % Math.ceil(points.length / 5) === 0

                                                if (!shouldShow) {
                                                    return null
                                                }

                                                return (
                                                    <text
                                                        key={`date-${index}`}
                                                        x={point.x}
                                                        y={chartHeight - 12}
                                                        textAnchor="middle"
                                                        className="dashboard-equity-date"
                                                    >
                                                        {label}
                                                    </text>
                                                )
                                            })}
                                        </svg>
                                    )
                                })()
                            )}
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