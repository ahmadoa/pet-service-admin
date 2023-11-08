"use client";
import Navbar from "@/components/Navbar";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Spinner from "@/components/ui/spinner";

export default function Layout({ children }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // check user
  const checkUserStatus = () => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login");
      } else {
        setIsLoading(false);
      }
    });
  };

  useEffect(() => {
    checkUserStatus();
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="h-full w-full grid grid-cols-6">
      <div className="h-full col-span-1">
        <Navbar />
      </div>

      <div className="overflow-hidden col-span-5 w-full h-full p-5">
        {children}
      </div>
    </div>
  );
}
