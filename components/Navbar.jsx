"use client";
import Image from "next/image";
import Logo from "@/public/logo.svg";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { BiSolidDashboard, BiLogOut } from "react-icons/bi";
import {
  BsFillCalendarCheckFill,
  BsArchiveFill,
  BsPeopleFill,
  BsBellFill,
} from "react-icons/bs";
import Link from "next/link";
import { Button } from "./ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { UserAuth } from "@/context/AuthContext";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import moment from "moment";

export default function Navbar() {
  const { logOut } = UserAuth();
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [popoverOpen, setPopoverOpen] = useState(false);

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

  const handleSignOut = async () => {
    try {
      await logOut();
    } catch (error) {
      console.log(error);
    }
  };

  // listening to notifications
  useEffect(() => {
    const q = query(collection(db, "Notifications"), orderBy("createdAt"));
    onSnapshot(q, (querySnapshot) => {
      const notificationDocs = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        data.id = doc.id;
        notificationDocs.push(data);
      });
      setNotifications(notificationDocs);
    });
  }, []);

  const handleNotifSeen = async (id) => {
    await deleteDoc(doc(db, "Notifications", id));
  };

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
      <div className="flex flex-col gap-3">
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger>
            <button className="p-2 text-sm font-medium text-secondary-foreground outline-1 outline outline-secondary-foreground rounded-xl flex gap-1 relative transition-all hover:bg-secondary">
              <div className="absolute w-5 h-5 -top-3 -right-2 flex items-center justify-center text-sm font-semibold text-primary-foreground p-2 bg-primary rounded-full">
                {notifications.length}
              </div>
              <BsBellFill size={19} className="fill-secondary-foreground" />
              <span>Notifications</span>
            </button>
          </PopoverTrigger>
          <PopoverContent
            className=" max-h-80 flex flex-col gap-3 p-3 overflow-y-scroll items-center justify-center"
            align="start"
          >
            {notifications.length > 0 ? (
              <>
                <div className="text-lg font-semibold">Notifications</div>
                <div className="flex flex-col gap-3">
                  {notifications.map((notif) => (
                    <Link
                      href={notif.href}
                      onClick={() => {
                        setPopoverOpen(false);
                        handleNotifSeen(notif.id);
                      }}
                      className="w-full p-2 flex gap-2 transition-all hover:bg-secondary-foreground/10 rounded-xl overflow-hidden whitespace-nowrap text-ellipsis"
                      key={notif.id}
                    >
                      {notif.type === "order" ? (
                        <>
                          <div className="w-10 h-10 shrink-0 rounded-full overflow-hidden">
                            <Image
                              src={notif.userpicture}
                              className="h-full w-full object-cover"
                              width={0}
                              height={0}
                              sizes="100vw"
                              alt="profile picture"
                            />
                          </div>
                          <div className=" flex flex-col justify-between text-sm">
                            <div className="w-48 text-secondary-foreground font-semibold overflow-hidden text-ellipsis">
                              {notif.username} placed an appointment
                            </div>
                            <div className="text-xs text-muted-foreground font-medium">
                              {moment(notif.createdAt.toDate()).calendar()}
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-10 h-10 shrink-0 rounded-full overflow-hidden">
                            <Image
                              src={notif.userpicture}
                              className="h-full w-full object-cover"
                              width={0}
                              height={0}
                              sizes="100vw"
                              alt="profile picture"
                            />
                          </div>
                          <div className=" flex flex-col gap-2 text-sm">
                            <div className="w-full text-secondary-foreground font-semibold text-ellipsis">
                              {notif.username} sent a message
                            </div>
                            <div className="w-48 px-2 py-1 outline outline-1 outline-muted-foreground rounded-lg overflow-hidden text-ellipsis">
                              {notif.text}
                            </div>
                            <div className="text-xs text-muted-foreground font-medium">
                              {moment(notif.createdAt.toDate()).calendar()}
                            </div>
                          </div>
                        </>
                      )}
                    </Link>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-muted-foreground text-sm capitalize">
                no notifications found!
              </div>
            )}
          </PopoverContent>
        </Popover>
        <Button
          className="w-full flex items-center gap-2 font-bold rounded-xl"
          onClick={handleSignOut}
        >
          <BiLogOut size={20} />
          <p>Log out</p>
        </Button>
      </div>
    </div>
  );
}
