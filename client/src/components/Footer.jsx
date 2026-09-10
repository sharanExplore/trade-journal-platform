function Footer() {
  return (
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
  )
}

export default Footer