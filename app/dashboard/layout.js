import Navbar from "@/components/Navbar";

export default function Layout({ children }) {
  return (
    <div className="h-screen w-full grid grid-cols-6">
      <div className="col-span-1">
        <Navbar />
      </div>

      <div className="col-span-5 w-full h-full p-5">{children}</div>
    </div>
  );
}
