"use client";
import Image from "next/image";
import Logo from "@/public/logo.svg";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { BiSolidDashboard, BiLogOut } from "react-icons/bi";
import {
  BsFillCalendarCheckFill,
  BsArchiveFill,
  BsPeopleFill,
} from "react-icons/bs";
import Link from "next/link";
import { Button } from "./ui/button";

export default function Navbar() {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const pathname = usePathname();

  const checkUserStatus = () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setLoading(false);
      } else {
        router.push("/login");
      }
    });
  };

  useEffect(() => {
    checkUserStatus();
  }, []);

  return (
    <div className="h-full w-full flex flex-col items-center justify-between px-5 py-6 border-r-2 border-primary/5">
      <div className="flex flex-col gap-10 items-center">
        <div className="flex gap-2 items-center">
          <Image src={Logo} className="rotate-[30deg] w-7" alt="logo" />
          <span className="text-xl text-primary font-semibold">Pawpal</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Image
            src={user.photoURL}
            width={80}
            height={90}
            className="rounded-full"
          />
          <p className="font-medium text-secondary-foreground">Pawpal Team</p>
        </div>
        <div className="flex flex-col gap-3">
          <Link
            href={"/dashboard"}
            className={`w-full px-4 py-2 text-center flex items-center gap-1 ${
              pathname === "/dashboard"
                ? "bg-secondary-foreground/20 text-secondary-foreground"
                : "text-secondary-foreground/70"
            }  rounded-xl transition-all hover:scale-105`}
          >
            <BiSolidDashboard
              size={24}
              className="fill-secondary-foreground "
            />
            <p>Dashboard</p>
          </Link>
          <Link
            href={"/dashboard/appointments"}
            className={`w-full px-4 py-2 text-center flex items-center gap-2 ${
              pathname === "/dashboard/appointments"
                ? "bg-secondary-foreground/20 text-secondary-foreground"
                : "text-secondary-foreground/70"
            } rounded-xl transition-all hover:scale-105`}
          >
            <BsFillCalendarCheckFill
              size={19}
              className="fill-secondary-foreground"
            />
            <p>Appointments</p>
          </Link>
          <Link
            href={"/dashboard/archives"}
            className={`w-full px-4 py-2 text-center flex items-center gap-2 ${
              pathname === "/dashboard/archives"
                ? "bg-secondary-foreground/20 text-secondary-foreground"
                : "text-secondary-foreground/70"
            } rounded-xl transition-all hover:scale-105`}
          >
            <BsArchiveFill size={19} className="fill-secondary-foreground" />
            <p>Archives</p>
          </Link>
          <Link
            href={"/dashboard/employees"}
            className={`w-full px-4 py-2 text-center flex items-center gap-2 ${
              pathname.startsWith("/dashboard/employees")
                ? "bg-secondary-foreground/20 text-secondary-foreground"
                : "text-secondary-foreground/70"
            } rounded-xl transition-all hover:scale-105`}
          >
            <BsPeopleFill size={19} className="fill-secondary-foreground" />
            <p>Employees</p>
          </Link>
        </div>
      </div>
      <div>
        <Button className="w-full flex items-center gap-2 font-bold rounded-xl">
          <BiLogOut size={20} />
          <p>Log out</p>
        </Button>
      </div>
    </div>
  );
}
