"use client";

import { useEffect, useRef, useState } from "react";
import { FaCopy, FaMusic } from "react-icons/fa";

type Props = {
  letra: string;
  previewUrl: string;
  pedidoId: string;
};

export default function ResultadoMusica({
  letra,
  previewUrl,
  pedidoId,
}: Props) {
  console.log("RESULTADO MUSICA RENDERIZOU");
  const audioRef = useRef<HTMLAudioElement>(null);

  const [bloqueado, setBloqueado] = useState(false);
const [statusPagamento, setStatusPagamento] = useState("pendente");
const [audioUrl, setAudioUrl] = useState("");

  useEffect(() => {
  console.log("USEEFFECT INICIOU");
  console.log("pedidoId:", pedidoId);

  
  const intervalo = setInterval(async () => {
    try {
      const resposta = await fetch(`/api/pedidos/${pedidoId}`);

      const pedido = await resposta.json();

console.log("PEDIDO:", JSON.stringify(pedido, null, 2));
console.log("STATUS DO PAGAMENTO:", pedido.pagamento_status);
console.log("AUDIO URL:", pedido.audio_url);

setStatusPagamento(pedido.pagamento_status);
setAudioUrl(pedido.audio_url);
    } catch (e) {
      console.error(e);
    }
  }, 3000);

  return () => clearInterval(intervalo);
}, [pedidoId]);
  function copiar() {

    navigator.clipboard.writeText(letra);
    alert("Letra copiada!");
  }
function baixarMusica() {
  if (!audioUrl) {
    alert("A música completa ainda não está pronta.");
    return;
  }

  const link = document.createElement("a");
  link.href = audioUrl;
  link.download = "Minha-Musica.mp3";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
  async function pagar() {
    console.log("PEDIDO ID RECEBIDO:", pedidoId);
  try {
    const resposta = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pedidoId,
      }),
    });

    const dados = await resposta.json();

    if (dados.url) {
      window.location.href = dados.url;
    } else {
      alert("Erro ao iniciar pagamento.");
    }
  } catch (erro) {
    console.error(erro);
    alert("Erro ao conectar ao Stripe.");
  }
}

  function controlarTempo() {
    if (!audioRef.current) return;

    if (audioRef.current.currentTime >= 30 && !bloqueado) {
      audioRef.current.pause();
      setBloqueado(true);
    }
  }

  const linhas = letra.split("\n");
  const titulo = linhas[0];
  const restante = linhas.slice(1).join("\n");

  return (
    <div
      style={{
        marginTop: 50,
        background: "#111",
        border: "1px solid rgba(212,175,55,.25)",
        borderRadius: 20,
        padding: 40,
      }}
    >
      <div
        style={{
          textAlign: "center",
          marginBottom: 30,
        }}
      >
        <FaMusic
          size={42}
          color="#D4AF37"
          style={{ marginBottom: 15 }}
        />

        <h2
          style={{
            color: "#D4AF37",
            fontSize: 32,
            marginBottom: 10,
          }}
        >
          Sua música está pronta!
        </h2>

        <p
          style={{
            color: "#bbb",
            fontSize: 18,
          }}
        >
          Criada exclusivamente para você.
        </p>
      </div>

      <div
        style={{
          background: "#181818",
          padding: 30,
          borderRadius: 16,
          lineHeight: 1.9,
          whiteSpace: "pre-wrap",
        }}
      >
        <h3
          style={{
            color: "#D4AF37",
            fontSize: 28,
            marginBottom: 20,
          }}
        >
          {titulo}
        </h3>

        <div
          style={{
            color: "#eee",
            fontSize: 18,
          }}
        >
          {restante}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          gap: 20,
          justifyContent: "center",
          flexWrap: "wrap",
          marginTop: 35,
        }}
      >
        <button
          onClick={copiar}
          style={{
            padding: "16px 30px",
            background: "#D4AF37",
            color: "#111",
            border: "none",
            borderRadius: 12,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          <FaCopy style={{ marginRight: 8 }} />
📋 Copiar letra
</button>
        {previewUrl ? (
  <>
    {(!bloqueado || statusPagamento === "pago") && (
      <>
        <audio
          ref={audioRef}
          controls
          onTimeUpdate={controlarTempo}
          style={{
            width: "100%",
            maxWidth: "500px",
          }}
        >
          <source src={previewUrl} type="audio/mpeg" />
          Seu navegador não suporta áudio.
        </audio>

        {statusPagamento === "pago" && (
          <button
            onClick={baixarMusica}
            style={{
              marginTop: 20,
              padding: "16px 30px",
              background: "#16a34a",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            ⬇️ Baixar música completa
          </button>
        )}
      </>
    )}

    {bloqueado && statusPagamento !== "pago" && (
      <div
        style={{
          width: "100%",
          maxWidth: 550,
          marginTop: 20,
          background: "#1b1b1b",
          border: "1px solid #D4AF37",
          borderRadius: 16,
          padding: 30,
          textAlign: "center",
        }}
      >
        <h3
          style={{
            color: "#D4AF37",
            marginBottom: 15,
            fontSize: 28,
          }}
        >
          ✨ Gostou da sua música?
        </h3>

        <p
          style={{
            color: "#ddd",
            lineHeight: 1.8,
            marginBottom: 25,
          }}
        >
          Você ouviu uma prévia exclusiva de 30 segundos.
          <br />
          Desbloqueie agora a versão completa por apenas
          <strong> R$ 29,90</strong>.
        </p>

        <button
          onClick={pagar}
          style={{
            padding: "18px 35px",
            background: "#D4AF37",
            color: "#111",
            border: "none",
            borderRadius: 12,
            fontWeight: 700,
            fontSize: 18,
            cursor: "pointer",
          }}
        >
          🎵 Quero minha música completa
        </button>
      </div>
    )}
  </>
) : (
  <button
    disabled
    style={{
      padding: "16px 30px",
      background: "#2a2a2a",
      color: "#888",
      border: "none",
      borderRadius: 12,
      fontWeight: 700,
    }}
  >
    Gerando prévia...
  </button>
)}
        {statusPagamento !== "pago" && (
    <button
        onClick={pagar}
        style={{
            padding: "16px 30px",
            background: "#333",
            color: "#D4AF37",
            border: "1px solid #D4AF37",
            borderRadius: 12,
            fontWeight: 700,
            cursor: "pointer",
        }}
    >
        🔒 Desbloquear música completa
    </button>
)}
      </div>
    </div>
  );
}