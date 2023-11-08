import { db } from "@/lib/firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  getDocs,
} from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const querySnapshot = await getDocs(collection(db, "Archives"));

    const docs = [];
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      docs.push(doc.data());
    });

    return NextResponse.json(docs);
  } catch (error) {
    return NextResponse.json({ error: "Failed to retrieve archives" }, 500);
  }
}

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
