export default function Hero() {
  return (
    <section
      style={{
        position: "relative",
        height: "100vh",
        backgroundImage: "url('/images/hero.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Camada escura */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.65)",
        }}
      />

      {/* Conteúdo */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "900px",
          textAlign: "center",
          color: "#fff",
          padding: "0 20px",
        }}
      >
        <h1
          style={{
            fontSize: "3.5rem",
            fontWeight: "bold",
            marginBottom: "20px",
            lineHeight: 1.2,
          }}
        >
          Transformamos histórias em músicas inesquecíveis.
        </h1>

        <p
          style={{
            fontSize: "1.3rem",
            color: "#ddd",
            marginBottom: "30px",
            lineHeight: 1.7,
          }}
        >
          Canções personalizadas para eternizar momentos,
          celebrar o amor e emocionar quem você ama.
        </p>

        {/* PREÇO */}
        <div
          style={{
            display: "inline-block",
            background: "#d4af37",
            color: "#111",
            padding: "16px 36px",
            borderRadius: "12px",
            marginBottom: "30px",
            boxShadow: "0 10px 25px rgba(212,175,55,.35)",
          }}
        >
          <div
            style={{
              fontSize: "1rem",
              fontWeight: 600,
              letterSpacing: "1px",
            }}
          >
            SUA MÚSICA PERSONALIZADA
          </div>

          <div
            style={{
              fontSize: "3rem",
              fontWeight: "bold",
              lineHeight: 1.1,
            }}
          >
            R$ 29,90
          </div>
        </div>

        <div
          style={{
            marginBottom: "35px",
            fontSize: "1.05rem",
            lineHeight: "2",
            color: "#f2f2f2",
          }}
        >
          ✔️ Letra exclusiva<br />
          ✔️ Produção profissional<br />
          ✔️ Entrega digital
        </div>

        <a
          href="#pedido"
          style={{
            display: "inline-block",
            background: "#d4af37",
            color: "#111",
            padding: "18px 42px",
            borderRadius: "8px",
            textDecoration: "none",
            fontSize: "1.15rem",
            fontWeight: "bold",
            transition: "0.3s",
          }}
        >
          Quero transformar minha história em música
        </a>
      </div>
    </section>
  );
}