import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";

export default function AppointmentDetails({ orderId, userId }) {
  const [appointment, setAppointment] = useState({});
  const [disableCancel, setDisableCancel] = useState(false);
  const quantity = appointment.Duration ? Number(appointment.Duration) : 1;
  const date = new Date(appointment.Date);
  const [checked, setChecked] = useState(false);

  const RetrieveAppointment = () => {
    fetch(`/api/appointment?orderId=${orderId}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        setAppointment(data);
      });
  };

  useEffect(() => {
    if (orderId) {
      RetrieveAppointment();
    }
  }, [orderId]);

  useEffect(() => {
    if (appointment.Status === "On Process") {
      setChecked(false);
    } else {
      setChecked(true);
    }
  }, [appointment]);

  const currentDate = new Date();

  useEffect(() => {
    if (Object.keys(appointment).length > 0) {
      const appointmentDate = new Date(appointment.Date);
      const timeDifference = appointmentDate - currentDate;
      const hoursDifference = timeDifference / (1000 * 60 * 60);
      const isButtonDisabled = hoursDifference < 24;
      setDisableCancel(isButtonDisabled);
    }
  }, [appointment]);

  const handleUpdate = async () => {
    if (checked === true && appointment.Status === "On Process") {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "Fulfilled",
          orderId: appointment.orderId,
          userId: appointment.userId,
        }),
      });
      if (response.ok) {
        console.log("updated successfully!");
      } else {
        console.log("failed to update!");
      }
    } else if (checked === false && appointment.Status === "Fulfilled") {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "On Process",
          orderId: appointment.orderId,
          userId: appointment.userId,
        }),
      });
      if (response.ok) {
        console.log("updated successfully!");
      } else {
        console.log("failed to update!");
      }
    }
  };

  const handleArchive = async () => {
    const response = await fetch("/api/archives", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: appointment.orderId,
      }),
    });
    if (response.ok) {
      console.log("archived successfully!");
    } else {
      console.log("failed to archive!");
    }
  };

  return (
    <div className="w-full h-full px-5">
      {Object.keys(appointment).length > 0 && appointment ? (
        <Tabs defaultValue="details" className="h-full w-full">
          <div className="h-12 bg-secondary rounded-xl w-fit p-1 shadow-sm">
            <TabsList className="h-full w-fit flex gap-3 px-1 bg-transparent">
              <TabsTrigger value="details" className="h-full w-fit">
                Appointment details
              </TabsTrigger>
              <TabsTrigger value="messages" className="h-full w-fit">
                Messages
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent
            value="details"
            className="h-full bg-secondary rounded-xl"
          >
            <div className="h-full grid grid-cols-2">
              {/** details section */}
              <div className="h-full flex flex-col gap-3 p-5">
                <div className="flex gap-5  ">
                  <div>Dog's Name:</div>
                  <div className="font-semibold">{appointment.name}</div>
                </div>
                <div className="flex gap-5">
                  <div>Dog's Breed:</div>
                  <div className="font-semibold">{appointment.breed}</div>
                </div>
                {appointment.Allergies === "None" ? (
                  <></>
                ) : (
                  <div className="flex gap-5">
                    <div>Allergies:</div>
                    <div className="font-semibold">{appointment.Allergies}</div>
                  </div>
                )}
                <div className="flex gap-5">
                  <div>Service:</div>
                  <div className="font-semibold">{appointment.Service}</div>
                </div>
                {appointment.Service === "Boarding" ? (
                  <div className="flex gap-5">
                    <div>Duration:</div>
                    <div className="font-semibold">{quantity}</div>
                  </div>
                ) : (
                  <></>
                )}
                <div className="flex gap-5">
                  <div>Scheduled Date:</div>
                  <div className="font-semibold">{date.toDateString()}</div>
                </div>
                <div className="flex gap-5">
                  <div>Scheduled Time:</div>
                  <div className="font-semibold">
                    {date.toLocaleTimeString(window.navigator.language, {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
                <div className="flex gap-5">
                  <div>Special Requests:</div>
                  <div className="font-semibold">
                    {appointment.SpecialRequest}
                  </div>
                </div>
                <div className="flex gap-5">
                  <div>Payment Status:</div>
                  <div className="font-semibold">
                    {appointment.PaymentStatus}
                  </div>
                </div>
                <div className="flex gap-5">
                  <div>Total Paid:</div>
                  <div className="font-semibold">
                    {appointment.TotalPaid / 100} $
                  </div>
                </div>
                <div className="flex gap-5">
                  <div>Fulfilled:</div>
                  <Switch
                    checked={checked}
                    onCheckedChange={() => {
                      setChecked((prev) => !prev);
                    }}
                  />
                </div>
              </div>
              {/** buttons section */}
              <div className="h-full w-full flex flex-col justify-between p-5 items-end">
                <div>
                  <div
                    className={`${
                      appointment.Status === "On Process"
                        ? "bg-primary text-primary-foreground"
                        : "bg-green-600 text-white"
                    } font-semibold  py-2 px-3 w-fit rounded-xl `}
                  >
                    {appointment.Status}
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    disabled={
                      appointment.Status === "On Process" ? true : false
                    }
                    onClick={handleArchive}
                  >
                    Archive appointment
                  </Button>
                  <Button className="font-semibold" onClick={handleUpdate}>
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent
            value="messages"
            className="h-full bg-secondary rounded-xl p-5"
          >
            <div className="w-full h-full bg-no-repeat bg-cover rounded-2xl"></div>
          </TabsContent>
        </Tabs>
      ) : (
        <></>
      )}
    </div>
  );
}