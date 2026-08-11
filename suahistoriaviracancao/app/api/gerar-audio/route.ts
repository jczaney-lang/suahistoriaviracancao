import { NextResponse } from "next/server";
import { gerarMusicaMureka } from "@/lib/mureka";

export async function POST(req: Request) {
  try {
    const { letra, estilo } = await req.json();

    const resposta = await gerarMusicaMureka(
      letra,
      estilo || "pop romântico brasileiro"
    );

    console.log("RESPOSTA MUREKA:");
    console.log(JSON.stringify(resposta, null, 2));

    return NextResponse.json(resposta);

  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      {
        erro: error.message,
      },
      { status: 500 }
    );
  }
}