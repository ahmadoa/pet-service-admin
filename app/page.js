"use client";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";

export default function Home() {
  const router = useRouter();

  const checkUserStatus = () => {
    onAuthStateChanged(auth, (user) => {
      if (user.email === process.env.NEXT_PUBLIC_ALLOWED_EMAIL) {
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    });
  };

  useEffect(() => {
    checkUserStatus();
  }, []);

  return <></>;
}
