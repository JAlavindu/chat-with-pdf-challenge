import React from "react";
import { auth } from "@clerk/nextjs/server";
import { adminDb } from "@/firebaseAdmin";
import PdfView from "@/components/PdfView";
import Chat from "@/components/Chat";

interface PageProps {
  params: {
    id: string;
  };
}

async function ChatToFilePage({ params }: PageProps) {
  const { id } = params;
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

  const data = ref.data() as { downloadUrl: string } | undefined;
  if (!data) {
    throw new Error("File not found");
  }

  return (
    <div className="grid lg:grid-cols-5 h-full overflow-hidden">
      <div className="col-span-5 lg:col-span-2 overflow-y-auto">
        <Chat id={id} />
      </div>
      <div className="col-span-5 lg:col-span-3 bg-gray-100 border-r-2 lg:border-indigo-600 lg:-order-1 overflow-auto">
        <PdfView url={data.downloadUrl} />
      </div>
    </div>
  );
}

export default ChatToFilePage;
