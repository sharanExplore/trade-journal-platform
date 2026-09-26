import { useEffect, useState } from 'react'
import '../styles/trades/Trades.css'
import EditTradeModal from "./EditTradeModal.jsx";

function Trades({ onNavigate }) {
    const [trades, setTrades] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [activeFilter, setActiveFilter] = useState('all')
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [editingTrade, setEditingTrade] = useState(null);
    const handleEdit = (trade) => {
        setEditingTrade(trade);
    };

    const handleCloseEdit = () => {
        setEditingTrade(null);
    };

    useEffect(() => {
        const token = localStorage.getItem('token')

        let url = `http://localhost:5000/api/trades?page=${currentPage}&limit=8`

        if (activeFilter === 'long') {
            url += '&tradeType=BUY'
        }

        if (activeFilter === 'short') {
            url += '&tradeType=SELL'
        }

        if (activeFilter === 'win') {
            url += '&status=CLOSED'
        }

        if (activeFilter === 'loss') {
            url += '&status=CLOSED'
        }

        if (activeFilter === 'breakeven') {
            url += '&status=CLOSED'
        }

        setLoading(true)
        setError('')

        fetch(url, {
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
                console.log('Pagination:', data.pagination)
                let filteredTrades = data.trades

                if (activeFilter === 'win') {
                    filteredTrades = filteredTrades.filter(
                        (trade) => trade.pnl > 0
                    )
                }

                if (activeFilter === 'loss') {
                    filteredTrades = filteredTrades.filter(
                        (trade) => trade.pnl < 0
                    )
                }

                if (activeFilter === 'breakeven') {
                    filteredTrades = filteredTrades.filter(
                        (trade) => trade.pnl === 0
                    )
                }

                setTrades(filteredTrades)
                setTotalPages(data.pagination.totalPages)
                setLoading(false)
            })
            .catch((error) => {
                console.error('Error fetching trades:', error)
                setError('Unable to load trades')
                setLoading(false)
            })
    }, [activeFilter, currentPage])
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
                        <button
                            className={`trades-filter-tab ${activeFilter === 'all' ? 'active' : ''
                                }`}
                            onClick={() => {
                                setActiveFilter('all')
                                setCurrentPage(1)
                            }}
                        >
                            All Trades
                        </button>

                        <button
                            className={`trades-filter-tab ${activeFilter === 'long' ? 'active' : ''
                                }`}
                            onClick={() => {
                                setActiveFilter('long')
                                setCurrentPage(1)
                            }}
                        >
                            Long
                        </button>

                        <button
                            className={`trades-filter-tab ${activeFilter === 'short' ? 'active' : ''
                                }`}
                            onClick={() => {
                                setActiveFilter('short')
                                setCurrentPage(1)
                            }}
                        >
                            Short
                        </button>

                        <button
                            className={`trades-filter-tab ${activeFilter === 'win' ? 'active' : ''
                                }`}
                            onClick={() => {
                                setActiveFilter('win')
                                setCurrentPage(1)
                            }}
                        >
                            Win
                        </button>

                        <button
                            className={`trades-filter-tab ${activeFilter === 'loss' ? 'active' : ''
                                }`}
                            onClick={() => {
                                setActiveFilter('loss')
                                setCurrentPage(1)
                            }}
                        >
                            Loss
                        </button>

                        <button
                            className={`trades-filter-tab ${activeFilter === 'breakeven' ? 'active' : ''
                                }`}
                            onClick={() => {
                                setActiveFilter('breakeven')
                                setCurrentPage(1)
                            }}
                        >
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
                                        <th>Actions</th>
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

                                                <td>
                                                    <span
                                                        className={
                                                            trade.tradeType === 'BUY'
                                                                ? 'trade-type-long'
                                                                : 'trade-type-short'
                                                        }
                                                    >
                                                        {trade.tradeType === 'BUY' ? 'Long' : 'Short'}
                                                    </span>
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
                                                <td>
                                                    <div className="trade-actions">
                                                        <button
                                                            className="trade-action-button edit"
                                                            title="Edit trade"
                                                            onClick={() => handleEdit(trade)}
                                                        >
                                                            ✎
                                                        </button>

                                                        <button
                                                            className="trade-action-button delete"
                                                            title="Delete trade"
                                                        >
                                                            🗑
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="trades-pagination">
                        <button
                            className="trades-pagination-button"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(currentPage - 1)}
                        >
                            ‹
                        </button>

                        {Array.from(
                            { length: totalPages },
                            (_, index) => index + 1
                        ).map((page) => (
                            <button
                                key={page}
                                className={`trades-pagination-button ${currentPage === page ? 'active' : ''
                                    }`}
                                onClick={() => setCurrentPage(page)}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            className="trades-pagination-button"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(currentPage + 1)}
                        >
                            ›
                        </button>
                    </div>
                    <EditTradeModal
                        trade={editingTrade}
                        onClose={handleCloseEdit}
                    />
                </main>
            </section>
        </div>
    )
}

export default Trades