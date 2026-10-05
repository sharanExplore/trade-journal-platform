import { useEffect, useState } from "react";
import "../styles/analytics/Analytics.css";

function Analytics({ onNavigate }) {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");

        fetch("http://localhost:5000/api/trades/analytics", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch analytics");
                }

                return response.json();
            })
            .then((data) => {
                setAnalytics(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Analytics error:", error);
                setError("Unable to load analytics");
                setLoading(false);
            });
    }, []);
    return (
        <div className="analytics">
            {/* Sidebar */}
            <aside className="analytics-sidebar">
                <div className="analytics-logo">
                    Trade<span>Folio</span>
                </div>

                <nav className="analytics-nav">
                    <div
                        className="analytics-nav-item"
                        onClick={() => onNavigate("dashboard")}
                    >
                        Dashboard
                    </div>

                    <div
                        className="analytics-nav-item"
                        onClick={() => onNavigate("trades")}
                    >
                        Trades
                    </div>

                    <div className="analytics-nav-item active">
                        Analytics
                    </div>

                    <div className="analytics-nav-item">
                        Calendar
                    </div>

                    <div className="analytics-nav-item">
                        Watchlist
                    </div>

                    <div className="analytics-nav-item">
                        Journal
                    </div>

                    <div className="analytics-nav-item">
                        Goals
                    </div>

                    <div className="analytics-nav-item">
                        Settings
                    </div>
                </nav>
            </aside>

            {/* Main content */}
            <section className="analytics-content">

                {/* Top header */}
                <header className="analytics-header">
                    <input
                        className="analytics-search"
                        type="text"
                        placeholder="Search trades, notes, symbols..."
                    />

                    <div className="analytics-user">
                        Login Test
                    </div>
                </header>

                <main className="analytics-main">

                    {/* Page heading */}
                    <header className="analytics-page-header">
                        <div>
                            <h1>Analytics</h1>
                            <p>
                                Deep insights into your trading performance.
                            </p>
                        </div>

                        <div className="analytics-time-range">
                            <button>1W</button>
                            <button className="active">1M</button>
                            <button>3M</button>
                            <button>6M</button>
                            <button>1Y</button>
                            <button>Custom</button>

                            <button className="analytics-calendar-button">
                                ▣
                            </button>
                        </div>
                    </header>

                    {/* KPI Cards */}
                    <section className="analytics-kpi-grid">

                        <div className="analytics-card analytics-kpi-card">
                            <div className="analytics-kpi-icon green">
                                ₹
                            </div>

                            <div>
                                <p>Total P&amp;L</p>
                                <h2>
                                    {loading
                                        ? "Loading..."
                                        : `₹${analytics?.summary.totalPnL.toFixed(2)}`}
                                </h2>

                                <span className="analytics-positive">
                                    ↑ 18.4%
                                </span>

                                <small>vs previous month</small>
                            </div>
                        </div>

                        <div className="analytics-card analytics-kpi-card">
                            <div className="analytics-kpi-icon purple">
                                ◉
                            </div>

                            <div>
                                <p>Win Rate</p>
                                <h2>
                                    {loading
                                        ? "Loading..."
                                        : `${analytics?.summary.winRate.toFixed(1)}%`}
                                </h2>

                                <span className="analytics-positive">
                                    ↑ 6%
                                </span>

                                <small>vs previous month</small>
                            </div>
                        </div>

                        <div className="analytics-card analytics-kpi-card">
                            <div className="analytics-kpi-icon blue">
                                ▥
                            </div>

                            <div>
                                <p>Profit Factor</p>
                                <h2>
                                    {loading
                                        ? "Loading..."
                                        : analytics?.summary.profitFactor === Infinity
                                            ? "∞"
                                            : analytics?.summary.profitFactor.toFixed(2)}
                                </h2>

                                <span className="analytics-positive">
                                    ↑ 0.6
                                </span>

                                <small>vs previous month</small>
                            </div>
                        </div>

                        <div className="analytics-card analytics-kpi-card">
                            <div className="analytics-kpi-icon purple">
                                ⌁
                            </div>

                            <div>
                                <p>Expectancy</p>
                                <h2>
                                    {loading
                                        ? "Loading..."
                                        : `₹${analytics?.summary.expectancy.toFixed(2)}`}
                                </h2>

                                <span className="analytics-positive">
                                    ↑ 0.3R
                                </span>

                                <small>vs previous month</small>
                            </div>
                        </div>

                    </section>

                    {/* Analytics tabs */}
                    <nav className="analytics-tabs">
                        <button className="active">
                            Overview
                        </button>

                        <button>
                            By Symbol
                        </button>

                        <button>
                            By Setup
                        </button>

                        <button>
                            By Time
                        </button>

                        <button>
                            By Day
                        </button>

                        <button>
                            Risk Analysis
                        </button>

                        <button>
                            Advanced
                        </button>
                    </nav>

                    {/* Analytics cards */}
                    <section className="analytics-grid">

                        {/* Cumulative P&L */}
                        <div className="analytics-card analytics-large-card">
                            <div className="analytics-card-header">
                                <div>
                                    <h2>Cumulative P&amp;L</h2>
                                    <span>ⓘ</span>
                                </div>

                                <button className="analytics-select">
                                    1M ▾
                                </button>
                            </div>

                            <div className="analytics-chart-placeholder">
                                Cumulative P&amp;L Chart
                            </div>
                        </div>

                        {/* Monthly P&L */}
                        <div className="analytics-card analytics-large-card">
                            <div className="analytics-card-header">
                                <div>
                                    <h2>Monthly P&amp;L</h2>
                                    <span>ⓘ</span>
                                </div>

                                <button className="analytics-select">
                                    2026 ▾
                                </button>
                            </div>

                            <div className="analytics-chart-placeholder">
                                Monthly P&amp;L Chart
                            </div>
                        </div>

                        {/* Risk Reward */}
                        <div className="analytics-card analytics-risk-card">
                            <div className="analytics-card-header">
                                <h2>Trades by Risk-Reward</h2>
                                <span>ⓘ</span>
                            </div>

                            <div className="analytics-donut-placeholder">
                                <strong>124</strong>
                                <span>Trades</span>
                            </div>

                            <div className="analytics-risk-legend">
                                <p>
                                    <span className="green-dot" />
                                    1:1
                                    <b>20%</b>
                                </p>

                                <p>
                                    <span className="purple-dot" />
                                    1:2
                                    <b>36%</b>
                                </p>

                                <p>
                                    <span className="red-dot" />
                                    1:3
                                    <b>30%</b>
                                </p>

                                <p>
                                    <span className="blue-dot" />
                                    1.5+
                                    <b>19%</b>
                                </p>
                            </div>
                        </div>

                        {/* Win Rate by Setup */}
                        <div className="analytics-card analytics-bottom-card">
                            <div className="analytics-card-header">
                                <h2>Win Rate by Setup</h2>
                                <span>ⓘ</span>
                            </div>

                            <div className="analytics-bars-placeholder">

                                <div>
                                    <span>Breakout</span>
                                    <i />
                                    <b>78%</b>
                                </div>

                                <div>
                                    <span>Trend</span>
                                    <i />
                                    <b>69%</b>
                                </div>

                                <div>
                                    <span>Range</span>
                                    <i />
                                    <b>52%</b>
                                </div>

                                <div>
                                    <span>Reversal</span>
                                    <i className="loss" />
                                    <b>46%</b>
                                </div>

                                <div>
                                    <span>News</span>
                                    <i />
                                    <b>70%</b>
                                </div>

                            </div>
                        </div>

                        {/* Profit/Loss by Symbol */}
                        <div className="analytics-card analytics-bottom-card">
                            <div className="analytics-card-header">
                                <h2>Profit/Loss by Symbol</h2>
                                <span>ⓘ</span>
                            </div>

                            <div className="analytics-bars-placeholder">

                                <div>
                                    <span>BTC/USD</span>
                                    <i />
                                    <b>+3,420</b>
                                </div>

                                <div>
                                    <span>ETH/USD</span>
                                    <i />
                                    <b>+2,180</b>
                                </div>

                                <div>
                                    <span>SOL/USD</span>
                                    <i />
                                    <b>+1,240</b>
                                </div>

                                <div>
                                    <span>AR/AR/USD</span>
                                    <i className="loss" />
                                    <b className="loss-text">
                                        -380
                                    </b>
                                </div>

                                <div>
                                    <span>LINK/USD</span>
                                    <i className="loss" />
                                    <b className="loss-text">
                                        -640
                                    </b>
                                </div>

                            </div>
                        </div>

                        {/* P&L Heatmap */}
                        <div className="analytics-card analytics-bottom-card">
                            <div className="analytics-card-header">
                                <h2>P&amp;L Heatmap</h2>

                                <button className="analytics-select">
                                    2026 ▾
                                </button>
                            </div>

                            <div className="analytics-heatmap-placeholder">
                                {Array.from({ length: 84 }).map(
                                    (_, index) => (
                                        <span key={index} />
                                    )
                                )}
                            </div>
                        </div>

                    </section>

                </main>
            </section>
        </div>
    );
}

export default Analytics;