import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { nome, destinatario, historia, estilo } = await req.json();

    const prompt = `
Você é um compositor profissional.

Crie uma música emocionante.

Nome: ${nome}
Destinatário: ${destinatario}
Estilo: ${estilo}

História:
${historia}

A música deve conter:

- Título
- Verso 1
- Refrão
- Verso 2
- Refrão Final

Retorne apenas a letra da música.
`;

    const resposta = await fetch(
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

    if (!resposta.ok) {
      const erro = await resposta.text();

      return NextResponse.json(
        {
          sucesso: false,
          mensagem: erro,
        },
        { status: resposta.status }
      );
    }

    const dados = await resposta.json();

    return NextResponse.json({
      sucesso: true,
      musica: dados.choices[0].message.content,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        sucesso: false,
        mensagem: String(error),
      },
      { status: 500 }
    );
  }
}