
function Navbar({ onGetStarted, onLogin }) {
    return (
        <header className="navbar">
            <div className="container navbar-inner">
                <a href="/" className="logo">
                    <img src="/logo.png" alt="Tradefolio logo" className="logo-img" />
                    Tradefolio
                </a>

                <nav className="nav-links">
                    <a href="#features">Features</a>
                    <a href="#how-it-works">How It Works</a>
                    <a href="#about">About</a>
                </nav>

                <div className="navbar-actions">
                    <button type="button"
                        className="btn btn-ghost"
                        onClick={onLogin}
                    >
                        Login
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={onGetStarted}
                    >
                        Get Started
                    </button>
                </div>
            </div>
        </header>
    )
}
export default Navbar
