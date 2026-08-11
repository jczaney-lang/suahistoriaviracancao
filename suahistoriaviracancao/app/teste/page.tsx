"use client";

import { useState } from "react";

export default function TesteMureka() {
  const [resultado, setResultado] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function testarMureka() {
    setCarregando(true);
    setResultado("");

    try {
      const resposta = await fetch("/api/gerar-audio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          estilo: "Pop romântico brasileiro",
          letra: `
Título: Nosso Amor

Verso 1
Quando te encontrei
Meu mundo mudou
Cada sorriso seu
Meu coração guardou

Refrão
Nosso amor é luz
Que nunca vai se apagar
Mesmo com o tempo
Sempre vai brilhar
          `,
        }),
      });

      const dados = await resposta.json();

      setResultado(JSON.stringify(dados, null, 2));
    } catch (erro) {
      setResultado(String(erro));
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main
      style={{
        padding: 40,
        maxWidth: 900,
        margin: "0 auto",
        fontFamily: "sans-serif",
      }}
    >
      <h1>Teste da API da Mureka</h1>

      <button
        onClick={testarMureka}
        disabled={carregando}
        style={{
          padding: "15px 25px",
          fontSize: 18,
          cursor: "pointer",
        }}
      >
        {carregando ? "Gerando..." : "Testar Mureka"}
      </button>

      <pre
        style={{
          marginTop: 30,
          background: "#111",
          color: "#0f0",
          padding: 20,
          borderRadius: 10,
          overflowX: "auto",
          whiteSpace: "pre-wrap",
        }}
      >
        {resultado}
      </pre>
    </main>
  );
}