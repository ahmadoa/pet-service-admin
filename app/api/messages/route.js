import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const data = await req.json();

    const MessagesRef = collection(
      db,
      "users",
      data.userId,
      "Orders",
      data.orderId,
      "Messages"
    );

    await addDoc(MessagesRef, {
      uid: data.uid,
      text: data.text,
      createdAt: serverTimestamp(),
    });

    // add to client/user notifs
    await addDoc(collection(db, "users", data.userId, "Notifications"), {
      type: "message",
      text: data.text,
      createdAt: serverTimestamp(),
      href: data.href,
    });

    return NextResponse.json({ message: "message sent successfully" });
  } catch (error) {
    console.log("Error sending message:", error);
    return NextResponse.json({ error: "Failed to send message" }, 500);
  }
}
