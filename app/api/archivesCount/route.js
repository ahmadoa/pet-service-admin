import { db } from "@/lib/firebase";
import { collection, getCountFromServer, getDocs } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const collectionRef = collection(db, "Archives");
    const snapshot = await getCountFromServer(collectionRef);
    const count = snapshot.data().count;

    return NextResponse.json({ count });
  } catch (error) {
    console.error("Error counting archives:", error);
    return NextResponse.json({ error: "Internal Server Error" }, 500);
  }
}
