"use client";
import { UserAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";

export default function Login() {
  const { googleSignIn } = UserAuth();

  const handleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center">
      <Button
        className="font-semibold capitalize flex gap-2 rounded-xl"
        onClick={handleSignIn}
      >
        <FcGoogle size={28} />
        sign in with google
      </Button>
    </div>
  );
}
