"use client";

import { useState } from "react";
import { FaLock, FaMusic } from "react-icons/fa";
import ResultadoMusica from "./ResultadoMusica";
import CarregandoMusica from "./CarregandoMusica";

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "18px",
  borderRadius: "12px",
  border: "1px solid rgba(212,175,55,.25)",
  background: "#141414",
  color: "#fff",
  fontSize: "16px",
  outline: "none",
  boxSizing: "border-box",
};

const estilos = [
  "Sertanejo",
  "Gospel",
  "Pop",
  "MPB",
  "Forró",
  "Rock",
];

const vozes = [
  "Feminina",
  "Masculina",
];

export default function Formulario() {
  const [formulario, setFormulario] = useState({
  nome: "",
  email: "",
  whatsapp: "",
  destinatario: "",
  homenageado: "",
  ocasiao: "",
  estilo: "",
  voz: "",
  historia: "",
});

  const [letra, setLetra] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [pedidoId, setPedidoId] = useState("");

  async function enviarPedido(e: React.FormEvent) {
    e.preventDefault();

    if (formulario.nome.trim().length < 3) {
      alert("Informe seu nome completo.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formulario.email)) {
      alert("Informe um e-mail válido.");
      return;
    }

    const telefone = formulario.whatsapp.replace(/\D/g, "");

    if (telefone.length !== 11) {
      alert(
        "Informe o WhatsApp com DDD.\n\nExemplo: 24999825360"
      );
      return;
    }

    if (!formulario.destinatario.trim()) {
      alert("Informe para quem será a música.");
      return;
    }

    if (!formulario.ocasiao.trim()) {
      alert("Informe a ocasião.");
      return;
    }

    if (!formulario.estilo) {
      alert("Escolha um estilo musical.");
      return;
    }

    if (!formulario.voz) {
      alert("Escolha a voz da música.");
      return;
    }

    if (formulario.historia.trim().length < 150) {
      alert(
        "Conte um pouco mais da história. Ela deve ter no mínimo 150 caracteres."
      );
      return;
    }

    setCarregando(true);
    setLetra("");
    setPreviewUrl("");

    try {
      const resposta = await fetch("/api/pedidos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formulario),
      });

      const resultado = await resposta.json();

      console.log("================================");
      console.log("RESULTADO COMPLETO:", resultado);
      console.log("PEDIDO_ID:", resultado.pedido_id);
      console.log("ESTILO ENVIADO:", formulario.estilo);
      console.log("VOZ ENVIADA:", formulario.voz);
      console.log("HOMENAGEADO:", formulario.homenageado);
      console.log("================================");

      if (!resultado.sucesso) {
        alert(
          resultado.mensagem ||
            "Não foi possível criar sua música."
        );
        return;
      }

      setLetra(resultado.letra || "");
      setPreviewUrl(resultado.preview_url || "");
      setPedidoId(resultado.pedido_id || "");
    } catch (error) {
      console.error("ERRO AO ENVIAR PEDIDO:", error);

      alert("Erro ao enviar o pedido.");
    } finally {
      setCarregando(false);
    }
  }

  if (carregando) {
    return <CarregandoMusica pedidoId={pedidoId} />;
  }

  return (
    <section
      id="pedido"
      style={{
        background:
          "linear-gradient(180deg,#0b0b0b 0%, #101010 100%)",
        padding: "120px 20px",
        color: "#fff",
      }}
    >
      <div
        style={{
          maxWidth: "950px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "60px",
          }}
        >
          <span
            style={{
              color: "#D4AF37",
              fontWeight: "bold",
              letterSpacing: "2px",
              textTransform: "uppercase",
            }}
          >
            SUA HISTÓRIA VIRA CANÇÃO
          </span>

          <h2
            style={{
              fontSize: "46px",
              marginTop: "18px",
              marginBottom: "20px",
              lineHeight: 1.2,
            }}
          >
            Conte sua história.
            <br />
            Nós transformamos em uma canção inesquecível.
          </h2>

          <p
            style={{
              color: "#bdbdbd",
              fontSize: "20px",
              maxWidth: "700px",
              margin: "0 auto",
              lineHeight: 1.8,
            }}
          >
            Quanto mais detalhes você contar, mais emocionante,
            personalizada e única será a música criada
            especialmente para você.
          </p>
        </div>

        <div
          style={{
            background: "#151515",
            border: "1px solid rgba(212,175,55,.20)",
            borderRadius: "24px",
            padding: "45px",
            boxShadow: "0 25px 60px rgba(0,0,0,.45)",
          }}
        >
          <form
            onSubmit={enviarPedido}
            style={{
              display: "grid",
              gap: "22px",
            }}
          >
            {/* ========================= */}
            {/* DADOS DO COMPRADOR */}
            {/* ========================= */}

            <div>
              <h3
                style={{
                  color: "#D4AF37",
                  marginBottom: "8px",
                }}
              >
                Seus dados
              </h3>

              <p
                style={{
                  color: "#999",
                  marginTop: 0,
                  marginBottom: "15px",
                }}
              >
                Usaremos esses dados apenas para contato e
                acompanhamento do pedido.
              </p>
            </div>

            <input
              type="text"
              placeholder="Seu nome completo"
              value={formulario.nome}
              onChange={(e) =>
                setFormulario({
                  ...formulario,
                  nome: e.target.value,
                })
              }
              style={inputStyle}
            />

            <input
              type="email"
              placeholder="Seu melhor e-mail"
              value={formulario.email}
              onChange={(e) =>
                setFormulario({
                  ...formulario,
                  email: e.target.value,
                })
              }
              style={inputStyle}
            />

            <input
              type="tel"
              placeholder="WhatsApp"
              value={formulario.whatsapp}
              onChange={(e) =>
                setFormulario({
                  ...formulario,
                  whatsapp: e.target.value,
                })
              }
              style={inputStyle}
            />

            {/* ========================= */}
            {/* SOBRE A MÚSICA */}
            {/* ========================= */}

            <div
              style={{
                marginTop: "15px",
              }}
            >
              <h3
                style={{
                  color: "#D4AF37",
                  marginBottom: "8px",
                }}
              >
                Sobre a música
              </h3>

              <p
                style={{
                  color: "#999",
                  marginTop: 0,
                }}
              >
                Agora conte para quem é a música e como você
                gostaria que ela fosse.
              </p>
            </div>

            <input
              type="text"
              placeholder="Para quem será a música? Ex.: meu pai, minha mãe, minha esposa..."
              value={formulario.destinatario}
              onChange={(e) =>
                setFormulario({
                  ...formulario,
                  destinatario: e.target.value,
                })
              }
              style={inputStyle}
            />

            <input
              type="text"
              placeholder="Nome da pessoa homenageada (opcional)"
              value={formulario.homenageado}
              onChange={(e) =>
                setFormulario({
                  ...formulario,
                  homenageado: e.target.value,
                })
              }
              style={inputStyle}
            />

            <input
              type="text"
              placeholder="Qual é a ocasião? Ex.: aniversário, casamento, homenagem..."
              value={formulario.ocasiao}
              onChange={(e) =>
                setFormulario({
                  ...formulario,
                  ocasiao: e.target.value,
                })
              }
              style={inputStyle}
            />

            {/* ========================= */}
            {/* ESTILO MUSICAL */}
            {/* ========================= */}

            <div>
              <h3
                style={{
                  marginBottom: "12px",
                }}
              >
                Escolha o estilo musical
              </h3>

              <div
                style={{
                  display: "grid",
                  gap: "12px",
                }}
              >
                {estilos.map((estilo) => {
                  const selecionado =
                    formulario.estilo === estilo;

                  return (
                    <button
                      key={estilo}
                      type="button"
                      onClick={() =>
                        setFormulario({
                          ...formulario,
                          estilo,
                        })
                      }
                      style={{
                        width: "100%",
                        padding: "18px",
                        borderRadius: "12px",
                        border: selecionado
                          ? "2px solid #D4AF37"
                          : "1px solid rgba(212,175,55,.25)",
                        background: selecionado
                          ? "linear-gradient(135deg,#D4AF37,#F3D36B)"
                          : "#141414",
                        color: selecionado
                          ? "#111"
                          : "#fff",
                        fontSize: "17px",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      {estilo}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ========================= */}
            {/* VOZ */}
            {/* ========================= */}

            <div>
              <h3
                style={{
                  marginBottom: "12px",
                }}
              >
                Escolha a voz da música
              </h3>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(2, minmax(0, 1fr))",
                  gap: "12px",
                }}
              >
                {vozes.map((voz) => {
                  const selecionada =
                    formulario.voz === voz;

                  return (
                    <button
                      key={voz}
                      type="button"
                      onClick={() =>
                        setFormulario({
                          ...formulario,
                          voz,
                        })
                      }
                      style={{
                        padding: "18px",
                        borderRadius: "12px",
                        border: selecionada
                          ? "2px solid #D4AF37"
                          : "1px solid rgba(212,175,55,.25)",
                        background: selecionada
                          ? "linear-gradient(135deg,#D4AF37,#F3D36B)"
                          : "#141414",
                        color: selecionada
                          ? "#111"
                          : "#fff",
                        fontSize: "17px",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      {voz}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ========================= */}
            {/* HISTÓRIA */}
            {/* ========================= */}

            <div>
              <h3
                style={{
                  marginBottom: "8px",
                }}
              >
                Conte sua história
              </h3>

              <p
                style={{
                  color: "#999",
                  lineHeight: 1.6,
                  marginTop: 0,
                }}
              >
                Conte como se conheceram, momentos marcantes,
                apelidos, filhos, sonhos, promessas, superações
                e tudo aquilo que torna essa história especial.
              </p>

              <textarea
                rows={8}
                placeholder="Escreva aqui a história que você quer transformar em música..."
                value={formulario.historia}
                onChange={(e) =>
                  setFormulario({
                    ...formulario,
                    historia: e.target.value,
                  })
                }
                style={{
                  ...inputStyle,
                  resize: "vertical",
                  minHeight: "220px",
                }}
              />

              <div
                style={{
                  marginTop: "8px",
                  textAlign: "right",
                  fontWeight: 600,
                  color:
                    formulario.historia.length >= 150
                      ? "#00C853"
                      : formulario.historia.length >= 100
                      ? "#FFC107"
                      : "#FF5252",
                }}
              >
                {formulario.historia.length} / 150 caracteres
              </div>
            </div>

            {/* ========================= */}
            {/* BOTÃO */}
            {/* ========================= */}

            <button
              type="submit"
              disabled={
                formulario.historia.trim().length < 150
              }
              style={{
                marginTop: "10px",
                background:
                  formulario.historia.trim().length >= 150
                    ? "linear-gradient(135deg,#D4AF37,#F3D36B)"
                    : "#555",
                color: "#111",
                border: "none",
                borderRadius: "14px",
                padding: "20px",
                fontSize: "20px",
                fontWeight: 700,
                cursor:
                  formulario.historia.trim().length >= 150
                    ? "pointer"
                    : "not-allowed",
                opacity:
                  formulario.historia.trim().length >= 150
                    ? 1
                    : 0.7,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <FaMusic />
              Quero transformar minha história em música
            </button>

            <div
              style={{
                marginTop: "15px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                color: "#999",
                fontSize: "14px",
                textAlign: "center",
              }}
            >
              <FaLock color="#D4AF37" />

              <span>
                Suas informações são privadas e utilizadas
                somente para criar sua música personalizada.
              </span>
            </div>
          </form>

          {letra && (
            <ResultadoMusica
              letra={letra}
              previewUrl={previewUrl}
              pedidoId={pedidoId}
            />
          )}
        </div>
      </div>
    </section>
  );
}