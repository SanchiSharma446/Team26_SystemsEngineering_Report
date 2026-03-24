function Footer() {
  const year = new Date().getFullYear();
  
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <p>&copy; {year} Team 26 Systems Engineering Report. All Rights Reserved.</p>
        <p>Built with React & Vite.</p>
      </div>
    </footer>
  )
}

export default Footer
