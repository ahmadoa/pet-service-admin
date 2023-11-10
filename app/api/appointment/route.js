import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const data = await req.json();
    const order_id = data.orderId;

    const docSnap = await getDoc(doc(db, "Orders", order_id));

    if (docSnap.exists()) {
      console.log(docSnap.data());
      return NextResponse.json(docSnap.data());
    } else {
      return NextResponse.json({});
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to retrieve appointment" }, 500);
  }
}
