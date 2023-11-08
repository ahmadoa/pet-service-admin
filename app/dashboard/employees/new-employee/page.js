"use client";
import { Button } from "@/components/ui/button";
import { useDropzone } from "react-dropzone";
import { useState, useCallback, useEffect } from "react";
import { BiCloudUpload } from "react-icons/bi";
import { BsFillCalendarFill } from "react-icons/bs";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { auth, storage } from "@/lib/firebase";
import Spinner from "@/components/ui/spinner";
import Image from "next/image";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function NewEmployee() {
  const { toast } = useToast();
  const [spin, setSpin] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profession, setProfession] = useState("");
  const [birthdate, setBirthdate] = useState(new Date());
  const [hiringDate, setHiringDate] = useState(new Date());
  const [phoneNumber, setPhoneNumber] = useState("");
  const [city, setCity] = useState("");
 

  const onDrop = useCallback((acceptedFiles) => {
    setSpin(true);
    const file = acceptedFiles[0];
    const pictureRef = ref(storage, "employee/" + file.name);

    uploadBytesResumable(pictureRef, file).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((downloadURL) => {
        setDownloadUrl(downloadURL);
        setSpin(false);
      });
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".png"],
    },
  });

  var emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  var phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

  function generateUniqueId(length) {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let uniqueId = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      uniqueId += characters.charAt(randomIndex);
    }

    return uniqueId;
  }

  const [errors, setErrors] = useState({});

  const ValidateAndAdd = async () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = "Fullname is required";
    }

    if (!downloadUrl) {
      newErrors.photo = "Profile picture is required";
    }

    if (!email.match(emailRegex)) {
      newErrors.email = "Type in email with correct format";
    }

    if (!profession.trim()) {
      newErrors.profession = "profession is required";
    }

    if (!city.trim()) {
      newErrors.city = "Living City is required";
    }

    if (!phoneNumber.match(phoneRegex)) {
      newErrors.phoneNumber = "Phone number is required";
    }

    if (birthdate === new Date()) {
      newErrors.birthDate = "Birthdate is required";
    }

    setErrors(newErrors);

    const uniqueId = generateUniqueId(15);

    if (Object.keys(newErrors).length === 0) {
      // call to api to add data
      const response = await fetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: uniqueId,
          name: name,
          birthdate: birthdate.toISOString(),
          email: email,
          phonenumber: phoneNumber,
          profession: profession,
          profile: downloadUrl,
          city: city,
          hiringdate: hiringDate,
        }),
      });
      if (response.ok) {
        setName("");
        setProfession("");
        setCity("");
        setEmail("");
        setDownloadUrl("");
        setErrors({});
        setPhoneNumber("");
        setBirthdate(new Date());
        setHiringDate(new Date());

        console.log("added employee successfully!");
        toast({
          className: cn(
            "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
          ),
          title: "Added New Employee Successfully!",
          description: "A new employee was added successfully",
        });
      } else {
        console.log("failed to add employee!");
        toast({
          className: cn(
            "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
          ),
          title: "Failed To Add Employee!",
          description: "Adding a new employee failed",
        });
      }
    }
  };

  return (
    <form className="w-full h-full flex flex-col" action={ValidateAndAdd}>
      <div className="w-full flex items-center justify-between">
        <h1 className="text-lg font-semibold">Add New Employee</h1>
        <div className="flex gap-5">
          <Link
            href={"/dashboard/employees"}
            className="flex items-center justify-center outline outline-1 outline-secondary-foreground rounded-lg h-10 px-10 hover:bg-secondary font-medium transition-all"
          >
            Cancel
          </Link>
          <Button className="flex items-center gap-1 font-bold">
            Save Changes
          </Button>
        </div>
      </div>
      <div className="w-3/6 h-1 bg-primary/5 self-center my-5" />
      <div className="w-full h-full grid grid-cols-4 gap-5">
        <div className="col-span-1 flex flex-col gap-3">
          <h2 className="text-secondary-foreground">Profile Picture</h2>
          <div
            className={`w-full h-80 bg-transparent rounded-xl outline-dashed outline-secondary-foreground/70 cursor-pointer overflow-hidden`}
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            <div className="w-full h-full">
              <div className="w-full h-full">
                {downloadUrl === "" && !spin ? (
                  <div className="w-full h-full flex flex-col items-center justify-center ">
                    <BiCloudUpload size={50} className="fill-primary" />
                    <div className="text-sm font-medium text-center">
                      Drag & drop | click to select file
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full">
                    {spin ? (
                      <div className="w-full h-full flex items-center justify-center">
                        <Spinner />
                      </div>
                    ) : (
                      <Image
                        src={downloadUrl}
                        className="h-full w-full object-cover"
                        width={0}
                        height={0}
                        sizes="100vw"
                        alt="profile picture"
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          {errors.photo && (
            <p className="text-red-500 text-xs mt-1">{errors.photo}</p>
          )}
        </div>
        <div className="col-span-3 grid grid-cols-2 gap-x-10 p-10">
          {/** fullname */}
          <div className="flex flex-col">
            <label
              htmlFor="name"
              className="text-secondary-foreground font-semibold mb-2"
            >
              Fullname
            </label>
            <input
              className={` pl-2 h-10 rounded-lg bg-secondary outline outline-2 outline-secondary-foreground/50 focus:outline-2 focus:outline-primary focus:shadow-lg focus:shadow-primary/10 transition-all capitalize ${
                name.length > 0 ? "focus:outline-green-500" : ""
              }`}
              name="name"
              placeholder="Type in fullname..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>
          {/** birthdate */}
          <div className="flex flex-col">
            <label
              htmlFor="birth"
              className="text-secondary-foreground font-semibold mb-2"
            >
              Birthdate
            </label>
            <DatePicker
              showIcon
              icon={<BsFillCalendarFill className="fill-primary mt-1" />}
              className="h-10 w-full bg-secondary pl-2 text-center rounded-lg outline outline-2 outline-secondary-foreground/50 focus:outline-2 focus:outline-primary cursor-pointer"
              selected={birthdate}
              onChange={(date) => setBirthdate(date)}
              dateFormat="MMMM d, yyyy"
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
            />
            {errors.birthDate && (
              <p className="text-red-500 text-xs mt-1">{errors.birthDate}</p>
            )}
          </div>
          {/** email */}
          <div className="flex flex-col">
            <label
              htmlFor="email"
              className="text-secondary-foreground font-semibold mb-2"
            >
              Email
            </label>
            <input
              className={` pl-2 h-10 rounded-lg bg-secondary outline outline-2 outline-secondary-foreground/50 focus:outline-2 focus:outline-primary focus:shadow-lg focus:shadow-primary/10 transition-all ${
                name.length > 0 ? "focus:outline-green-500" : ""
              }`}
              type="email"
              name="email"
              placeholder="Type in email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>
          {/** phone number */}
          <div className="flex flex-col">
            <label
              htmlFor="number"
              className="text-secondary-foreground font-semibold mb-2"
            >
              Phone number
            </label>
            <input
              className={` pl-2 h-10 rounded-lg bg-secondary outline outline-2 outline-secondary-foreground/50 focus:outline-2 focus:outline-primary focus:shadow-lg focus:shadow-primary/10 transition-all ${
                phoneNumber.length > 0 ? "focus:outline-green-500" : ""
              }`}
              type="tel"
              name="number"
              placeholder="Type in phone number..."
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>
            )}
          </div>
          {/** profession */}
          <div className="flex flex-col">
            <label
              htmlFor="profession"
              className="text-secondary-foreground font-semibold mb-2"
            >
              Profession
            </label>
            <input
              className={` pl-2 h-10 rounded-lg bg-secondary outline outline-2 outline-secondary-foreground/50 focus:outline-2 focus:outline-primary focus:shadow-lg focus:shadow-primary/10 transition-all capitalize ${
                profession.length > 0 ? "focus:outline-green-500" : ""
              }`}
              name="profession"
              placeholder="Type in role / profession..."
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
            />
            {errors.profession && (
              <p className="text-red-500 text-xs mt-1">{errors.profession}</p>
            )}
          </div>
          {/** hiring date */}
          <div className="flex flex-col">
            <label
              htmlFor="hiring date"
              className="text-secondary-foreground font-semibold mb-2"
            >
              Hiring date
            </label>
            <DatePicker
              showIcon
              icon={<BsFillCalendarFill className="fill-primary mt-1" />}
              className="h-10 w-full bg-secondary pl-2 text-center rounded-lg outline outline-2 outline-secondary-foreground/50 focus:outline-2 focus:outline-primary cursor-pointer"
              selected={hiringDate}
              onChange={(date) => setHiringDate(date)}
              dateFormat="MMMM d, yyyy"
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
            />
          </div>
          {/** city */}
          <div className="flex flex-col">
            <label
              htmlFor="city"
              className="text-secondary-foreground font-semibold mb-2"
            >
              City
            </label>
            <input
              className={` pl-2 h-10 rounded-lg bg-secondary outline outline-2 outline-secondary-foreground/50 focus:outline-2 focus:outline-primary focus:shadow-lg focus:shadow-primary/10 transition-all ${
                city.length > 0 ? "focus:outline-green-500" : ""
              }`}
              name="city"
              placeholder="Type in city.."
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            {errors.city && (
              <p className="text-red-500 text-xs mt-1">{errors.city}</p>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
