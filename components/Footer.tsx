export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="w-full border-t pt-6 mt-8">
      <div className="container">
        <div className="card text-center muted" style={{ boxShadow: 'none', background: 'transparent', padding: 0 }}>
          © {year} Pinext
        </div>
      </div>
    </footer>
  );
}
