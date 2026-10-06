import { useEffect, useMemo, useState } from "react";
import "../styles/analytics/Analytics.css";

const API_URL = "http://localhost:5000/api/trades/analytics";

const RANGES = ["1W", "1M", "3M", "6M", "1Y", "Custom"];

const TABS = [
    "Overview",
    "By Symbol",
    "By Setup",
    "By Time",
    "By Day",
    "Risk Analysis",
    "Advanced",
];

const HEAT_METRICS = ["P&L", "Trades", "Win Rate"];

const MONTHS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];

const DAYS = [
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun",
];

const NAV = [
    { label: "Dashboard", icon: "home", page: "dashboard" },
    { label: "Trades", icon: "trades", page: "trades" },
    { label: "Analytics", icon: "analytics", active: true },
    { label: "Calendar", icon: "calendar" },
    { label: "Watchlist", icon: "watchlist" },
    { label: "Journal", icon: "journal" },
    { label: "Goals", icon: "goals" },
    { label: "Settings", icon: "settings" },
];

/* ---------- icons ---------- */

const ICONS = {
    home: (
        <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
    ),

    trades: (
        <path d="M4 7h12M13 4l3 3-3 3M20 17H8M11 14l-3 3 3 3" />
    ),

    analytics: (
        <path
            d="M6 20V11M12 20V4M18 20v-6"
            strokeWidth="3.2"
        />
    ),

    calendar: (
        <>
            <rect
                x="3"
                y="5"
                width="18"
                height="16"
                rx="2"
            />
            <path d="M3 10h18M8 3v4M16 3v4" />
        </>
    ),

    watchlist: (
        <path d="M12 3l9 9-9 9-9-9z" />
    ),

    journal: (
        <path d="M6 3h9l4 4v14H6zM9 12h7M9 16h7M9 8h3" />
    ),

    goals: (
        <>
            <circle cx="12" cy="12" r="9" />
            <path d="m8 12 3 3 5-6" />
        </>
    ),

    settings: (
        <>
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9 7 7M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1" />
        </>
    ),

    search: (
        <>
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
        </>
    ),

    bell: (
        <path d="M6 17v-6a6 6 0 0 1 12 0v6l2 2H4zM10 21h4" />
    ),

    down: (
        <path d="m6 9 6 6 6-6" />
    ),

    left: (
        <path d="m15 6-6 6 6 6" />
    ),

    right: (
        <path d="m9 6 6 6-6 6" />
    ),

    info: (
        <>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 11v5M12 8h.01" />
        </>
    ),

    trend: (
        <path d="M3 17l5-5 4 4 8-9M14 7h6v6" />
    ),

    target: (
        <>
            <circle cx="12" cy="12" r="8" />
            <circle cx="12" cy="12" r="3" />
        </>
    ),

    wave: (
        <path d="M3 13c2 0 2-5 4.5-5S10 16 12.5 16 15 8 17.5 8 19 13 21 13" />
    ),
};

function Icon({ name, size = 20 }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            {ICONS[name]}
        </svg>
    );
}

/* ---------- helpers ---------- */

const num = (v) => Number(v ?? 0);

const fmt = (v, d = 2) =>
    num(v).toLocaleString("en-US", {
        minimumFractionDigits: d,
        maximumFractionDigits: d,
    });

const signed = (v, d = 2) =>
    `${num(v) >= 0 ? "+" : "-"}${fmt(Math.abs(num(v)), d)}`;

const compact = (v) => {
    const a = Math.abs(v);

    const s =
        a >= 1000
            ? `${+(a / 1000).toFixed(1)}K`
            : `${+a.toFixed(0)}`;

    return v < 0 ? `-${s}` : s;
};

const niceStep = (raw) => {
    if (raw <= 0) return 1;

    const p = Math.pow(10, Math.floor(Math.log10(raw)));
    const n = raw / p;

    return (
        (n <= 1
            ? 1
            : n <= 2
                ? 2
                : n <= 5
                    ? 5
                    : 10) * p
    );
};

const shortDate = (iso) => {
    const d = new Date(iso);

    return Number.isNaN(d.getTime())
        ? ""
        : `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}`;
};

function getUser() {
    try {
        const u = JSON.parse(
            localStorage.getItem("user") || "null"
        );

        return u?.name || "Sharan Kumar";
    } catch {
        return "Sharan Kumar";
    }
}

