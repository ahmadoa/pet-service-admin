"use client";
import { UserAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import Link from "next/link";
import { HiScissors } from "react-icons/hi2";
import { FaDog } from "react-icons/fa";
import { GiDogHouse, GiJumpingDog } from "react-icons/gi";
import AppointmentDetails from "@/components/AppointmentDetails";
import { useRouter, useSearchParams } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

const Icons = {
  Grooming: HiScissors,
  Daycare: FaDog,
  Boarding: GiDogHouse,
  Training: GiJumpingDog,
};

export default function Appointment() {
  const router = useRouter();
  const params = useSearchParams();
  const [selectedAppointment, setSelectedAppointment] = useState(
    params.get("id") || ""
  );
  const [currUser, setCurrUser] = useState("");
  const [appointments, setAppointments] = useState([]);

  const [loading, setLoading] = useState(true);

  const checkUserStatus = () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoading(false);
        setCurrUser(user.uid);
      } else {
        router.push("/login");
      }
    });
  };

  const RetrieveAppointments = () => {
    fetch(`/api/appointments`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        setAppointments(data);
        console.log(data);
      });
  };

  useEffect(() => {
    checkUserStatus();
    if (loading === false) {
      RetrieveAppointments();
    }
  }, [loading]);

  const ServiceIcon = ({ serviceType }) => {
    if (serviceType in Icons) {
      const IconComponent = Icons[serviceType];
      return <IconComponent size={30} className="fill-orange-500" />;
    } else {
      return <div>Icon not found</div>;
    }
  };

  useEffect(() => {
    const id = params.get("id");
    setSelectedAppointment(id || "");
  }, [params]);

  return (
    <div className="w-full h-full grid grid-cols-12 gap-1">
      {appointments ? (
        <>
          <div className="h-full col-span-4">
            <div className="h-full flex flex-col gap-3">
              <div className="w-full h-12 flex items-center text-secondary-foreground text-lg bg-secondary rounded-xl font-bold p-5 shadow-sm">
                All Appointments
              </div>
              <div className="h-[calc(100vh-3.75rem)]  relative">
                <div className="absolute inset-0 overflow-auto disable-scrollbars">
                  <div className="flex flex-col gap-3">
                    {appointments.map((appointment) => (
                      <div
                        key={appointment.orderId}
                        className={`w-full h-[4.5rem] flex gap-2 ${
                          selectedAppointment === appointment.orderId
                            ? "bg-secondary-foreground/20"
                            : "bg-secondary"
                        } bg-secondary hover:bg-secondary-foreground/20 transition-all rounded-xl font-semibold p-2 shadow-sm relative cursor-pointer`}
                        onClick={() => {
                          router.push(
                            `/dashboard/appointments?id=${appointment.orderId}`,
                            {
                              shallow: true,
                            }
                          );
                          setSelectedAppointment(appointment.orderId);
                        }}
                      >
                        <div
                          className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 transition-all w-4/6 h-1 rounded-t-full ${
                            selectedAppointment === appointment.orderId
                              ? "bg-orange-500"
                              : "bg-secondary"
                          }`}
                        />
                        <div className="h-full w-16 bg-primary/10 rounded-xl flex justify-center items-center">
                          <ServiceIcon serviceType={appointment.Service} />
                        </div>
                        <div className="w-full flex flex-col justify-between py-1 pr-1">
                          <div className="flex gap-1 items-center justify-between">
                            <div className="flex items-center gap-1">
                              <div className="font-medium">
                                {appointment.Service}
                              </div>
                              <div className="text-sm font-medium text-muted-foreground">
                                - for {appointment.name}
                              </div>
                            </div>
                            <div className="text-orange-500">
                              {appointment.TotalPaid / 100} $
                            </div>
                          </div>
                          <div className="flex gap-1 items-center">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                appointment.Status === "Fulfilled"
                                  ? "bg-green-600"
                                  : "bg-primary"
                              } `}
                            />
                            <div
                              className={`${
                                appointment.Status === "Fulfilled"
                                  ? "text-green-600"
                                  : "text-primary"
                              } font-semibold text-sm uppercase`}
                            >
                              {appointment.Status}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="h-full col-span-8 pb-14">
            {selectedAppointment.length > 0 ? (
              <AppointmentDetails orderId={selectedAppointment} />
            ) : (
              <></>
            )}
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}
