import { db } from "@/lib/firebase";
import { collection, deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const data = await req.json();

    const docSnap = await getDoc(doc(db, "Orders", data.orderId));

    if (docSnap.exists()) {
      const data = docSnap.data();
      await setDoc(doc(db, "Archives", data.orderId), data);
      await deleteDoc(doc(db, "Orders", data.orderId));
    }
    return NextResponse.json({ message: "Archived successfully" });
  } catch (error) {
    console.log("Error archiving order:", error);
    return NextResponse.json({ error: "Failed to archive the order" }, 500);
  }
}
