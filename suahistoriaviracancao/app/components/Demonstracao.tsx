export default function Demonstracao() {
  const players = [
    {
      titulo: "💍 29 Anos de Nós",
      descricao:
        "Uma história de amor e companheirismo que atravessou 29 anos.",
      arquivo: "/29-anos-de-nos.mpeg",
    },
    {
      titulo: "❤️ Minha Preta, Minha Vida",
      descricao:
        "Uma homenagem especial de aniversário para a mulher amada.",
      arquivo: "/minha-preta-minha-vida.mpeg",
    },
    {
      titulo: "🤝 Amigo Saulo",
      descricao:
        "Uma amizade antiga que o tempo e a distância não conseguiram apagar.",
      arquivo: "/amigo-Saulo.mpeg",
    },
    {
      titulo: "🎂 Dani",
      descricao:
        "Uma história especial transformada em uma canção feita para emocionar.",
      arquivo: "/Dani.mpeg",
    },
  ];

  return (
    <section
      style={{
        padding: "100px 20px",
        backgroundColor: "#0b0b0b",
        color: "#fff",
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
        Ouça algumas histórias que viraram canção
      </h2>

      <p
        style={{
          maxWidth: "700px",
          margin: "0 auto 50px",
          color: "#ccc",
          fontSize: "20px",
        }}
      >
        Cada música nasceu de uma história e ganhou uma melodia única.
      </p>

      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "30px",
        }}
      >
        {players.map((player, index) => (
          <div
            key={index}
            style={{
              background: "#161616",
              border: "1px solid rgba(212,175,55,.3)",
              borderRadius: "18px",
              padding: "25px",
              boxShadow: "0 10px 30px rgba(0,0,0,.35)",
            }}
          >
            <h3
              style={{
                color: "#D4AF37",
                marginBottom: "10px",
                fontSize: "22px",
              }}
            >
              {player.titulo}
            </h3>

            <p
              style={{
                color: "#aaa",
                marginBottom: "18px",
                fontSize: "15px",
              }}
            >
              {player.descricao}
            </p>

            <audio controls style={{ width: "100%" }}>
              <source
                src={player.arquivo}
                type="audio/mpeg"
              />
              Seu navegador não suporta áudio.
            </audio>
          </div>
        ))}
      </div>
    </section>
  );
}