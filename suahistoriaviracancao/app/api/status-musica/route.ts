import { NextRequest, NextResponse } from "next/server";
import { consultarMusica } from "@/lib/mureka";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const taskId = req.nextUrl.searchParams.get("taskId");

    if (!taskId) {
      return NextResponse.json(
        { erro: "taskId não informado" },
        { status: 400 }
      );
    }

    console.log("=================================");
    console.log("🎵 CONSULTANDO MÚSICA");
    console.log("TASK ID:", taskId);
    console.log("=================================");

    const dados = await consultarMusica(taskId);

    console.log(
      "📦 RESPOSTA COMPLETA DA MUREKA:"
    );

    console.log(
      JSON.stringify(dados, null, 2)
    );

    const statusOriginal = String(
      dados?.status || ""
    );

    const status = statusOriginal
      .toLowerCase()
      .trim();

    console.log(
      "🎵 STATUS MUREKA:",
      statusOriginal
    );

    console.log(
      "🎵 STATUS NORMALIZADO:",
      status
    );

    console.log(
      "🎵 CHOICES:",
      dados?.choices
    );

    // =====================================================
    // VERIFICA SE A MÚSICA TERMINOU
    // =====================================================

    const musicaConcluida = [
      "succeeded",
      "completed",
      "complete",
      "success",
      "successful",
      "done",
      "finished",
    ].includes(status);

    if (!musicaConcluida) {
      console.log(
        "⏳ MÚSICA AINDA NÃO ESTÁ PRONTA."
      );

      return NextResponse.json({
        ...dados,
        processando: true,
      });
    }

    // =====================================================
    // PROCURA A MÚSICA
    // =====================================================

    const musica =
      dados?.choices?.[0] ||
      dados?.result ||
      dados?.data?.choices?.[0] ||
      dados?.data?.result ||
      dados?.song ||
      null;

    console.log(
      "🔎 MÚSICA ENCONTRADA:"
    );

    console.log(
      JSON.stringify(musica, null, 2)
    );

    if (!musica) {
      console.error(
        "❌ Mureka informou que a música terminou, mas não encontramos o objeto da música."
      );

      return NextResponse.json({
        ...dados,
        erro:
          "Música concluída, mas objeto de áudio não encontrado.",
      });
    }

    // =====================================================
    // PROCURA A URL DO ÁUDIO
    // =====================================================

    const audioUrl =
      musica.url ||
      musica.wav_url ||
      musica.flac_url ||
      musica.audio_url ||
      musica.audioUrl ||
      musica.download_url ||
      musica.downloadUrl ||
      null;

    const previewUrl =
      musica.preview_url ||
      musica.previewUrl ||
      musica.url ||
      musica.wav_url ||
      null;

    console.log("=================================");
    console.log("🎉 MÚSICA FINALIZADA");
    console.log("STATUS:", statusOriginal);
    console.log("URL:", musica.url);
    console.log("WAV:", musica.wav_url);
    console.log("FLAC:", musica.flac_url);
    console.log("AUDIO URL FINAL:", audioUrl);
    console.log("PREVIEW URL:", previewUrl);
    console.log("=================================");

    // =====================================================
    // SE NÃO ENCONTROU O ÁUDIO
    // =====================================================

    if (!audioUrl) {
      console.error(
        "❌ Mureka informou que a música terminou, mas nenhuma URL de áudio foi encontrada."
      );

      return NextResponse.json({
        ...dados,
        erro:
          "Música concluída, mas URL de áudio não encontrada.",
      });
    }

    // =====================================================
    // ATUALIZA O PEDIDO NO SUPABASE
    // =====================================================

    const { data, error } = await supabase
      .from("pedidos")
      .update({
        status: "concluido",
        audio_status: "completed",
        audio_url: audioUrl,
        preview_url: previewUrl,
      })
      .eq("task_id", taskId)
      .select();

    console.log("=================================");
    console.log("💾 UPDATE SUPABASE");
    console.log("=================================");

    console.log(
      JSON.stringify(data, null, 2)
    );

    if (error) {
      console.error(
        "❌ ERRO SUPABASE:"
      );

      console.error(error);

      return NextResponse.json(
        {
          ...dados,
          erro_supabase: error.message,
        },
        { status: 500 }
      );
    }

    // =====================================================
    // NENHUM PEDIDO ENCONTRADO
    // =====================================================

    if (!data || data.length === 0) {
      console.error(
        "⚠️ NENHUM PEDIDO FOI ATUALIZADO!"
      );

      console.error(
        "TASK ID PROCURADO:",
        taskId
      );

      return NextResponse.json({
        ...dados,
        aviso:
          "Nenhum pedido encontrado com esse task_id.",
      });
    }

    // =====================================================
    // SUCESSO
    // =====================================================

    console.log(
      "================================="
    );

    console.log(
      "✅ PEDIDO ATUALIZADO COM SUCESSO!"
    );

    console.log(
      "🆔 PEDIDO:",
      data[0].id
    );

    console.log(
      "📊 STATUS:",
      data[0].status
    );

    console.log(
      "🎧 AUDIO STATUS:",
      data[0].audio_status
    );

    console.log(
      "🔊 AUDIO URL:",
      data[0].audio_url
    );

    console.log(
      "================================="
    );

    return NextResponse.json({
      ...dados,
      processando: false,
      concluido: true,
      audio_url: audioUrl,
      preview_url: previewUrl,
    });
  } catch (error) {
    console.error(
      "❌ ERRO GERAL STATUS-MUSICA:"
    );

    console.error(error);

    return NextResponse.json(
      {
        erro: String(error),
      },
      {
        status: 500,
      }
    );
  }
}