import { db } from "@/lib/firebase";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const querySnapshot = await getDocs(collection(db, "Orders"));

    const docs = [];
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      docs.push(doc.data());
    });

    return NextResponse.json(docs);
  } catch (error) {
    return NextResponse.json({ error: "Failed to retrieve appointments" }, 500);
  }
}

export async function POST(req) {
  try {
    const data = await req.json();

    // update doc in users.orders
    const OrdersRef = doc(db, "users", data.userId, "Orders", data.orderId);

    await updateDoc(OrdersRef, {
      Status: data.status,
    });

    // update  doc in Orders collection in root
    const docRef = doc(db, "Orders", data.orderId);

    await updateDoc(docRef, {
      Status: data.status,
    });

    return NextResponse.json({ message: "Order updated successfully" });
  } catch (error) {
    console.log("Error updating order:", error);
    return NextResponse.json({ error: "Failed to update the order" }, 500);
  }
}
