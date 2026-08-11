"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ResultadoMusica from "@/app/components/ResultadoMusica";

function ConteudoResultado() {
  const searchParams = useSearchParams();

  const pedidoId = searchParams.get("pedidoId");

  const [pedido, setPedido] = useState<any>(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (!pedidoId) return;

    async function carregarPedido() {
      try {
        const resposta = await fetch(
          `/api/pedidos/${pedidoId}`,
          {
            cache: "no-store",
          }
        );

        if (!resposta.ok) {
          throw new Error("Não foi possível carregar o pedido.");
        }

        const dados = await resposta.json();

        console.log("🎵 PEDIDO PARA RESULTADO:", dados);

        setPedido(dados);
      } catch (error) {
        console.error(
          "❌ Erro ao carregar pedido:",
          error
        );

        setErro(
          "Não conseguimos carregar sua música."
        );
      }
    }

    carregarPedido();
  }, [pedidoId]);

  if (!pedidoId) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#050505",
          color: "#fff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "Arial",
          padding: 20,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h1 style={{ color: "#D4AF37" }}>
            🎵 Pedido não encontrado
          </h1>

          <p style={{ color: "#ccc" }}>
            Não conseguimos identificar o pedido.
          </p>

          <button
            onClick={() => {
              window.location.href = "/";
            }}
            style={{
              marginTop: 25,
              padding: "14px 25px",
              border: "none",
              borderRadius: 10,
              background: "#D4AF37",
              color: "#111",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Voltar para o início
          </button>
        </div>
      </main>
    );
  }

  if (erro) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#050505",
          color: "#fff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "Arial",
          padding: 20,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h1 style={{ color: "#D4AF37" }}>
            🎵 Ocorreu um problema
          </h1>

          <p style={{ color: "#ccc" }}>
            {erro}
          </p>
        </div>
      </main>
    );
  }

  if (!pedido) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#050505",
          color: "#D4AF37",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "Arial",
        }}
      >
        <h2>🎵 Carregando sua música...</h2>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#050505",
        color: "#fff",
        fontFamily: "Arial",
        padding: "30px 20px",
      }}
    >
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
        }}
      >
        <ResultadoMusica
          pedidoId={pedidoId}
          letra={pedido.letra || ""}
          previewUrl={
            pedido.preview_url ||
            pedido.audio_url ||
            ""
          }
        />
      </div>
    </main>
  );
}

export default function ResultadoPage() {
  return (
    <Suspense
      fallback={
        <main
          style={{
            minHeight: "100vh",
            background: "#050505",
            color: "#D4AF37",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontFamily: "Arial",
          }}
        >
          <h2>🎵 Preparando sua música...</h2>
        </main>
      }
    >
      <ConteudoResultado />
    </Suspense>
  );
}