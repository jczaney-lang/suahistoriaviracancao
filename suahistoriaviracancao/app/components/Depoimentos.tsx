export default function Depoimentos() {
  const depoimentos = [
    {
      nome: "Carlos",
      texto:
        "Minha esposa chorou quando ouviu a música. Foi o presente mais especial que já dei.",
    },
    {
      nome: "Juliana",
      texto:
        "Ficou linda! Parece que a música foi escrita exatamente para nossa história.",
    },
    {
      nome: "Mariana",
      texto:
        "Nunca imaginei que uma canção pudesse transmitir tantos sentimentos. Foi emocionante.",
    },
    {
      nome: "Roberto",
      texto:
        "Atendimento excelente e uma música que marcou nossa família para sempre.",
    },
    {
      nome: "Fernanda",
      texto:
        "Foi o presente perfeito. Todos se emocionaram quando a música começou a tocar.",
    },
    {
      nome: "Eduardo",
      texto:
        "Superou todas as expectativas. Valeu cada centavo e faria novamente.",
    },
  ];

  return (
    <section
      id="depoimentos"
      style={{
        padding: "100px 20px",
        background: "#111",
        color: "#fff",
        textAlign: "center",
      }}
    >
      <h2
        style={{
          color: "#D4AF37",
          fontSize: "46px",
          marginBottom: "20px",
        }}
      >
        Quem viveu essa experiência, recomenda.
      </h2>

      <p
        style={{
          color: "#ccc",
          maxWidth: "700px",
          margin: "0 auto 50px",
          fontSize: "20px",
        }}
      >
        Cada música é criada para emocionar. Veja o que alguns clientes disseram
        depois de receber sua canção personalizada.
      </p>

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "25px",
        }}
      >
        {depoimentos.map((item, index) => (
          <div
            key={index}
            style={{
              background: "#1b1b1b",
              padding: "30px",
              borderRadius: "18px",
              border: "1px solid rgba(212,175,55,.25)",
              boxShadow: "0 10px 25px rgba(0,0,0,.3)",
            }}
          >
            <div
              style={{
                color: "#FFD700",
                fontSize: "22px",
                marginBottom: "15px",
              }}
            >
              ⭐⭐⭐⭐⭐
            </div>

            <p
              style={{
                color: "#eee",
                lineHeight: "1.7",
                fontStyle: "italic",
              }}
            >
              "{item.texto}"
            </p>

            <h4
              style={{
                marginTop: "20px",
                color: "#D4AF37",
              }}
            >
              — {item.nome}
            </h4>
          </div>
        ))}
      </div>
    </section>
  );
}