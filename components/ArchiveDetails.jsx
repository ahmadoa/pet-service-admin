import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import ArchiveChatComponent from "./ArchiveChatComponent";

export default function ArchiveDetails({ orderId, userId }) {
  const [archive, setArchive] = useState({});
  const quantity = archive.Duration ? Number(archive.Duration) : 1;
  const date = new Date(archive.Date);
  const [defTab, setDefTab] = useState("details");

  const RetrieveArchive = () => {
    fetch(`/api/archive`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: orderId }),
    })
      .then((response) => response.json())
      .then((data) => {
        setArchive(data);
      });
  };

  useEffect(() => {
    if (orderId) {
      RetrieveArchive();
    }
  }, [orderId]);

  useEffect(() => {
    setDefTab("details");
  }, [archive]);

  return (
    <div className="w-full h-full px-5">
      {Object.keys(archive).length > 0 && archive ? (
        <Tabs
          defaultValue={defTab}
          value={defTab}
          onValueChange={(value) => setDefTab(value)}
          className="h-full w-full"
        >
          <div className="h-12 bg-secondary rounded-xl w-fit p-1 shadow-sm border-b-4 border-background">
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
                  <div className="font-semibold">{archive.name}</div>
                </div>
                <div className="flex gap-5">
                  <div>Dog's Breed:</div>
                  <div className="font-semibold">{archive.breed}</div>
                </div>
                {archive.Allergies === "None" ? (
                  <></>
                ) : (
                  <div className="flex gap-5">
                    <div>Allergies:</div>
                    <div className="font-semibold">{archive.Allergies}</div>
                  </div>
                )}
                <div className="flex gap-5">
                  <div>Service:</div>
                  <div className="font-semibold">{archive.Service}</div>
                </div>
                {archive.Service === "Boarding" ? (
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
                  <div className="font-semibold">{archive.SpecialRequest}</div>
                </div>
                <div className="flex gap-5">
                  <div>Payment Status:</div>
                  <div className="font-semibold">{archive.PaymentStatus}</div>
                </div>
                <div className="flex gap-5">
                  <div>Total Paid:</div>
                  <div className="font-semibold">
                    {archive.TotalPaid / 100} $
                  </div>
                </div>
              </div>
              {/** buttons section */}
              <div className="h-full w-full flex flex-col justify-between p-5 items-end">
                <div>
                  <div
                    className={`${
                      archive.Status === "On Process"
                        ? "bg-primary text-primary-foreground"
                        : "bg-green-600 text-white"
                    } font-semibold  py-2 px-3 w-fit rounded-xl `}
                  >
                    {archive.Status}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="messages" className="h-full">
            <ArchiveChatComponent
              userId={archive.userId}
              orderId={archive.orderId}
              AppointDate={archive.Date}
              status={archive.Status}
            />
          </TabsContent>
        </Tabs>
      ) : (
        <></>
      )}
    </div>
  );
}
