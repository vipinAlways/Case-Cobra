import { db } from "@/db";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import ThankYouEmail from "@/app/components/Email/ThankYouEmail";
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = headers().get("stripe-signature");

    if (!signature) {
      return new Response("Invalide signature", { status: 400 });
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SINGING_SECRET!
    );

    if (event.type === "checkout.session.completed") {
      if (!event.data.object.customer_details?.email) {
        throw new Error("Missing user Email");
      }

      const session = event.data.object as Stripe.Checkout.Session;

      const { userId, orderId } = session.metadata || {
        userId: null,
        orderId: null,
      };

      if (!userId || !orderId) {
        throw new Error("Invalid request metaData");
      }

      const billingAddress = session.customer_details!.address;
      const shipingAddress = session.customer_details!.address;

      const updatedOrder = await db.order.update({
        where: {
          id: orderId,
        },
        data: {
          isPaid: true,
          ShippingAddress: {
            create: {
              name: session.customer_details!.name!,
              city: shipingAddress!.city!,
              country: shipingAddress!.country!,
              postalCode: shipingAddress!.postal_code!,
              street: shipingAddress!.line1!,
              state: shipingAddress!.state!,
            },
          },
          BillingAddress: {
            create: {
              name: session.customer_details!.name!,
              city: billingAddress!.city!,
              country: billingAddress!.country!,
              postalCode: billingAddress!.postal_code!,
              street: billingAddress!.line1!,
              state: billingAddress!.state!,
            },
          },
        },
      });

      await resend.emails.send({
        from: "CaseCobra <onboarding@resend.dev>",
        to: [event.data.object.customer_details.email],
        subject: "Thanks of your order!",
        react: ThankYouEmail({
          orderId,
          orderDate: updatedOrder.createdAt.toLocaleDateString(),
          //@ts-ignore
          shippingAddress: {
            name: session.customer_details!.name!,
            city: shipingAddress!.city!,
            country: shipingAddress!.country!,
            postalCode: shipingAddress!.postal_code!,
            street: shipingAddress!.line1!,
            state: shipingAddress!.state!,
          },
        }),
      });
    }
    return NextResponse.json({ result: event, ok: true });
  } catch (error) {
    console.error("Error in webHook route working", error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
