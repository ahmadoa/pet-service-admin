import Navbar from "@/components/Navbar";

export default function Layout({ children }) {
  return (
    <div className="h-full w-full grid grid-cols-6">
      <div className="h-full col-span-1">
        <Navbar />
      </div>

      <div className="overflow-hidden col-span-5 w-full h-full p-5">
        {children}
      </div>
    </div>
  );
}
