import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const balance = await stripe.balance.retrieve();
    return NextResponse.json({ balance });
  } catch (error) {
    return NextResponse.json({ error: "Failed to retrieve balance" }, 500);
  }
}
