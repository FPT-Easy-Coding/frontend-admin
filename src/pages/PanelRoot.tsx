// import { Outlet } from "react-router-dom";
import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";

function PanelRoot() {
  return (
    <>
      <Navbar />
      <main className="w-[calc(100%-80px)] ml-[80px] mt-[60px]">
        <div className="w-11/12 mx-auto">
          <Outlet />
        </div>
      </main>
    </>
  );
}

export default PanelRoot;
