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

    const summary = analytics?.summary;
    const symbols = analytics?.symbols || [];
    const strategies = analytics?.strategies || [];

    const maxSymbolPnL = Math.max(
        ...symbols.map((item) => Math.abs(item.pnl)),
        1
    );

    const maxStrategyWinRate = Math.max(
        ...strategies.map((item) => item.winRate),
        1
    );

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

            {/* Main */}
            <section className="analytics-content">

                {/* Top Header */}
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

                    {/* Page Header */}
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

                    {error && (
                        <div className="analytics-error">
                            {error}
                        </div>
                    )}

                    {/* KPI Cards */}
                    <section className="analytics-kpi-grid">

                        <div className="analytics-card analytics-kpi-card">
                            <div className="analytics-kpi-icon green">
                                ₹
                            </div>

                            <div className="analytics-kpi-content">
                                <p>Total P&amp;L</p>

                                <h2>
                                    {loading
                                        ? "Loading..."
                                        : `₹${Number(
                                            summary?.totalPnL ?? 0
                                        ).toFixed(2)}`}
                                </h2>

                                <span className="analytics-positive">
                                    Total closed trade P&amp;L
                                </span>
                            </div>

                            <div className="kpi-mini-chart green-chart">
                                <span />
                                <span />
                                <span />
                                <span />
                                <span />
                            </div>
                        </div>

                        <div className="analytics-card analytics-kpi-card">
                            <div className="analytics-kpi-icon purple">
                                ◉
                            </div>

                            <div className="analytics-kpi-content">
                                <p>Win Rate</p>

                                <h2>
                                    {loading
                                        ? "Loading..."
                                        : `${Number(
                                            summary?.winRate ?? 0
                                        ).toFixed(1)}%`}
                                </h2>

                                <span className="analytics-positive">
                                    Winning trades
                                </span>
                            </div>

                            <div className="kpi-ring">
                                <span />
                            </div>
                        </div>

                        <div className="analytics-card analytics-kpi-card">
                            <div className="analytics-kpi-icon blue">
                                ▥
                            </div>

                            <div className="analytics-kpi-content">
                                <p>Profit Factor</p>

                                <h2>
                                    {loading
                                        ? "Loading..."
                                        : summary?.profitFactor === Infinity
                                            ? "∞"
                                            : Number(
                                                summary?.profitFactor ?? 0
                                            ).toFixed(2)}
                                </h2>

                                <span className="analytics-positive">
                                    Gross profit ÷ gross loss
                                </span>
                            </div>

                            <div className="kpi-bars">
                                <span />
                                <span />
                                <span />
                                <span />
                            </div>
                        </div>

                        <div className="analytics-card analytics-kpi-card">
                            <div className="analytics-kpi-icon purple">
                                ⌁
                            </div>

                            <div className="analytics-kpi-content">
                                <p>Expectancy</p>

                                <h2>
                                    {loading
                                        ? "Loading..."
                                        : `₹${Number(
                                            summary?.expectancy ?? 0
                                        ).toFixed(2)}`}
                                </h2>

                                <span className="analytics-positive">
                                    Average P&amp;L per trade
                                </span>
                            </div>

                            <div className="kpi-line-chart">
                                <span />
                            </div>
                        </div>

                    </section>

                    {/* Tabs */}
                    <nav className="analytics-tabs">
                        <button className="active">
                            Overview
                        </button>

                        <button>By Symbol</button>
                        <button>By Setup</button>
                        <button>By Time</button>
                        <button>By Day</button>
                        <button>Risk Analysis</button>
                        <button>Advanced</button>
                    </nav>

                    {/* Main Analytics Grid */}
                    <section className="analytics-grid">

                        {/* Cumulative P&L */}
                        <div className="analytics-card cumulative-card">
                            <div className="analytics-card-header">
                                <div>
                                    <h2>Cumulative P&amp;L</h2>
                                    <span>ⓘ</span>
                                </div>

                                <button className="analytics-select">
                                    1M ▾
                                </button>
                            </div>

                            <div className="cumulative-chart">

                                <div className="chart-y-axis">
                                    <span>20K</span>
                                    <span>10K</span>
                                    <span>0</span>
                                    <span>-10K</span>
                                </div>

                                <div className="chart-area">
                                    <div className="chart-grid-line line-1" />
                                    <div className="chart-grid-line line-2" />
                                    <div className="chart-grid-line line-3" />
                                    <div className="chart-grid-line line-4" />

                                    <svg
                                        viewBox="0 0 600 190"
                                        preserveAspectRatio="none"
                                        className="cumulative-svg"
                                    >
                                        <defs>
                                            <linearGradient
                                                id="pnlFill"
                                                x1="0"
                                                y1="0"
                                                x2="0"
                                                y2="1"
                                            >
                                                <stop
                                                    offset="0%"
                                                    stopColor="#20e0b2"
                                                    stopOpacity="0.35"
                                                />
                                                <stop
                                                    offset="100%"
                                                    stopColor="#20e0b2"
                                                    stopOpacity="0"
                                                />
                                            </linearGradient>
                                        </defs>

                                        <path
                                            className="pnl-area"
                                            d="M0 145
                                            L25 137
                                            L50 140
                                            L75 130
                                            L100 134
                                            L125 118
                                            L150 125
                                            L175 105
                                            L200 112
                                            L225 96
                                            L250 103
                                            L275 82
                                            L300 91
                                            L325 80
                                            L350 88
                                            L375 70
                                            L400 82
                                            L425 60
                                            L450 74
                                            L475 55
                                            L500 68
                                            L525 48
                                            L550 54
                                            L575 35
                                            L600 24
                                            L600 190
                                            L0 190 Z"
                                        />

                                        <path
                                            className="pnl-line"
                                            d="M0 145
                                            L25 137
                                            L50 140
                                            L75 130
                                            L100 134
                                            L125 118
                                            L150 125
                                            L175 105
                                            L200 112
                                            L225 96
                                            L250 103
                                            L275 82
                                            L300 91
                                            L325 80
                                            L350 88
                                            L375 70
                                            L400 82
                                            L425 60
                                            L450 74
                                            L475 55
                                            L500 68
                                            L525 48
                                            L550 54
                                            L575 35
                                            L600 24"
                                        />
                                    </svg>

                                    <div className="chart-tooltip">
                                        <strong>Current</strong>
                                        <b>
                                            ₹
                                            {Number(
                                                summary?.totalPnL ?? 0
                                            ).toFixed(2)}
                                        </b>
                                    </div>

                                    <div className="chart-dates">
                                        <span>Aug 20</span>
                                        <span>Aug 27</span>
                                        <span>Sep 3</span>
                                        <span>Sep 10</span>
                                        <span>Sep 17</span>
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* Win Rate by Setup */}
                        <div className="analytics-card setup-card">
                            <div className="analytics-card-header">
                                <div>
                                    <h2>Win Rate by Setup</h2>
                                    <span>ⓘ</span>
                                </div>
                            </div>

                            <div className="analytics-bars">
                                {strategies.length > 0 ? (
                                    strategies
                                        .slice(0, 5)
                                        .map((strategy) => (
                                            <div
                                                className="analytics-bar-row"
                                                key={strategy.strategy}
                                            >
                                                <span>
                                                    {strategy.strategy}
                                                </span>

                                                <div className="analytics-bar-track">
                                                    <i
                                                        style={{
                                                            width: `${(
                                                                strategy.winRate /
                                                                maxStrategyWinRate
                                                            ) * 100}%`,
                                                        }}
                                                        className={
                                                            strategy.winRate < 50
                                                                ? "loss"
                                                                : ""
                                                        }
                                                    />
                                                </div>

                                                <b>
                                                    {strategy.winRate.toFixed(
                                                        0
                                                    )}
                                                    %
                                                </b>
                                            </div>
                                        ))
                                ) : (
                                    <p className="analytics-empty">
                                        No strategy data yet
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Profit/Loss by Symbol */}
                        <div className="analytics-card symbol-card">
                            <div className="analytics-card-header">
                                <div>
                                    <h2>Profit/Loss by Symbol</h2>
                                    <span>ⓘ</span>
                                </div>
                            </div>

                            <div className="analytics-bars">
                                {symbols.length > 0 ? (
                                    symbols
                                        .slice(0, 5)
                                        .map((item) => (
                                            <div
                                                className="analytics-bar-row"
                                                key={item.symbol}
                                            >
                                                <span>
                                                    {item.symbol}
                                                </span>

                                                <div className="analytics-bar-track">
                                                    <i
                                                        className={
                                                            item.pnl < 0
                                                                ? "loss"
                                                                : ""
                                                        }
                                                        style={{
                                                            width: `${Math.max(
                                                                (Math.abs(
                                                                    item.pnl
                                                                ) /
                                                                    maxSymbolPnL) *
                                                                100,
                                                                8
                                                            )}%`,
                                                        }}
                                                    />
                                                </div>

                                                <b
                                                    className={
                                                        item.pnl < 0
                                                            ? "loss-text"
                                                            : ""
                                                    }
                                                >
                                                    {item.pnl >= 0
                                                        ? "+"
                                                        : ""}
                                                    {item.pnl.toFixed(0)}
                                                </b>
                                            </div>
                                        ))
                                ) : (
                                    <p className="analytics-empty">
                                        No symbol data yet
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* P&L Heatmap */}
                        <div className="analytics-card heatmap-card">
                            <div className="analytics-card-header">
                                <div>
                                    <h2>P&amp;L Heatmap</h2>
                                    <span>ⓘ</span>
                                </div>

                                <div className="heatmap-controls">
                                    <button>‹</button>
                                    <strong>2026</strong>
                                    <button>›</button>
                                </div>
                            </div>

                            <div className="heatmap-body">

                                <div className="heatmap-days">
                                    <span>Mon</span>
                                    <span>Tue</span>
                                    <span>Wed</span>
                                    <span>Thu</span>
                                    <span>Fri</span>
                                    <span>Sat</span>
                                    <span>Sun</span>
                                </div>

                                <div className="heatmap-grid">
                                    {Array.from({ length: 98 }).map(
                                        (_, index) => (
                                            <span
                                                key={index}
                                                className={`heat-cell heat-${(
                                                    index * 7 +
                                                    index % 5
                                                ) % 7}`}
                                            />
                                        )
                                    )}

                                    <div className="heatmap-months">
                                        <span>Oct</span>
                                        <span>Nov</span>
                                        <span>Dec</span>
                                        <span>Jan</span>
                                        <span>Feb</span>
                                        <span>Mar</span>
                                        <span>Apr</span>
                                        <span>May</span>
                                        <span>Jun</span>
                                        <span>Jul</span>
                                        <span>Aug</span>
                                        <span>Sep</span>
                                    </div>
                                </div>
                            </div>

                            <div className="heatmap-footer">
                                <div>
                                    <span className="legend-loss" />
                                    Loss

                                    <span className="legend-empty" />
                                    <span className="legend-empty" />
                                    <span className="legend-profit-light" />
                                    <span className="legend-profit" />

                                    Profit
                                </div>

                                <div className="heatmap-scale">
                                    <span>-5K</span>
                                    <span>-2.5K</span>
                                    <span>0</span>
                                    <span>+2.5K</span>
                                    <span>+5K</span>
                                </div>
                            </div>
                        </div>

                    </section>
                </main>
            </section>
        </div>
    );
}

export default Analytics;