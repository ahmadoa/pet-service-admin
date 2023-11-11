import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const payments = await stripe.balanceTransactions.list();
    const data = payments.data;
    const count = data.length;
    return NextResponse.json({ count });
  } catch (error) {
    return NextResponse.json({ error: "Failed to retrieve balance" }, 500);
  }
}
