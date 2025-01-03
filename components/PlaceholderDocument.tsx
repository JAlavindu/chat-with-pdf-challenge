/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { FrownIcon, PlusCircleIcon } from "lucide-react";
import useSubscription from "../hooks/useSubscription";

function PlaceholderDocument() {
  const { isOverFileLimit } = useSubscription();
  const router = useRouter();

  const handleClick = () => {
    //check user if FREE tier and if they are over the file limit, push to upgrade page
    if (isOverFileLimit) {
      router.push("/dashboard/upgrade");
      return;
    } else {
      router.push("/dashboard/upload");
    }

    router.push("/dashboard/upload");
  };
  return (
    <Button
      onClick={handleClick}
      className="flex flex-col items-center justify-center w-64 h-80 rounded-xl bg-gray-200 drop-shadow-md text-gray-400"
    >
      {isOverFileLimit ? (
        <FrownIcon className="h-16 w-16" />
      ) : (
        <PlusCircleIcon className="h-16 w-16" />
      )}

      <p className="font-semibold">
        {isOverFileLimit ? "upgrade to add more documents" : "Add a document"}
      </p>
      <p>Add a document</p>
    </Button>
  );
}

export default PlaceholderDocument;
