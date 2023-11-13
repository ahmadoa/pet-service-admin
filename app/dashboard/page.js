"use client";
import { useEffect, useState } from "react";
import {
  AiOutlineCheckCircle,
  AiOutlineClockCircle,
  AiFillBank,
} from "react-icons/ai";
import { MdPayment } from "react-icons/md";
import { BsPersonCheck, BsArchive } from "react-icons/bs";
import Spinner from "@/components/ui/spinner";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [done, setDone] = useState(0);
  const [inProgress, setInProgress] = useState(0);

  const RetrieveAppointments = () => {
    fetch(`/api/appointments`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        const today = new Date();
        const todayDay = today.getDate();
        const todayMonth = today.getMonth() + 1;

        const filteredAppointments = data.filter((appointment) => {
          const appointmentDate = new Date(appointment.Date);
          const appointmentDay = appointmentDate.getDate();
          const appointmentMonth = appointmentDate.getMonth() + 1;

          return todayDay === appointmentDay && todayMonth === appointmentMonth;
        });

        setAppointments(filteredAppointments);
        console.log(filteredAppointments);

        filteredAppointments.map((appointment) => {
          if (appointment.Status === "Fulfilled") {
            setDone(done + 1);
          } else if (appointment.Status === "On Process") {
            setInProgress(inProgress + 1);
          }
        });
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching appointments:", error);
      });
  };

  useEffect(() => {
    RetrieveAppointments();
  }, []);

  const [balance, setBalance] = useState(0);

  const getBalance = () => {
    fetch(`/api/balance`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        setBalance(data.balance.available[0].amount / 100);
      });
  };

  const [activeCustomers, setActiveCustomers] = useState(0);

  const getActiveCustomers = () => {
    fetch(`/api/customersCount`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        setActiveCustomers(data.count);
      });
  };

  const [archivesCount, setArchivesCount] = useState(0);

  const getArchivesCount = () => {
    fetch(`/api/archivesCount`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        setArchivesCount(data.count);
      });
  };

  const [paymentsCount, setPaymentsCount] = useState(0);

  const getPaymentsCount = () => {
    fetch(`/api/payments`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        setPaymentsCount(data.count);
      });
  };

  useEffect(() => {
    getBalance();
    getActiveCustomers();
    getArchivesCount();
    getPaymentsCount();
  }, []);

  return (
    <div className="w-full h-full">
      {!isLoading ? (
        <>
          {" "}
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <div className="w-full py-5 h-[calc(100%-20px)] grid grid-rows-3 gap-5">
            <div className="w-full row-span-1 grid grid-cols-4 gap-5">
              <div className="bg-secondary rounded-xl flex flex-col items-center justify-center relative">
                <div className="text-lg text-secondary-foreground font-bold absolute top-1 left-3">
                  Total revenue
                </div>
                <AiFillBank size={45} className="fill-primary" />
                <span className="text-lg font-semibold text-secondary-foreground">
                  ${balance}
                </span>
              </div>
              <div className="bg-secondary rounded-xl flex flex-col items-center justify-center relative">
                <div className="text-lg text-secondary-foreground font-bold absolute top-1 left-3">
                  Active Clients
                </div>
                <BsPersonCheck size={45} className="fill-primary" />
                <span className="text-lg font-semibold text-secondary-foreground">
                  {activeCustomers}
                </span>
              </div>
              <div className="bg-secondary rounded-xl flex flex-col items-center justify-center relative">
                <div className="text-lg text-secondary-foreground font-bold absolute top-1 left-3">
                  Archives
                </div>
                <BsArchive size={43} className="fill-primary" />
                <span className="text-lg font-semibold text-secondary-foreground">
                  {archivesCount}
                </span>
              </div>
              <div className="bg-secondary rounded-xl flex flex-col items-center justify-center relative">
                <div className="text-lg text-secondary-foreground font-bold absolute top-1 left-3">
                  Payments
                </div>
                <MdPayment size={45} className="fill-primary" />
                <span className="text-lg font-semibold text-secondary-foreground">
                  {paymentsCount}
                </span>
              </div>
            </div>
            {appointments.length > 0 ? (
              <div className="w-full row-span-2 bg-secondary grid grid-rows-4 rounded-xl p-5 gap-4 overflow-hidden">
                <div className="row-span-1  flex justify-between items-center">
                  <div className="h-full flex flex-col justify-between">
                    <div className="font-bold text-2xl text-primary">
                      Today's Appointments
                    </div>
                    <div className="text-muted-foreground font-medium">
                      total: {appointments.length}
                    </div>
                  </div>
                  <div className="h-full flex gap-5 items-center">
                    <div className="h-full flex flex-col items-center justify-between">
                      <div className="font-bold text-2xl text-primary">
                        {done}
                      </div>
                      <div className="text-muted-foreground font-semibold text-lg">
                        Done
                      </div>
                    </div>
                    <div className="w-[1px] h-10 bg-secondary-foreground/50 rounded-full" />
                    <div className="h-full flex flex-col items-center justify-between">
                      <div className="font-bold text-2xl text-primary">
                        {inProgress}
                      </div>
                      <div className="text-muted-foreground text-lg font-semibold">
                        In progress
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row-span-3 grid grid-rows-6">
                  <div className="row-span-1 grid grid-cols-6 content-center border-y text-secondary-foreground border-secondary-foreground/30">
                    <div>Dog's name</div>
                    <div>Breed</div>
                    <div>Service</div>
                    <div>Duration</div>
                    <div>Start Time</div>
                    <div>Status</div>
                  </div>
                  <div className="row-span-5 flex flex-col gap-5 relative ">
                    <div className="absolute inset-0 overflow-auto">
                      <div className="flex flex-col pt-3 gap-5">
                        {appointments.map((appointment) => (
                          <Link
                            href={appointment.href}
                            className="grid grid-cols-6"
                          >
                            <div>{appointment.name}</div>
                            <div>{appointment.breed}</div>
                            <div>{appointment.Service}</div>
                            <div>
                              {appointment.Duration === 0
                                ? "-"
                                : appointment.Duration}
                            </div>
                            <div>
                              {new Date(appointment.Date).toLocaleTimeString(
                                window.navigator.language,
                                {
                                  hour: "numeric",
                                  minute: "2-digit",
                                }
                              )}
                            </div>
                            <div>
                              {appointment.Status === "Fulfilled" ? (
                                <div className="bg-green-300 flex items-center p-1 rounded-lg font-semibold gap-2 text-muted">
                                  <AiOutlineCheckCircle size={20} />
                                  <span>Fulfilled</span>
                                </div>
                              ) : (
                                <div className="bg-yellow-200 flex items-center p-1 rounded-lg font-semibold gap-2 text-muted">
                                  <AiOutlineClockCircle size={20} />
                                  <span>In Progress</span>
                                </div>
                              )}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full row-span-2 bg-secondary flex flex-col justify-center items-center">
                <div className="flex flex-col gap-3 items-center">
                  <div className="text-xl text-secondary-foreground font-bold">
                    No appointments today
                  </div>

                  <Link href="/dashboard/appointments">
                    <Button className="font-semibold">
                      See all appointments{" "}
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="h-full w-full flex items-center justify-center">
          <Spinner />
        </div>
      )}
    </div>
  );
}
