"use client";

import { useEffect, useRef, useState } from "react";

const etapas = [
  "✨ Lendo sua história...",
  "❤️ Identificando emoções...",
  "🎼 Compondo os versos...",
  "🎤 Criando a melodia...",
  "🎵 Finalizando sua música...",
];

type Props = {
  pedidoId: string;
};

export default function CarregandoMusica({ pedidoId }: Props) {
  const [indice, setIndice] = useState(0);
  const [status, setStatus] = useState("");

  // Evita duas consultas acontecendo ao mesmo tempo
  const verificandoRef = useRef(false);

  useEffect(() => {
    if (!pedidoId) return;

    let ativo = true;

    // Animação das etapas
    const intervaloEtapas = setInterval(() => {
      setIndice((atual) => {
        if (atual >= etapas.length - 1) {
          return atual;
        }

        return atual + 1;
      });
    }, 1800);

    const verificarMusica = async () => {
      if (!ativo) return;

      // Se já existe uma consulta rodando, não inicia outra
      if (verificandoRef.current) return;

      verificandoRef.current = true;

      try {
        // =====================================================
        // 1. BUSCA O PEDIDO ATUAL
        // =====================================================

        const respostaPedido = await fetch(
          `/api/pedidos/${pedidoId}`,
          {
            cache: "no-store",
          }
        );

        if (!respostaPedido.ok) {
          console.error("Erro ao buscar pedido.");
          return;
        }

        const pedido = await respostaPedido.json();

        console.log("📦 PEDIDO ATUAL:", pedido);

        if (!ativo) return;

        setStatus(pedido.pagamento_status || "");

        // =====================================================
        // 2. SE PAGAMENTO FOI CONFIRMADO E JÁ TEM ÁUDIO
        //    VAI DIRETO PARA O RESULTADO
        // =====================================================

        if (
  pedido.audio_url &&
  (
    pedido.audio_status === "completed" ||
    pedido.status === "concluido"
  )
) {
  console.log("🎵 MÚSICA JÁ ESTÁ PRONTA!");
  console.log("🔊 ÁUDIO:", pedido.audio_url);
  console.log("📊 STATUS:", pedido.status);
  console.log("🎧 AUDIO STATUS:", pedido.audio_status);

  window.location.href =
    `/resultado?pedidoId=${pedidoId}`;

  return;
}

        // =====================================================
        // 3. SE AINDA NÃO PAGOU, AGUARDA
        // =====================================================

        if (pedido.pagamento_status !== "pago") {
          console.log(
            "⏳ Aguardando confirmação do pagamento..."
          );

          return;
        }

        // =====================================================
        // 4. PAGAMENTO OK, MAS AINDA NÃO TEM ÁUDIO
        //    CONSULTA A MUREKA
        // =====================================================

        if (pedido.task_id) {
          console.log(
            "🎵 Consultando status da música:",
            pedido.task_id
          );

          const respostaMusica = await fetch(
            `/api/status-musica?taskId=${encodeURIComponent(
              pedido.task_id
            )}`,
            {
              cache: "no-store",
            }
          );

          if (!respostaMusica.ok) {
            console.error(
              "Erro ao consultar status da música."
            );

            return;
          }

          const resultadoMusica =
            await respostaMusica.json();

          console.log(
            "🎼 STATUS DA MÚSICA:",
            resultadoMusica
          );

          // ===================================================
          // 5. MUITO IMPORTANTE:
          //    O /api/status-musica pode ter acabado de
          //    atualizar o Supabase.
          //
          //    Então buscamos o pedido NOVAMENTE.
          // ===================================================

          const respostaPedidoAtualizada =
            await fetch(
              `/api/pedidos/${pedidoId}`,
              {
                cache: "no-store",
              }
            );

          if (!respostaPedidoAtualizada.ok) {
            console.error(
              "Erro ao buscar pedido atualizado."
            );

            return;
          }

          const pedidoAtualizado =
            await respostaPedidoAtualizada.json();

          console.log(
            "🔄 PEDIDO ATUALIZADO:",
            pedidoAtualizado
          );

          // ===================================================
          // 6. SE PAGAMENTO + ÁUDIO ESTÃO OK,
          //    VAI PARA O RESULTADO
          // ===================================================

          if (
            pedidoAtualizado.pagamento_status === "pago" &&
            pedidoAtualizado.audio_url
          ) {
            console.log(
              "✅ PAGAMENTO CONFIRMADO E MÚSICA PRONTA!"
            );

            console.log(
              "🔊 AUDIO URL:",
              pedidoAtualizado.audio_url
            );

            window.location.href =
              `/resultado?pedidoId=${pedidoId}`;

            return;
          }

          // ===================================================
          // 7. AINDA ESTÁ GERANDO
          // ===================================================

          console.log(
            "⏳ Música ainda está sendo processada..."
          );

          return;
        }

        // =====================================================
        // 8. PAGOU, MAS AINDA NÃO TEM TASK_ID
        // =====================================================

        console.log(
          "⏳ Pagamento confirmado. Aguardando task_id..."
        );
      } catch (erro) {
        console.error(
          "❌ Erro ao verificar música:",
          erro
        );
      } finally {
        verificandoRef.current = false;
      }
    };

    // Primeira verificação imediatamente
    verificarMusica();

    // Depois verifica a cada 3 segundos
    const intervalo = setInterval(
      verificarMusica,
      3000
    );

    return () => {
      ativo = false;

      clearInterval(intervalo);
      clearInterval(intervaloEtapas);

      verificandoRef.current = false;
    };
  }, [pedidoId]);

  return (
    <div
      style={{
        marginTop: 50,
        background: "#111",
        border: "1px solid rgba(212,175,55,.25)",
        borderRadius: 20,
        padding: 40,
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: 70,
          marginBottom: 25,
        }}
      >
        🎵
      </div>

      <h2
        style={{
          color: "#D4AF37",
          marginBottom: 15,
        }}
      >
        Criando sua música...
      </h2>

      <p
        style={{
          color: "#ddd",
          fontSize: 20,
          minHeight: 35,
        }}
      >
        {etapas[indice]}
      </p>

      <div
        style={{
          width: "100%",
          height: 10,
          background: "#2b2b2b",
          borderRadius: 999,
          overflow: "hidden",
          marginTop: 35,
        }}
      >
        <div
          style={{
            width: `${((indice + 1) / etapas.length) * 100}%`,
            height: "100%",
            background:
              "linear-gradient(90deg,#D4AF37,#FFD86B)",
            transition: "0.8s",
          }}
        />
      </div>

      <p
        style={{
          marginTop: 25,
          color: "#888",
        }}
      >
        Estamos criando uma música exclusiva para você.
      </p>

      {status === "pago" && (
        <p
          style={{
            marginTop: 15,
            color: "#D4AF37",
            fontSize: 14,
          }}
        >
          Pagamento confirmado. Finalizando sua música...
        </p>
      )}
    </div>
  );
}