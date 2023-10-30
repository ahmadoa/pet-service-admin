import { db } from "@/lib/firebase";
import { doc, getDocs, setDoc, collection } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const data = await req.json();

    const EmployeeRef = doc(db, "Employees", data.id);

    await setDoc(EmployeeRef, data);

    return NextResponse.json({ message: "added employee successfully" });
  } catch (error) {
    console.log("Error adding employee:", error);
    return NextResponse.json({ error: "Failed to add employe" }, 500);
  }
}

export async function GET(req) {
  try {
    const teamDocsSnap = await getDocs(collection(db, "Employees"));

    const docs = [];
    teamDocsSnap.forEach((doc) => {
      docs.push(doc.data());
    });

    return NextResponse.json(docs);
  } catch (error) {
    return NextResponse.json({ error: "Failed to retrieve team" }, 500);
  }
}
