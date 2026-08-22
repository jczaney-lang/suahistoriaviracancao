export default function Header() {
  return (
    <header
      style={{
        width: "100%",
        position: "sticky",
        top: 0,
        left: 0,
        padding: "14px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "rgba(0,0,0,0.75)",
        color: "#fff",
        zIndex: 1000,
        boxSizing: "border-box",
        flexWrap: "wrap",
        gap: "10px",
      }}
    >
      <h2
        style={{
          color: "#D4AF37",
          margin: 0,
          fontSize: "clamp(18px, 3vw, 24px)",
          whiteSpace: "nowrap",
        }}
      >
        🎵 Sua História Vira Canção
      </h2>

      <nav
        style={{
          display: "flex",
          gap: "20px",
          alignItems: "center",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <a href="#" style={link}>
          Início
        </a>

        <a href="#como" style={link}>
          Como funciona
        </a>

        <a href="#depoimentos" style={link}>
          Depoimentos
        </a>
      </nav>
    </header>
  );
}

const link = {
  color: "#fff",
  textDecoration: "none",
  fontWeight: "bold",
  fontSize: "15px",
};