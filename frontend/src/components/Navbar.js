import React from "react";

export default function Navbar() {
  return (
    <nav
      className="flex justify-between items-center h-16 bg-white text-black relative shadow-sm font-mono"
      role="navigation"
    >
      <div className="pl-8">GPTZero x RichieRich</div>
      <div className="pr-8">Links</div>
    </nav>
  );
}
