"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { BsPlus } from "react-icons/bs";
import { FiMail, FiPhoneCall } from "react-icons/fi";
import { FaDeleteLeft } from "react-icons/fa6";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

export default function Employees() {
  const [employees, setEmployees] = useState([]);

  // Retrieve all employees
  const getEmployees = () => {
    fetch("/api/employees", {
      method: "GET",
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setEmployees(data);
      });
  };

  useEffect(() => {
    getEmployees();
  }, []);

  
  function formatDate(inputDate) {
    const date = new Date(inputDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  const { toast } = useToast();

  // Remove employee from database
  const removeEmploye = async (id) => {
    try {
      await deleteDoc(doc(db, "Employees", id));
      toast({
        className: cn(
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
        ),
        title: "Employee removed successfully",
        description: "Employee have been removed from database",
      });
    } catch (error) {
      toast({
        className: cn(
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
        ),
        title: "Employee removal Failed",
        description: "Removing employee from database failed",
      });
      console.log(error);
    }
  };

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
      <div className="w-full max-h-full flex flex-wrap gap-5 mt-5 overflow-y-scroll">
        {employees &&
          employees.map((employee) => (
            <div
              style={{ flex: "0 0 calc(33.33% - 20px)" }}
              className="h-[16.5rem] bg-secondary flex flex-col rounded-xl gap-4 p-3"
            >
              <div className="flex justify-between">
                <div className="flex gap-2">
                  <div className="w-16 h-16 rounded-full overflow-hidden">
                    <Image
                      src={employee.profile}
                      className="h-full w-full object-cover"
                      width={0}
                      height={0}
                      sizes="100vw"
                      alt="profile picture"
                    />
                  </div>
                  <div className="flex flex-col text-secondary-foreground">
                    <p className="text-lg font-semibold">{employee.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {employee.profession}
                    </p>
                  </div>
                </div>
                <div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button>
                        <FaDeleteLeft
                          size={26}
                          className="stroke-primary mt-2 hover:scale-110 transition-all cursor-pointer"
                        />
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Removing {employee.name}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Proceed on the removal of {employee.name} from the
                          list, if you want to continue click on Delete Employee
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => {
                            removeEmploye(employee.id);
                          }}
                        >
                          Delete Employee
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
              <div className="bg-background rounded-xl h-full flex flex-col justify-between p-4">
                <div className="flex justify-between">
                  <div className="flex flex-col gap-1">
                    <p className=" text-muted-foreground">Birthdate</p>
                    <p className="text-sm font-semibold">
                      {formatDate(employee.birthdate)}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className=" text-muted-foreground">Hired date</p>
                    <p className="text-sm font-semibold">
                      {formatDate(employee.hiringdate)}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex flex-row items-center gap-3">
                    <FiMail size={22} className="stroke-secondary-foreground" />
                    <p className="text-secondary-foreground">
                      {employee.email}
                    </p>
                  </div>
                  <div className="flex flex-row items-center gap-3">
                    <FiPhoneCall
                      size={20}
                      className="stroke-secondary-foreground"
                    />
                    <p className="text-secondary-foreground">
                      {employee.phonenumber}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
