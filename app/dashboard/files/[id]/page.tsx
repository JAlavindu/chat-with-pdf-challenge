/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { auth } from "@clerk/nextjs/server";
import { adminDb } from "@/firebaseAdmin";
import PdfView from "@/components/PdfView";
import Chat from "@/components/Chat";

async function ChatToFilePage({ params: { id } }: { params: { id: string } }) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const ref = await adminDb
    .collection("users")
    .doc(userId)
    .collection("files")
    .doc(id)
    .get();

  const url = ref.data()?.downloadUrl;

  return (
    <div className="grid lg:grid-cols-5 h-full overflow-hidden">
      {/* Right*/}
      <div className="col-span-5 lg:col-span-2 overflow-y-auto">
        {/* chat*/}
        <Chat id={id} />
      </div>

      {/* Left*/}
      <div className="col-span-5 lg:col-span-3 bg-gray-100 border-r-2 lg:border-indigo-600 lg:-order-1 overlow-auto">
        {/* PDF view*/}
        <PdfView url={url} />
      </div>
    </div>
  );
}

export default ChatToFilePage;
