import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const data = await req.json();

    const EmployeeRef = doc(db, "Employees", data.name);

    await setDoc(EmployeeRef, data);

    return NextResponse.json({ message: "added employee successfully" });
  } catch (error) {
    console.log("Error adding employee:", error);
    return NextResponse.json({ error: "Failed to add employe" }, 500);
  }
}
