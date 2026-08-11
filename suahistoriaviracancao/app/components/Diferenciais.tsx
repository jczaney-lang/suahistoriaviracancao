import {
  FaMusic,
  FaMicrophone,
  FaHeart,
  FaGift,
} from "react-icons/fa";

export default function Diferenciais() {
  const itens = [
    {
      icone: <FaMusic size={42} color="#D4AF37" />,
      titulo: "100% Personalizada",
      texto: "Cada música é criada exclusivamente a partir da sua história.",
    },
    {
      icone: <FaMicrophone size={42} color="#D4AF37" />,
      titulo: "Produção Profissional",
      texto: "Gravação com voz, instrumentos e qualidade de estúdio.",
    },
    {
      icone: <FaHeart size={42} color="#D4AF37" />,
      titulo: "Emoção Verdadeira",
      texto: "Um presente único para emocionar quem você ama.",
    },
    {
      icone: <FaGift size={42} color="#D4AF37" />,
      titulo: "Entrega Digital",
      texto: "Receba sua música pronta para ouvir e compartilhar.",
    },
  ];

  return (
    <section
      style={{
        background: "#111",
        color: "#fff",
        padding: "100px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            color: "#D4AF37",
            fontSize: "42px",
            marginBottom: "20px",
          }}
        >
          Por que escolher a Sua História Vira Canção?
        </h2>

        <p
          style={{
            color: "#ccc",
            maxWidth: "700px",
            margin: "0 auto 60px",
            fontSize: "20px",
          }}
        >
          Criamos músicas únicas para transformar histórias reais em emoções que
          ficam para sempre.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "30px",
          }}
        >
          {itens.map((item) => (
            <div
              key={item.titulo}
              style={{
                background: "#1a1a1a",
                border: "1px solid rgba(212,175,55,.3)",
                borderRadius: "18px",
                padding: "30px",
              }}
            >
              <div style={{ marginBottom: "20px" }}>
                {item.icone}
              </div>

              <h3
                style={{
                  color: "#D4AF37",
                  marginBottom: "15px",
                }}
              >
                {item.titulo}
              </h3>

              <p
                style={{
                  color: "#ddd",
                  lineHeight: 1.7,
                }}
              >
                {item.texto}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}