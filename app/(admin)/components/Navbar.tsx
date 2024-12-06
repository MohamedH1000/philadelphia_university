import Image from "next/image";
import React from "react";

const Navbar = () => {
  return (
    <header className="px-[150px] max-md:px-5 py-4 flex justify-between items-center h-[100px] border-b-[2px] shadow-md">
      <Image src={"/assets/Logo.png"} alt="logo" width={250} height={30} />
      <p className="text-4xl font-bold max-md:text-lg">الادارة الإلكترونية</p>
    </header>
  );
};

export default Navbar;
