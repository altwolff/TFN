import '../styles.css'; 


export const metadata = {
  title: 'GameDex v2',
  description: 'Pokemon App',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
          integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.css"
        />
      </head>

      <body className="bg-light">
        <nav className="navbar navbar-light bg-light px-3 border-bottom">
          <h2 className="text-secondary mb-0 text-center w-100">
            GameDex v2 <i className="bi bi-book-fill"></i>
          </h2>
        </nav>

        <div className="container mt-4">
          <div className="progress mb-3" style={{ height: '25px' }}>
            <div id="progress-bar" className="progress-bar bg-danger" role="progressbar" style={{ width: '0%' }}>
              0%
            </div>
          </div>
        </div>

        {children}
      </body>
    </html>
  );
}
