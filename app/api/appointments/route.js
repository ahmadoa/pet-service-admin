import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
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

    if (data.status === "Fulfilled") {
      // add notification to user
      await addDoc(collection(db, "users", data.userId, "Notifications"), {
        type: "fulfilled",
        createdAt: serverTimestamp(),
        href: data.href,
      });

      // get order for Orders collection
      const orderSnapshot = await getDoc(docRef);
      const orderData = orderSnapshot.data();

      // save order data in Archives collection
      await setDoc(doc(db, "Archives", data.orderId), orderData);

      // get messages docs from Messages collection of specific user
      const messagesQuerySnapshot = await getDocs(
        collection(db, "users", data.userId, "Orders", data.orderId, "Messages")
      );

      // save messages docs in Archives collection under the order id
      messagesQuerySnapshot.forEach(async (messageDoc) => {
        await setDoc(
          doc(db, "Archives", data.orderId, "Messages", messageDoc.id),
          messageDoc.data()
        );
      });
    }

    return NextResponse.json({ message: "Order updated successfully" });
  } catch (error) {
    console.log("Error updating order:", error);
    return NextResponse.json({ error: "Failed to update the order" }, 500);
  }
}
