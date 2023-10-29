"use client";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";

export default function NoAccess() {
  const router = useRouter();

  const checkUserStatus = () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/dashboard");
      }
    });
  };

  useEffect(() => {
    checkUserStatus();
  }, []);
  return (
    <div className="h-screen w-full flex flex-col justify-center items-center gap-1">
      <h1 className="text-2xl font-bold text-primary ">
        Whoops, Access Denied
      </h1>
      <p className="text-secondary-foreground/50">
        You don't have access to this Platform
      </p>
    </div>
  );
}