function heatClass(d, metric) {
    if (!d) return "heat-empty";

    let positive = true;
    let ratio = 0;

    if (metric === "P&L") {
        const v = num(d.pnl);

        if (!v) return "heat-empty";

        positive = v > 0;
        ratio = Math.min(Math.abs(v) / 5000, 1);
    } else if (metric === "Trades") {
        const t = num(d.trades);

        if (!t) return "heat-empty";

        ratio = Math.min(t / 10, 1);
    } else {
        if (d.winRate == null) return "heat-empty";

        positive = num(d.winRate) >= 50;

        ratio = Math.min(
            Math.abs(num(d.winRate) - 50) / 50 + 0.2,
            1
        );
    }

    const lvl =
        ratio > 0.66
            ? 3
            : ratio > 0.33
                ? 2
                : 1;

    return positive
        ? `heat-p${lvl}`
        : `heat-l${lvl}`;
}

function heatTitle(d, date, metric) {
    if (!d) return date;

    if (metric === "Trades") {
        return `${date}: ${num(d.trades)} trades`;
    }

    if (metric === "Win Rate") {
        return `${date}: ${d.winRate == null
            ? "-"
            : `${num(d.winRate).toFixed(0)}%`
            }`;
    }

    return `${date}: ${signed(d.pnl)}`;
}

/* ---------- small pieces ---------- */

function CardTitle({ children }) {
    return (
        <div className="card-title">
            <h2>{children}</h2>
            <Icon name="info" size={16} />
        </div>
    );
}

function Delta({ value, fallback }) {
    if (value == null) {
        return (
            <span className="kpi-delta muted">
                {fallback}
            </span>
        );
    }

    const up = num(value) >= 0;

    return (
        <span className="kpi-delta">
            <b className={up ? "up" : "down"}>
                {up ? "↑" : "↓"}{" "}
                {fmt(Math.abs(num(value)), 1)}
            </b>{" "}
            vs previous month
        </span>
    );
}

