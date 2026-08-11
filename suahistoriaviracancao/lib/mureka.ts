const API_URL = "https://api.mureka.ai";

export async function gerarMusicaMureka(
  letra: string,
  estilo: string
) {
  const resposta = await fetch(`${API_URL}/v1/song/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.MUREKA_API_KEY}`,
    },
    body: JSON.stringify({
      lyrics: letra,
      model: "auto",
      prompt: estilo,
      stream: false,
    }),
  });

  if (!resposta.ok) {
    const erro = await resposta.text();
    throw new Error(`Erro Mureka: ${erro}`);
  }

  const dados = await resposta.json();

  console.log("===== GERAÇÃO =====");
  console.log(JSON.stringify(dados, null, 2));

  return dados;
}

export async function consultarMusica(taskId: string) {
  const resposta = await fetch(
    `${API_URL}/v1/song/query/${taskId}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.MUREKA_API_KEY}`,
      },
    }
  );

  if (!resposta.ok) {
    const erro = await resposta.text();
    throw new Error(`Erro ao consultar música: ${erro}`);
  }

  const dados = await resposta.json();

  console.log("===== CONSULTA =====");
  console.log(JSON.stringify(dados, null, 2));

  return dados;
}