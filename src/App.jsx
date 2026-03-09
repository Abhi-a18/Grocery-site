import React from "react";
import Navbar from "./components/Navbar";
import { Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";

function App() {

  const location = useLocation();
  const user = useSelector((state) => state.auth.user);

  const [searchItem, setSearchItem] = useState("");
  const hideNavbar = location.pathname === "/";

  return (
    <>
      {!hideNavbar && user && (
        <Navbar onSearch={setSearchItem} />
      )}

      <Outlet context={{ searchItem }} />
    </>
  );
}

export default App;