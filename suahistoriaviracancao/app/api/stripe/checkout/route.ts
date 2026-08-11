import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-07-29.dahlia",
});

export async function POST(req: Request) {
  try {
    const { pedidoId } = await req.json();

    console.log("================================");
    console.log("PEDIDO RECEBIDO NO CHECKOUT:");
    console.log(pedidoId);

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
`http://localhost:3000/sucesso?pedidoId=${pedidoId}&session_id={CHECKOUT_SESSION_ID}`,

      cancel_url: "http://localhost:3000/",
    });

    console.log("SESSION CRIADA:");
    console.log(session.id);

    return NextResponse.json({
      url: session.url,
    });
  } catch (error: any) {
    console.error("ERRO NO CHECKOUT:");
    console.error(error);

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