export default function ComoFunciona() {
  return (
    <section
      id="como"
      style={{
        background: "#111",
        color: "#fff",
        padding: "90px 20px",
        textAlign: "center",
      }}
    >
      <h2
        style={{
          color: "#D4AF37",
          fontSize: "42px",
          marginBottom: "15px",
        }}
      >
        Como funciona
      </h2>

      <p
        style={{
          maxWidth: "700px",
          margin: "0 auto 60px",
          fontSize: "20px",
          color: "#ccc",
        }}
      >
        Um processo simples, emocionante e totalmente personalizado.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
          gap: "30px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {[
          {
            numero: "1",
            titulo: "Conte sua história",
            texto:
              "Compartilhe todos os detalhes do momento que deseja transformar em música.",
          },
          {
            numero: "2",
            titulo: "Criamos a letra",
            texto:
              "Nossa equipe transforma sua história em uma composição emocionante.",
          },
          {
            numero: "3",
            titulo: "Produção profissional",
            texto:
              "Produzimos a música com voz, instrumentos e qualidade de estúdio.",
          },
          {
            numero: "4",
            titulo: "Receba sua canção",
            texto:
              "Você recebe uma música exclusiva para emocionar quem ama.",
          },
        ].map((item) => (
          <div
            key={item.numero}
            style={{
              background: "#1a1a1a",
              border: "1px solid rgba(212,175,55,.3)",
              borderRadius: "16px",
              padding: "35px",
            }}
          >
            <div
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                background: "#D4AF37",
                color: "#111",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontWeight: "bold",
                fontSize: "26px",
                margin: "0 auto 20px",
              }}
            >
              {item.numero}
            </div>

            <h3 style={{ color: "#D4AF37", marginBottom: "15px" }}>
              {item.titulo}
            </h3>

            <p style={{ color: "#ddd", lineHeight: 1.7 }}>
              {item.texto}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}