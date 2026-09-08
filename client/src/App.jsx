import './App.css'

function App() {
  return (
    <>
      {/* NAVBAR */}
      <header className="navbar">
        <div className="container navbar-inner">
          <span className="logo">
            <img src="/logo.png" alt="Tradefolio logo" className="logo-img" />
            Tradefolio
          </span>

          <nav className="nav-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#about">About</a>
          </nav>

          <div className="navbar-actions">
            <button type="button" className="btn btn-ghost">Login</button>
            <button type="button" className="btn btn-primary">Get Started</button>
          </div>
        </div>
      </header>

      <main>
        {/* HERO */}
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

        {/* TRUST / VALUE STRIP */}
        <section className="value-strip">
          <div className="container value-strip-inner">
            <span className="value-strip-heading">
              Built for Traders &amp; Investors
            </span>
            <div className="value-items">
              <span>Track trades</span>
              <span>Analyze performance</span>
              <span>Learn from mistakes</span>
              <span>Improve consistency</span>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="features">
          <div className="container">
            <h2 className="section-heading">Everything you need to grow</h2>

            <div className="feature-grid">
              <div className="feature-card">
                <div className="feature-icon">📓</div>
                <h3>Trade Journal</h3>
                <p>
                  Record every trade with entry, exit, strategy, notes and
                  screenshots.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">📊</div>
                <h3>Performance Analytics</h3>
                <p>
                  Understand your P&amp;L, win rate, risk/reward and trading
                  patterns.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">🧠</div>
                <h3>Trading Insights</h3>
                <p>
                  Identify mistakes, strengths and patterns in your trading
                  behavior.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">💼</div>
                <h3>Investor Tracking</h3>
                <p>
                  Keep your long-term investments organized alongside your
                  trades.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="how-it-works">
          <div className="container">
            <h2 className="section-heading">How It Works</h2>

            <div className="steps">
              <div className="step">
                <span className="step-number">01</span>
                <h3>Record</h3>
                <p>Log your trade or investment.</p>
              </div>

              <div className="step">
                <span className="step-number">02</span>
                <h3>Analyze</h3>
                <p>Review your performance and patterns.</p>
              </div>

              <div className="step">
                <span className="step-number">03</span>
                <h3>Improve</h3>
                <p>Use your insights to make better decisions.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="final-cta">
          <div className="container">
            <h2>Turn Your Trades Into Better Decisions.</h2>
            <p>
              Start building a journal that helps you become a more
              disciplined trader.
            </p>
            <button type="button" className="btn btn-primary btn-lg">
              Start Journaling
            </button>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer id="about" className="footer">
        <div className="container footer-inner">
          <div className="footer-brand">
            <span className="logo">
              <img src="/logo.png" alt="Tradefolio logo" className="logo-img" />
              Tradefolio
            </span>
            <p>
              A personal trading and investment journal built to help you
              trade with discipline.
            </p>
          </div>

          <div className="footer-links">
            <a href="#features">Features</a>
            <a href="#about">About</a>
            <a href="#">Login</a>
          </div>
        </div>

        <p className="footer-copyright">
          &copy; {new Date().getFullYear()} Tradefolio. All rights reserved.
        </p>
      </footer>
    </>
  )
}

export default App