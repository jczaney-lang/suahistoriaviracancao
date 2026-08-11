export default function Header() {
  return (
    <header
      style={{
        width: "100%",
        position: "fixed",
        top: 0,
        left: 0,
        padding: "20px 50px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "rgba(0,0,0,0.6)",
        color: "#fff",
        zIndex: 1000,
      }}
    >
      <h2 style={{ color: "#D4AF37", margin: 0 }}>
        🎵 Sua História Vira Canção
      </h2>

      <nav style={{ display: "flex", gap: "20px" }}>
        <a href="#" style={link}>Início</a>
        <a href="#como" style={link}>Como funciona</a>
        <a href="#depoimentos" style={link}>Depoimentos</a>
      </nav>
    </header>
  );
}

const link = {
  color: "#fff",
  textDecoration: "none",
  fontWeight: "bold",
};