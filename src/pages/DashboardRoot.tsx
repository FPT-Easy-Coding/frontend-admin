// import { Outlet } from "react-router-dom";
import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";

function PanelRoot() {
  return (
    <>
      <Navbar />
      <main className="w-[calc(100%-100px)] ml-[100px] mt-[60px]">
        <Outlet />
      </main>
    </>
  );
}

export default PanelRoot;
