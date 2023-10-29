import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BsPlus } from "react-icons/bs";

export default function Employees() {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="w-full flex items-center justify-between">
        <h1 className="text-lg font-semibold">Employee's List</h1>
        <Link href={"/dashboard/employees/new-employee"}>
          <Button className="flex items-center gap-1">
            <BsPlus size={26} className="outline-2" />
            <p className="font-bold">New Employee</p>
          </Button>
        </Link>
      </div>
    </div>
  );
}
