"use client";

import React from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { PlusCircleIcon } from "lucide-react";

function PlaceholderDocument() {
  const router = useRouter();

  const handleClick = () => {
    //check user if FREE tier and if they are over the file limit, push to upgrade page
    router.push("/dashboard/upload");
  };
  return (
    <Button
      onClick={handleClick}
      className="flex flex-col items-center justify-center w-64 h-80 rounded-xl bg-gray-200 drop-shadow-md text-gray-400"
    >
      <PlusCircleIcon className="h-16 w-16" />
      <p>Add a document</p>
    </Button>
  );
}

export default PlaceholderDocument;
