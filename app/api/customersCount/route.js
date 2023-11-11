import { NextResponse } from "next/server";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function GET() {
  try {
    const usersCollectionRef = collection(db, "users");
    const querySnapshot = await getDocs(usersCollectionRef);

    let count = 0;

    await Promise.all(
      querySnapshot.docs.map(async (userDoc) => {
        const ordersQuery = query(collection(userDoc.ref, "Orders"));
        const ordersSnapshot = await getDocs(ordersQuery);

        const archivesQuery = query(collection(userDoc.ref, "Archives"));
        const archivesSnapshot = await getDocs(archivesQuery);

        if (ordersSnapshot.size > 0 || archivesSnapshot.size > 0) {
          count += 1;
        }
      })
    );
    return NextResponse.json({ count });
  } catch (error) {
    console.error("Error counting users with subcollections:", error);
    return NextResponse.json({ error: "Internal Server Error" }, 500);
  }
}
