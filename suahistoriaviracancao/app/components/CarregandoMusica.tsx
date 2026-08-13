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

  // Evita duas consultas simultâneas
  const verificandoRef = useRef(false);

  // Controla se o sistema já terminou
  const finalizadoRef = useRef(false);

  // Guarda o intervalo para podermos pará-lo imediatamente
  const intervaloRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!pedidoId) return;

    let ativo = true;

    // ---------------------------------------------------------
    // ANIMAÇÃO DAS ETAPAS
    // ---------------------------------------------------------

    const intervaloEtapas = setInterval(() => {
      if (!ativo || finalizadoRef.current) return;

      setIndice((atual) => {
        if (atual >= etapas.length - 1) {
          return atual;
        }

        return atual + 1;
      });
    }, 1800);

    // ---------------------------------------------------------
    // FUNÇÃO PARA IR AO RESULTADO
    // ---------------------------------------------------------

    const irParaResultado = () => {
      if (!ativo) return;

      if (finalizadoRef.current) return;

      finalizadoRef.current = true;

      console.log("====================================");
      console.log("🎉 MÚSICA FINALIZADA!");
      console.log("🛑 PARANDO CONSULTAS...");
      console.log("➡️ Indo para o resultado...");
      console.log("====================================");

      // Para imediatamente o polling
      if (intervaloRef.current) {
        clearInterval(intervaloRef.current);
        intervaloRef.current = null;
      }

      // Para a animação
      clearInterval(intervaloEtapas);

      // Vai para o resultado
      window.location.href =
        `/resultado?pedidoId=${pedidoId}`;
    };

    // ---------------------------------------------------------
    // VERIFICAÇÃO DA MÚSICA
    // ---------------------------------------------------------

    const verificarMusica = async () => {
      if (!ativo) return;

      // Se já terminou, não consulta mais nada
      if (finalizadoRef.current) return;

      // Se já existe uma consulta acontecendo, não inicia outra
      if (verificandoRef.current) return;

      verificandoRef.current = true;

      try {
        // =====================================================
        // 1. BUSCA O PEDIDO
        // =====================================================

        const respostaPedido = await fetch(
          `/api/pedidos/${pedidoId}`,
          {
            cache: "no-store",
          }
        );

        if (!respostaPedido.ok) {
          console.error("❌ Erro ao buscar pedido.");
          return;
        }

        const pedido = await respostaPedido.json();

        console.log("📦 PEDIDO ATUAL:", pedido);

        if (!ativo || finalizadoRef.current) return;

        setStatus(pedido.pagamento_status || "");

        // =====================================================
        // 2. MÚSICA JÁ ESTÁ PRONTA
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
          console.log(
            "🎧 AUDIO STATUS:",
            pedido.audio_status
          );

          irParaResultado();

          return;
        }

        // =====================================================
        // 3. PAGAMENTO AINDA NÃO FOI CONFIRMADO
        // =====================================================

        if (pedido.pagamento_status !== "pago") {
          console.log(
            "⏳ Aguardando confirmação do pagamento..."
          );

          return;
        }

        // =====================================================
        // 4. PAGAMENTO OK, MAS AINDA NÃO TEM ÁUDIO
        // =====================================================

        if (!pedido.task_id) {
          console.log(
            "⏳ Pagamento confirmado. Aguardando task_id..."
          );

          return;
        }

        console.log(
          "🎵 Consultando status da música:",
          pedido.task_id
        );

        // =====================================================
        // 5. CONSULTA A MUREKA
        // =====================================================

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
            "❌ Erro ao consultar status da música."
          );

          return;
        }

        const resultadoMusica =
          await respostaMusica.json();

        console.log(
          "🎼 STATUS DA MÚSICA:",
          resultadoMusica
        );

        if (!ativo || finalizadoRef.current) return;

        // =====================================================
        // 6. BUSCA O PEDIDO NOVAMENTE
        //    O endpoint pode ter acabado de atualizar o banco
        // =====================================================

        const respostaPedidoAtualizada =
          await fetch(
            `/api/pedidos/${pedidoId}`,
            {
              cache: "no-store",
            }
          );

        if (!respostaPedidoAtualizada.ok) {
          console.error(
            "❌ Erro ao buscar pedido atualizado."
          );

          return;
        }

        const pedidoAtualizado =
          await respostaPedidoAtualizada.json();

        console.log(
          "🔄 PEDIDO ATUALIZADO:",
          pedidoAtualizado
        );

        if (!ativo || finalizadoRef.current) return;

        // =====================================================
        // 7. VERIFICA SE A MÚSICA TERMINOU
        // =====================================================

        if (
          pedidoAtualizado.audio_url &&
          (
            pedidoAtualizado.audio_status === "completed" ||
            pedidoAtualizado.status === "concluido"
          )
        ) {
          console.log(
            "✅ PAGAMENTO CONFIRMADO E MÚSICA PRONTA!"
          );

          console.log(
            "🔊 AUDIO URL:",
            pedidoAtualizado.audio_url
          );

          console.log(
            "🎧 AUDIO STATUS:",
            pedidoAtualizado.audio_status
          );

          irParaResultado();

          return;
        }

        // =====================================================
        // 8. AINDA ESTÁ GERANDO
        // =====================================================

        console.log(
          "⏳ Música ainda está sendo processada..."
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

    // ---------------------------------------------------------
    // PRIMEIRA VERIFICAÇÃO
    // ---------------------------------------------------------

    verificarMusica();

    // ---------------------------------------------------------
    // VERIFICA A CADA 3 SEGUNDOS
    // ---------------------------------------------------------

    intervaloRef.current = setInterval(
      verificarMusica,
      3000
    );

    // ---------------------------------------------------------
    // LIMPEZA
    // ---------------------------------------------------------

    return () => {
      ativo = false;

      clearInterval(intervaloEtapas);

      if (intervaloRef.current) {
        clearInterval(intervaloRef.current);
        intervaloRef.current = null;
      }

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