"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import CarregandoMusica from "@/app/components/CarregandoMusica";

function ConteudoSucesso() {
  const searchParams = useSearchParams();

  const pedidoId = searchParams.get("pedidoId");

  if (!pedidoId) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#050505",
          color: "#fff",
          fontFamily: "Arial",
          padding: 20,
        }}
      >
        <div
          style={{
            textAlign: "center",
            maxWidth: 600,
          }}
        >
          <h1
            style={{
              color: "#D4AF37",
              marginBottom: 15,
            }}
          >
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
        <div
          style={{
            textAlign: "center",
            marginBottom: 20,
          }}
        >
          <h1
            style={{
              color: "#D4AF37",
              marginBottom: 10,
            }}
          >
            🎉 Pagamento realizado com sucesso!
          </h1>

          <p
            style={{
              color: "#ccc",
              fontSize: 18,
            }}
          >
            Agora estamos finalizando sua música exclusiva.
          </p>
        </div>

        <CarregandoMusica pedidoId={pedidoId} />
      </div>
    </main>
  );
}

export default function Sucesso() {
  return (
    <Suspense
      fallback={
        <main
          style={{
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "#050505",
            color: "#D4AF37",
            fontFamily: "Arial",
          }}
        >
          <h2>🎵 Preparando sua música...</h2>
        </main>
      }
    >
      <ConteudoSucesso />
    </Suspense>
  );
}