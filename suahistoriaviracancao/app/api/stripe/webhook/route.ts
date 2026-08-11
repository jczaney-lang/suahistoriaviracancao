import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabase } from "@/lib/supabase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-07-29.dahlia",
});

export async function POST(req: Request) {
  console.log("🔥 WEBHOOK STRIPE CHEGOU!");
  const body = await req.text();

  const signature = (await headers()).get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Assinatura não encontrada." },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Webhook inválido:", err.message);

    return NextResponse.json(
      { error: err.message },
      { status: 400 }
    );
  }
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
console.log("=== WEBHOOK RECEBIDO ===");
console.log("Evento:", event.type);
console.log("Session ID:", session.id);
console.log("Metadata:", session.metadata);
console.log("Pedido ID:", session.metadata?.pedido_id);
    const pedidoId = session.metadata?.pedido_id;

    if (pedidoId) {
      const { error } = await supabase
        .from("pedidos")
        .update({
          pagamento_status: "pago",
        })
        .eq("id", pedidoId);

      if (error) {
        console.error("Erro ao atualizar pagamento:", error);
      } else {
        console.log("Pagamento confirmado:", pedidoId);
      }
    }
  }

  return NextResponse.json({
    received: true,
  });
}