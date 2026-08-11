import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import {
  gerarMusicaMureka,
  consultarMusica,
} from "@/lib/mureka";

export async function POST(req: Request) {
  try {
    const dados = await req.json();

    console.log("================================");
    console.log("NOVO PEDIDO RECEBIDO");
    console.log("DESTINATÁRIO:", dados.destinatario);
    console.log(
      "NOME HOMENAGEADO:",
      dados.nomeHomenageado
    );
    console.log("OCASIÃO:", dados.ocasiao);
    console.log("ESTILO:", dados.estilo);
    console.log("VOZ:", dados.voz);
    console.log("================================");

    // =====================================================
    // 1. SALVA O PEDIDO NO SUPABASE
    //
    // voz e nomeHomenageado ainda não são enviados para
    // o banco para não exigir novas colunas no Supabase.
    // =====================================================

    const dadosParaBanco = {
      nome: dados.nome,
      email: dados.email,
      whatsapp: dados.whatsapp,
      destinatario: dados.destinatario,
      ocasiao: dados.ocasiao,
      estilo: dados.estilo,
      historia: dados.historia,
    };

    const { data: pedido, error } = await supabase
      .from("pedidos")
      .insert([dadosParaBanco])
      .select()
      .single();

    if (error) {
      console.error("ERRO SUPABASE:", error);

      return NextResponse.json(
        {
          sucesso: false,
          mensagem: error.message,
        },
        { status: 500 }
      );
    }

    console.log("PEDIDO SALVO:", pedido);

    // =====================================================
    // 2. MONTA O PROMPT
    // =====================================================

    const nomeHomenageado =
      dados.nomeHomenageado?.trim() || "";

    const identificacaoHomenageado =
      nomeHomenageado
        ? `Nome da pessoa homenageada: ${nomeHomenageado}`
        : "Não foi informado nome para a pessoa homenageada.";

    const prompt = `
Você é um compositor profissional especializado em transformar
histórias reais em músicas emocionantes, naturais e personalizadas.

IMPORTANTE:

O nome informado no campo "Nome do comprador" NÃO é o nome da
pessoa homenageada.

NUNCA coloque o nome do comprador na letra apenas porque ele
fez a compra.

Use somente as informações relacionadas à música para criar
a composição.

DADOS PARA A COMPOSIÇÃO:

Para quem é a música:
${dados.destinatario}

${identificacaoHomenageado}

Ocasião:
${dados.ocasiao}

Estilo musical:
${dados.estilo}

Voz escolhida:
${dados.voz}

História:
${dados.historia}

INSTRUÇÕES:

Crie uma música completa, emocionante e natural.

A música deve parecer escrita especialmente para essa história,
e não uma letra genérica.

Se o nome da pessoa homenageada tiver sido informado, você pode
utilizá-lo de maneira natural na letra.

Se o nome da pessoa homenageada NÃO tiver sido informado,
NÃO invente nenhum nome.

O campo "Para quem é a música" indica a relação ou destinatário,
como pai, mãe, esposa, marido, filho, amigo, tio etc.

Não transforme automaticamente essa relação em um nome próprio.

O nome do comprador nunca deve aparecer na música, a menos que
ele também esteja explicitamente identificado na história como
parte importante da homenagem.

Considere o estilo musical escolhido:

${dados.estilo}

Considere também que a voz escolhida será:

${dados.voz}

A letra deve respeitar o clima e a emoção da ocasião:

${dados.ocasiao}

Estrutura obrigatória:

- Título
- Verso 1
- Refrão
- Verso 2
- Ponte
- Refrão Final

Retorne apenas a letra da música.
`;

    console.log("PROMPT ENVIADO PARA A IA:");
    console.log(prompt);

    // =====================================================
    // 3. CHAMA A OPENAI
    // =====================================================

    const respostaIA = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4.1-mini",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.8,
        }),
      }
    );

    if (!respostaIA.ok) {
      const erro = await respostaIA.text();

      console.error("ERRO OPENAI:", erro);

      return NextResponse.json(
        {
          sucesso: false,
          mensagem: erro,
        },
        { status: respostaIA.status }
      );
    }

    const resultadoIA = await respostaIA.json();

    const letra =
      resultadoIA.choices?.[0]?.message?.content ?? "";

    console.log("LETRA GERADA:");
    console.log(letra);

    // =====================================================
    // 4. GERA A MÚSICA NA MUREKA
    // =====================================================

    let musica = await gerarMusicaMureka(
      letra,
      dados.estilo
    );

    let previewUrl = musica.wav_url || "";

    // =====================================================
    // 5. AGUARDA A PRÉVIA DA MÚSICA
    // =====================================================

    for (let tentativa = 1; tentativa <= 30; tentativa++) {
      if (previewUrl) break;

      console.log(
        `Tentativa ${tentativa} de buscar a prévia...`
      );

      await new Promise((resolve) =>
        setTimeout(resolve, 5000)
      );

      const resultado = await consultarMusica(
        musica.id
      );

      console.log("RESULTADO COMPLETO:");
      console.log(
        JSON.stringify(resultado, null, 2)
      );

      previewUrl =
        resultado.url ??
        resultado.wav_url ??
        resultado.data?.url ??
        resultado.data?.wav_url ??
        resultado.result?.url ??
        resultado.result?.wav_url ??
        resultado.song?.url ??
        resultado.song?.wav_url ??
        resultado.choices?.[0]?.url ??
        resultado.choices?.[0]?.wav_url ??
        "";

      console.log(
        "PREVIEW ENCONTRADA:",
        previewUrl
      );

      musica = resultado;
    }

    console.log("MUREKA:");
    console.log(musica);

    console.log(
      "PREVIEW URL:",
      previewUrl
    );

    console.log(
      "MÚSICA COMPLETA:",
      JSON.stringify(musica, null, 2)
    );

    // =====================================================
    // 6. ATUALIZA O PEDIDO
    // =====================================================

    const { error: erroUpdate } = await supabase
      .from("pedidos")
      .update({
        letra,
        status: "gerando",
        task_id: musica.id,
        audio_status: musica.status,
        preview_url: previewUrl,
      })
      .eq("id", pedido.id);

    if (erroUpdate) {
      console.error(
        "ERRO UPDATE:",
        erroUpdate
      );
    } else {
      console.log(
        "PEDIDO ATUALIZADO COM SUCESSO"
      );
    }

    // =====================================================
    // 7. RETORNA PARA O FRONT
    // =====================================================

    const resposta = {
      sucesso: true,
      mensagem:
        "Pedido recebido com sucesso!",
      pedido_id: pedido.id,
      letra,
      preview_url: previewUrl,
    };

    console.log(
      "=== RETORNO PARA O FRONT ==="
    );

    console.log(
      JSON.stringify(resposta, null, 2)
    );

    return NextResponse.json(resposta);
  } catch (error) {
    console.error(
      "ERRO GERAL:",
      error
    );

    return NextResponse.json(
      {
        sucesso: false,
        mensagem: String(error),
      },
      { status: 500 }
    );
  }
}