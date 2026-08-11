export default function Footer() {
  return (
    <footer
      style={{
        background: "#090909",
        color: "#fff",
        padding: "60px 20px 30px",
        borderTop: "1px solid rgba(212,175,55,.2)",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "30px",
        }}
      >
        <div>
          <h2
            style={{
              color: "#D4AF37",
              marginBottom: "10px",
            }}
          >
            🎵 Sua História Vira Canção
          </h2>

          <p
            style={{
              color: "#bbb",
              maxWidth: "400px",
              lineHeight: 1.7,
            }}
          >
            Transformamos histórias reais em músicas inesquecíveis para
            eternizar momentos especiais.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
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

          <a href="#pedido" style={link}>
            Fazer pedido
          </a>
        </div>
      </div>

      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,.08)",
          marginTop: "40px",
          paddingTop: "25px",
          textAlign: "center",
          color: "#888",
          fontSize: "14px",
        }}
      >
        © {new Date().getFullYear()} Sua História Vira Canção. Todos os direitos
        reservados.
      </div>
    </footer>
  );
}

const link = {
  color: "#ddd",
  textDecoration: "none",
  fontSize: "16px",
};