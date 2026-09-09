function Hero() {
    return (
        <section className="hero">
            <div className="container hero-inner">
                <div className="hero-text">
                    <h1>Track Every Trade. Improve Every Decision.</h1>
                    <p>
                        Your personal trading and investment journal to track
                        performance, analyze decisions, and build better trading
                        habits.
                    </p>
                    <div className="hero-actions">
                        <button type="button" className="btn btn-primary btn-lg">
                            Start Journaling
                        </button>
                        <button type="button" className="btn btn-secondary btn-lg">
                            Explore Features
                        </button>
                    </div>
                </div>

                {/* Static dashboard mockup - not real data */}
                <div className="hero-preview">
                    <div className="preview-card">
                        <div className="preview-header">
                            <span className="preview-title">Dashboard Preview</span>
                            <span className="preview-badge">Live Sample</span>
                        </div>

                        <div className="preview-stats">
                            <div className="stat">
                                <span className="stat-label">Total P&amp;L</span>
                                <span className="stat-value positive">+$4,230</span>
                            </div>
                            <div className="stat">
                                <span className="stat-label">Win Rate</span>
                                <span className="stat-value">62%</span>
                            </div>
                            <div className="stat">
                                <span className="stat-label">Total Trades</span>
                                <span className="stat-value">128</span>
                            </div>
                            <div className="stat">
                                <span className="stat-label">Avg. R/R</span>
                                <span className="stat-value">1:2.4</span>
                            </div>
                        </div>

                        <div className="preview-chart">
                            <div className="bar" style={{ height: '30%' }}></div>
                            <div className="bar" style={{ height: '55%' }}></div>
                            <div className="bar" style={{ height: '40%' }}></div>
                            <div className="bar" style={{ height: '70%' }}></div>
                            <div className="bar" style={{ height: '50%' }}></div>
                            <div className="bar" style={{ height: '85%' }}></div>
                            <div className="bar" style={{ height: '65%' }}></div>
                        </div>

                        <div className="preview-trades">
                            <div className="trade-row">
                                <span>BTC/USD</span>
                                <span className="positive">+2.1%</span>
                            </div>
                            <div className="trade-row">
                                <span>ETH/USD</span>
                                <span className="negative">-0.8%</span>
                            </div>
                            <div className="trade-row">
                                <span>SOL/USD</span>
                                <span className="positive">+4.6%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    )
}

export default Hero

