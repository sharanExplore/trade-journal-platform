import '../styles/trades/Trades.css'

function Trades({ onNavigate }) {
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
                </main>
            </section>
        </div>
    )
}

export default Trades