function Analytics({ onNavigate }) {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [range, setRange] = useState("1M");
    const [tab, setTab] = useState("Overview");

    const [heatMetric, setHeatMetric] = useState("P&L");
    const [heatYear, setHeatYear] = useState(
        new Date().getFullYear()
    );

    useEffect(() => {
        const token = localStorage.getItem("token");

        setLoading(true);
        setError("");

        fetch(`${API_URL}?range=${range}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(
                        "Failed to fetch analytics"
                    );
                }

                return response.json();
            })
            .then((data) => {
                setAnalytics(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(
                    "Analytics error:",
                    err
                );

                setError("Unable to load analytics");
                setLoading(false);
            });
    }, [range]);

    const summary = analytics?.summary;

    const symbols = analytics?.symbols || [];

    const strategies =
        analytics?.strategies || [];

    /*
        These are provided by the backend.
        cumulative:
        [{ date, value }]

        daily:
        [{ date, pnl, trades, winRate }]
    */
    const cumulative =
        analytics?.cumulative || [];

    const daily =
        analytics?.daily || [];

    const userName = getUser();

    const initials = userName
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    const maxSymbolPnL = Math.max(
        ...symbols.map((s) =>
            Math.abs(s.pnl)
        ),
        1
    );

    const maxStrategyWinRate = Math.max(
        ...strategies.map(
            (s) => s.winRate
        ),
        1
    );

    const val = (v) =>
        loading ? "Loading..." : v;

    /* ---------- cumulative chart ---------- */

    const chart = useMemo(() => {
        const values = cumulative.map(
            (p) => num(p.value)
        );

        if (values.length < 2) {
            return null;
        }

        const min = Math.min(...values, 0);
        const max = Math.max(...values, 0);

        const step = niceStep(
            (max - min) / 3 || 1
        );

        const top =
            Math.ceil(max / step) * step ||
            step;

        const bottom =
            Math.floor(min / step) * step;

        const span = top - bottom || 1;

        const ticks = [];

        for (
            let t = top;
            t >= bottom - 1e-9;
            t -= step
        ) {
            ticks.push(t);
        }

        const pts = values.map((v, i) => [
            (i /
                (values.length - 1)) *
            600,
            ((top - v) / span) * 190,
        ]);

        const line = pts
            .map(
                ([x, y], i) =>
                    `${i ? "L" : "M"}${x.toFixed(
                        1
                    )} ${y.toFixed(1)}`
            )
            .join(" ");

        const area =
            `${line} L600 190 L0 190 Z`;

        const labelCount = Math.min(
            5,
            cumulative.length
        );

        const dates = Array.from(
            { length: labelCount },
            (_, i) => {
                const idx = Math.round(
                    (i /
                        Math.max(
                            labelCount - 1,
                            1
                        )) *
                    (cumulative.length - 1)
                );

                return shortDate(
                    cumulative[idx].date
                );
            }
        );

        return {
            ticks: ticks.map((t) => ({
                label: compact(t),
                pos:
                    ((top - t) / span) *
                    100,
            })),

            line,
            area,
            dates,

            lastY:
                (pts[pts.length - 1][1] /
                    190) *
                100,

            lastDate: shortDate(
                cumulative[
                    cumulative.length - 1
                ].date
            ),

            lastValue:
                values[values.length - 1],
        };
    }, [cumulative]);

    /* ---------- heatmap ---------- */

    const heat = useMemo(() => {
        const map = new Map(
            daily.map((d) => [
                String(d.date).slice(
                    0,
                    10
                ),
                d,
            ])
        );

        const cells = [];
        const parts = [];
        const monthCols = [];

        let col = 1;

        MONTHS.forEach((label, m) => {
            const first = Date.UTC(
                heatYear,
                m,
                1
            );

            const days =
                (Date.UTC(
                    heatYear,
                    m + 1,
                    1
                ) -
                    first) /
                86400000;

            const offset =
                (new Date(first).getUTCDay() +
                    6) %
                7;

            const weeks = Math.ceil(
                (offset + days) / 7
            );

            for (
                let i = 0;
                i < weeks * 7;
                i++
            ) {
                const dayIndex =
                    i - offset;

                if (
                    dayIndex < 0 ||
                    dayIndex >= days
                ) {
                    cells.push(null);
                    continue;
                }

                const date = new Date(
                    first +
                    dayIndex *
                    86400000
                )
                    .toISOString()
                    .slice(0, 10);

                cells.push({
                    date,
                    data: map.get(date),
                });
            }

            parts.push(
                `repeat(${weeks}, minmax(0, 1fr))`
            );

            monthCols.push({
                label,
                col,
                span: weeks,
            });

            col += weeks;

            if (m < 11) {
                parts.push("16px");

                for (
                    let i = 0;
                    i < 7;
                    i++
                ) {
                    cells.push(null);
                }

                col += 1;
            }
        });

        return {
            cells,
            monthCols,
            template: parts.join(" "),
        };
    }, [daily, heatYear]);

    return (
        <div className="analytics">

            {/* Sidebar */}

            <aside className="analytics-sidebar">
                <div className="analytics-logo">
                    <svg
                        width="32"
                        height="32"
                        viewBox="0 0 32 32"
                    >
                        <rect
                            x="3"
                            y="14"
                            width="6"
                            height="14"
                            rx="1.5"
                            fill="#12d6a0"
                        />

                        <rect
                            x="13"
                            y="5"
                            width="6"
                            height="23"
                            rx="1.5"
                            fill="#12d6a0"
                        />

                        <rect
                            x="23"
                            y="10"
                            width="6"
                            height="18"
                            rx="1.5"
                            fill="#12d6a0"
                        />
                    </svg>

                    <span>TradeFolio</span>
                </div>

                <nav className="analytics-nav">
                    {NAV.map((item) => (
                        <div
                            key={item.label}
                            className={`analytics-nav-item${item.active
                                ? " active"
                                : ""
                                }`}
                            onClick={() =>
                                item.page &&
                                onNavigate?.(
                                    item.page
                                )
                            }
                        >
                            <Icon
                                name={item.icon}
                                size={22}
                            />

                            {item.label}
                        </div>
                    ))}
                </nav>
            </aside>

            {/* Main */}

            <section className="analytics-content">

                {/* Header */}

                <header className="analytics-header">
                    <div className="analytics-search">
                        <Icon
                            name="search"
                            size={20}
                        />

                        <input
                            type="text"
                            placeholder="Search trades, notes, symbols..."
                        />

                        <kbd>
                            Ctrl + K
                        </kbd>
                    </div>

                    <div className="analytics-header-right">
                        <button
                            className="analytics-bell"
                            aria-label="Notifications"
                        >
                            <Icon
                                name="bell"
                                size={22}
                            />

                            <i />
                        </button>

                        <div className="analytics-user">
                            <div className="analytics-avatar">
                                {initials}
                            </div>

                            <span>
                                {userName}
                            </span>

                            <Icon
                                name="down"
                                size={16}
                            />
                        </div>
                    </div>
                </header>

                <main className="analytics-main">

                    {/* Page Header */}

                    <header className="analytics-page-header">
                        <div>
                            <h1>
                                Analytics
                            </h1>

                            <p>
                                Deep insights into
                                your trading
                                performance.
                            </p>
                        </div>

                        <div className="analytics-time-range">
                            {RANGES.map((r) => (
                                <button
                                    key={r}
                                    className={
                                        range === r
                                            ? "active"
                                            : ""
                                    }
                                    onClick={() =>
                                        setRange(r)
                                    }
                                >
                                    {r}
                                </button>
                            ))}

                            <button
                                className="analytics-calendar-button"
                                aria-label="Pick dates"
                            >
                                <Icon
                                    name="calendar"
                                    size={18}
                                />
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

                        {/* Total P&L */}

                        <div className="analytics-card analytics-kpi-card">
                            <div className="analytics-kpi-icon green">
                                <Icon
                                    name="trend"
                                    size={26}
                                />
                            </div>

                            <div className="analytics-kpi-content">
                                <p>
                                    Total P&amp;L
                                </p>

                                <h2>
                                    {val(
                                        signed(
                                            summary?.totalPnL
                                        )
                                    )}
                                </h2>

                                <Delta
                                    value={
                                        summary?.totalPnLChange
                                    }
                                    fallback="Total closed trade P&L"
                                />
                            </div>

                            <svg
                                className="kpi-spark"
                                viewBox="0 0 80 36"
                                fill="none"
                            >
                                <path
                                    d="M2 30 C10 28 14 20 22 22 S34 12 42 16 S56 6 66 10 S76 4 78 3"
                                    stroke="#12d6a0"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </div>

                        {/* Win Rate */}

                        <div className="analytics-card analytics-kpi-card">
                            <div className="analytics-kpi-icon purple">
                                <Icon
                                    name="target"
                                    size={26}
                                />
                            </div>

                            <div className="analytics-kpi-content">
                                <p>
                                    Win Rate
                                </p>

                                <h2>
                                    {val(
                                        `${+num(
                                            summary?.winRate
                                        ).toFixed(
                                            1
                                        )}%`
                                    )}
                                </h2>

                                <Delta
                                    value={
                                        summary?.winRateChange
                                    }
                                    fallback="Winning trades"
                                />
                            </div>

                            <div
                                className="kpi-ring"
                                style={{
                                    "--p": Math.min(
                                        num(
                                            summary?.winRate
                                        ),
                                        100
                                    ),
                                }}
                            />
                        </div>

                        {/* Profit Factor */}

                        <div className="analytics-card analytics-kpi-card">
                            <div className="analytics-kpi-icon blue">
                                <Icon
                                    name="analytics"
                                    size={24}
                                />
                            </div>

                            <div className="analytics-kpi-content">
                                <p>
                                    Profit Factor
                                </p>

                                <h2>
                                    {val(
                                        summary?.profitFactor ===
                                            Infinity
                                            ? "∞"
                                            : +num(
                                                summary?.profitFactor
                                            ).toFixed(2)
                                    )}
                                </h2>

                                <Delta
                                    value={
                                        summary?.profitFactorChange
                                    }
                                    fallback="Gross profit ÷ gross loss"
                                />
                            </div>

                            <div className="kpi-bars">
                                <span />
                                <span />
                                <span />
                                <span />
                            </div>
                        </div>

                        {/* Expectancy */}

                        <div className="analytics-card analytics-kpi-card">
                            <div className="analytics-kpi-icon purple">
                                <Icon
                                    name="wave"
                                    size={26}
                                />
                            </div>

                            <div className="analytics-kpi-content">
                                <p>
                                    Expectancy
                                </p>

                                <h2>
                                    {val(
                                        signed(
                                            summary?.expectancy
                                        )
                                    )}
                                </h2>

                                <Delta
                                    value={
                                        summary?.expectancyChange
                                    }
                                    fallback="Average P&L per trade"
                                />
                            </div>

                            <svg
                                className="kpi-spark"
                                viewBox="0 0 80 36"
                                fill="none"
                            >
                                <path
                                    d="M2 30 C14 30 18 24 28 24 S40 28 50 20 S66 6 78 4"
                                    stroke="#12d6a0"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </div>

                    </section>

                    {/* Tabs */}

                    <nav className="analytics-tabs">
                        {TABS.map((t) => (
                            <button
                                key={t}
                                className={
                                    tab === t
                                        ? "active"
                                        : ""
                                }
                                onClick={() =>
                                    setTab(t)
                                }
                            >
                                {t}
                            </button>
                        ))}
                    </nav>

                    {/* Analytics Grid */}

                    <section className="analytics-grid">

                        {/* Cumulative P&L */}

                        <div className="analytics-card cumulative-card">

                            <div className="analytics-card-header">
                                <CardTitle>
                                    Cumulative P&amp;L
                                </CardTitle>

                                <button className="analytics-select">
                                    {range}

                                    <Icon
                                        name="down"
                                        size={14}
                                    />
                                </button>
                            </div>

                            <div className="cumulative-chart">

                                <div className="chart-y-axis">
                                    {(chart?.ticks || []).map(
                                        (t) => (
                                            <span
                                                key={t.pos}
                                                style={{
                                                    top: `${t.pos}%`,
                                                }}
                                            >
                                                {t.label}
                                            </span>
                                        )
                                    )}
                                </div>

                                <div className="chart-area">

                                    <div className="chart-plot">

                                        {(chart?.ticks || []).map(
                                            (t) => (
                                                <div
                                                    key={t.pos}
                                                    className="chart-grid-line"
                                                    style={{
                                                        top: `${t.pos}%`,
                                                    }}
                                                />
                                            )
                                        )}

                                        {chart ? (
                                            <>
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
                                                                stopColor="#12d6a0"
                                                                stopOpacity="0.35"
                                                            />

                                                            <stop
                                                                offset="100%"
                                                                stopColor="#12d6a0"
                                                                stopOpacity="0"
                                                            />
                                                        </linearGradient>
                                                    </defs>

                                                    <path
                                                        className="pnl-area"
                                                        d={
                                                            chart.area
                                                        }
                                                    />

                                                    <path
                                                        className="pnl-line"
                                                        d={
                                                            chart.line
                                                        }
                                                    />
                                                </svg>

                                                <i
                                                    className="chart-dot"
                                                    style={{
                                                        top: `${chart.lastY}%`,
                                                    }}
                                                />

                                                <div className="chart-tooltip">
                                                    <strong>
                                                        {
                                                            chart.lastDate
                                                        }
                                                    </strong>

                                                    <b>
                                                        {signed(
                                                            chart.lastValue
                                                        )}
                                                    </b>
                                                </div>
                                            </>
                                        ) : (
                                            <p className="analytics-empty chart-empty">
                                                {loading
                                                    ? "Loading..."
                                                    : "No cumulative data yet"}
                                            </p>
                                        )}
                                    </div>

                                    <div className="chart-dates">
                                        {(chart?.dates || []).map(
                                            (d, i) => (
                                                <span key={i}>
                                                    {d}
                                                </span>
                                            )
                                        )}
                                    </div>

                                </div>
                            </div>
                        </div>

                        {/* Win Rate by Setup */}

                        <div className="analytics-card setup-card">

                            <div className="analytics-card-header">
                                <CardTitle>
                                    Win Rate by Setup
                                </CardTitle>
                            </div>

                            <div className="analytics-bars">

                                {strategies.length > 0 ? (
                                    strategies
                                        .slice(0, 5)
                                        .map((s) => (
                                            <div
                                                className="analytics-bar-row"
                                                key={
                                                    s.strategy
                                                }
                                            >
                                                <span>
                                                    {s.strategy}
                                                </span>

                                                <div className="analytics-bar-track">
                                                    <i
                                                        className={
                                                            s.winRate <
                                                                50
                                                                ? "loss"
                                                                : ""
                                                        }
                                                        style={{
                                                            width: `${(
                                                                s.winRate /
                                                                maxStrategyWinRate
                                                            ) * 100
                                                                }%`,
                                                        }}
                                                    />
                                                </div>

                                                <b>
                                                    {s.winRate.toFixed(
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
                                <CardTitle>
                                    Profit/Loss by Symbol
                                </CardTitle>
                            </div>

                            <div className="analytics-bars">

                                {symbols.length > 0 ? (
                                    symbols
                                        .slice(0, 5)
                                        .map((item) => (
                                            <div
                                                className="analytics-bar-row"
                                                key={
                                                    item.symbol
                                                }
                                            >
                                                <span>
                                                    {item.symbol}
                                                </span>

                                                <div className="analytics-bar-track">
                                                    <i
                                                        className={
                                                            item.pnl <
                                                                0
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
                                                        item.pnl <
                                                            0
                                                            ? "loss-text"
                                                            : ""
                                                    }
                                                >
                                                    {item.pnl >=
                                                        0
                                                        ? "+"
                                                        : "-"}

                                                    {fmt(
                                                        Math.abs(
                                                            item.pnl
                                                        ),
                                                        0
                                                    )}
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

                                <CardTitle>
                                    P&amp;L Heatmap
                                </CardTitle>

                                <div className="heatmap-right">

                                    <div className="heatmap-controls">

                                        <button
                                            onClick={() =>
                                                setHeatYear(
                                                    (y) =>
                                                        y - 1
                                                )
                                            }
                                            aria-label="Previous year"
                                        >
                                            <Icon
                                                name="left"
                                                size={16}
                                            />
                                        </button>

                                        <strong>
                                            {heatYear}
                                        </strong>

                                        <button
                                            onClick={() =>
                                                setHeatYear(
                                                    (y) =>
                                                        y + 1
                                                )
                                            }
                                            aria-label="Next year"
                                        >
                                            <Icon
                                                name="right"
                                                size={16}
                                            />
                                        </button>

                                    </div>

                                    <div className="heatmap-toggle">

                                        {HEAT_METRICS.map(
                                            (m) => (
                                                <button
                                                    key={m}
                                                    className={
                                                        heatMetric ===
                                                            m
                                                            ? "active"
                                                            : ""
                                                    }
                                                    onClick={() =>
                                                        setHeatMetric(
                                                            m
                                                        )
                                                    }
                                                >
                                                    {m}
                                                </button>
                                            )
                                        )}

                                    </div>

                                </div>
                            </div>

                            <div className="heatmap-body">

                                <div className="heatmap-days">
                                    {DAYS.map((d) => (
                                        <span key={d}>
                                            {d}
                                        </span>
                                    ))}
                                </div>

                                <div
                                    className="heatmap-grid"
                                    style={{
                                        gridTemplateColumns:
                                            heat.template,
                                    }}
                                >
                                    {heat.cells.map(
                                        (c, i) =>
                                            c ? (
                                                <span
                                                    key={i}
                                                    className={`heat-cell ${heatClass(
                                                        c.data,
                                                        heatMetric
                                                    )}`}
                                                    title={heatTitle(
                                                        c.data,
                                                        c.date,
                                                        heatMetric
                                                    )}
                                                />
                                            ) : (
                                                <span
                                                    key={i}
                                                    className="heat-cell heat-none"
                                                />
                                            )
                                    )}
                                </div>

                                <div
                                    className="heatmap-months"
                                    style={{
                                        gridTemplateColumns:
                                            heat.template,
                                    }}
                                >
                                    {heat.monthCols.map(
                                        (m) => (
                                            <span
                                                key={
                                                    m.label
                                                }
                                                style={{
                                                    gridColumn: `${m.col} / span ${m.span}`,
                                                }}
                                            >
                                                {m.label}
                                            </span>
                                        )
                                    )}
                                </div>

                            </div>

                            <div className="heatmap-footer">

                                <div className="heatmap-legend">

                                    <span className="legend-box heat-l3" />

                                    Loss

                                    <span className="legend-box heat-empty" />

                                    <span className="legend-box heat-empty" />

                                    <span className="legend-box heat-empty" />

                                    <span className="legend-box heat-p1" />

                                    <span className="legend-box heat-p2" />

                                    <span className="legend-box heat-p3" />

                                    Profit

                                </div>

                                <div className="heatmap-scale">

                                    <div className="heatmap-scale-bar" />

                                    <div className="heatmap-scale-labels">
                                        <span>
                                            -5K
                                        </span>

                                        <span>
                                            -2.5K
                                        </span>

                                        <span>
                                            0
                                        </span>

                                        <span>
                                            +2.5K
                                        </span>

                                        <span>
                                            +5K
                                        </span>
                                    </div>

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