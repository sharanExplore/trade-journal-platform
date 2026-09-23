import { useEffect, useState } from 'react'
import '../styles/trades/Trades.css'

function Trades({ onNavigate }) {
    const [trades, setTrades] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const token = localStorage.getItem('token')

        fetch('http://localhost:5000/api/trades', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch trades')
                }

                return response.json()
            })
            .then((data) => {
                setTrades(data.trades)
                setLoading(false)
            })
            .catch((error) => {
                console.error('Error fetching trades:', error)
                setError('Unable to load trades')
                setLoading(false)
            })
    }, [])
    return (
        <div className="trades-page">
            <aside className="trades-sidebar">
                <div className="trades-logo">
                    Trade<span>Folio</span>
                </div>

                <nav className="trades-nav">
                    <div
                        className="trades-nav-item"
                        onClick={() => onNavigate('dashboard')}
                    >
                        Dashboard
                    </div>
                    <div className="trades-nav-item active">Trades</div>
                    <div className="trades-nav-item">Analytics</div>
                    <div className="trades-nav-item">Calendar</div>
                    <div className="trades-nav-item">Watchlist</div>
                    <div className="trades-nav-item">Journal</div>
                    <div className="trades-nav-item">Goals</div>
                    <div className="trades-nav-item">Settings</div>
                </nav>
            </aside>

            <section className="trades-content">
                <header className="trades-header">
                    <input
                        className="trades-search"
                        type="text"
                        placeholder="Search trades, notes, symbols..."
                    />

                    <div className="trades-user">
                        Login Test
                    </div>
                </header>

                <main className="trades-main">
                    <div className="trades-page-heading">
                        <div>
                            <h1>Trades</h1>
                            <p>View, edit and manage all your trades.</p>
                        </div>

                        <div className="trades-heading-actions">
                            <button className="trades-add-button">
                                + Add Trade
                            </button>

                            <button className="trades-export-button">
                                Export
                            </button>
                        </div>
                    </div>

                    <div className="trades-filter-tabs">
                        <button className="trades-filter-tab active">
                            All Trades
                        </button>

                        <button className="trades-filter-tab">
                            Long
                        </button>

                        <button className="trades-filter-tab">
                            Short
                        </button>

                        <button className="trades-filter-tab">
                            Win
                        </button>

                        <button className="trades-filter-tab">
                            Loss
                        </button>

                        <button className="trades-filter-tab">
                            Breakeven
                        </button>
                    </div>
                    <div className="trades-table-card">
                        <div className="trades-table-wrapper">
                            <table className="trades-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Symbol</th>
                                        <th>Type</th>
                                        <th>Entry</th>
                                        <th>Exit</th>
                                        <th>Qty</th>
                                        <th>P&amp;L</th>
                                        <th>R:R</th>
                                        <th>Strategy</th>
                                        <th>Notes</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {loading && (
                                        <tr>
                                            <td colSpan="11">Loading trades...</td>
                                        </tr>
                                    )}

                                    {!loading && error && (
                                        <tr>
                                            <td colSpan="11">{error}</td>
                                        </tr>
                                    )}

                                    {!loading && !error && trades.length === 0 && (
                                        <tr>
                                            <td colSpan="11">No trades found</td>
                                        </tr>
                                    )}

                                    {!loading &&
                                        !error &&
                                        trades.map((trade) => (
                                            <tr key={trade.id}>
                                                <td>
                                                    {new Date(trade.entryDate).toLocaleDateString()}
                                                </td>

                                                <td>{trade.symbol}</td>

                                                <td
                                                    className={
                                                        trade.tradeType === 'BUY'
                                                            ? 'trade-type-long'
                                                            : 'trade-type-short'
                                                    }
                                                >
                                                    {trade.tradeType === 'BUY' ? 'Long' : 'Short'}
                                                </td>

                                                <td>{trade.entryPrice}</td>

                                                <td>{trade.exitPrice ?? '-'}</td>

                                                <td>{trade.quantity}</td>

                                                <td
                                                    className={
                                                        trade.pnl > 0
                                                            ? 'trade-pnl-positive'
                                                            : trade.pnl < 0
                                                                ? 'trade-pnl-negative'
                                                                : ''
                                                    }
                                                >
                                                    {trade.pnl ?? '-'}
                                                </td>

                                                <td>-</td>

                                                <td>{trade.strategyName}</td>

                                                <td>-</td>

                                                <td>{trade.status}</td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </section>
        </div>
    )
}

export default Trades