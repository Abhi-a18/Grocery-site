import { Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import Navbar from "./components/Navbar";

function App() {

  const location = useLocation();
  const user = useSelector((state) => state.auth.user);

  const [searchItem, setSearchItem] = useState("");

  const hideNavbar =
    location.pathname === "/" || location.pathname === "/signup";

  return (
    <>
      {!hideNavbar && user && (
        <Navbar onSearch={setSearchItem} />
      )}
      
      <Outlet />
    </>
  );
}

export default App;