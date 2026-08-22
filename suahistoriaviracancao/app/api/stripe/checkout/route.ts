import { NextResponse } from "next/server";
import Stripe from "stripe";

const secretKey = process.env.STRIPE_SECRET_KEY;

if (!secretKey) {
  throw new Error("STRIPE_SECRET_KEY não configurada.");
}

const stripeMode = secretKey.startsWith("sk_live_")
  ? "LIVE"
  : secretKey.startsWith("sk_test_")
  ? "TEST"
  : "DESCONHECIDO";

console.log("================================");
console.log("STRIPE MODE:", stripeMode);
console.log("STRIPE KEY PREFIX:", secretKey.substring(0, 8));
console.log("================================");

const stripe = new Stripe(secretKey, {
  apiVersion: "2026-07-29.dahlia",
});

export async function POST(req: Request) {
  try {
    const { pedidoId } = await req.json();

    console.log("================================");
    console.log("PEDIDO RECEBIDO NO CHECKOUT:");
    console.log(pedidoId);
    console.log("STRIPE MODE:", stripeMode);
    console.log("================================");

    const metadata = {
      pedido_id: pedidoId,
    };

    console.log("METADATA ENVIADA PARA O STRIPE:");
    console.log(metadata);
    console.log("================================");

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",

      metadata,

      line_items: [
        {
          price: "price_1U1Fs4HZZrOh38K9YtnjSvE3",
          quantity: 1,
        },
      ],

      success_url:
        `https://suahistoriaviracancao.com.br/sucesso?pedidoId=${pedidoId}&session_id={CHECKOUT_SESSION_ID}`,

      cancel_url: "https://suahistoriaviracancao.com.br/",
    });

    console.log("================================");
    console.log("SESSION CRIADA:");
    console.log(session.id);
    console.log("SESSION MODE:", stripeMode);
    console.log("================================");

    return NextResponse.json({
      url: session.url,
    });
  } catch (error: any) {
    console.error("================================");
    console.error("ERRO NO CHECKOUT:");
    console.error(error);
    console.error("================================");

    return NextResponse.json(
      {
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}