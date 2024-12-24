/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import PlaceholderDocument from "./PlaceholderDocument";
import Document from "./Document"; // Adjust the import path as necessary
import { auth } from "@clerk/nextjs/server";
import { adminDb } from "../firebaseAdmin"; // Adjust the import path as necessary

async function Documents() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const documentsSnapshot = await adminDb
    .collection("users")
    .doc(userId)
    .collection("files")
    .get();

  return (
    <div className="flex flex-wrap p-5 bg-gray-100 justify-center lg:justify-start rounded-sm gap-5 max-w-7xl mx-auto">
      {/*map through my docs*/}
      {documentsSnapshot.docs.map((doc) => {
        const { name, downloadUrl, size } = doc.data();

        return (
          <Document
            key={doc.id}
            id={doc.id}
            name={name}
            size={size}
            downloadUrl={downloadUrl}
          />
        );
      })}
      <PlaceholderDocument />
    </div>
  );
}

export default Documents;
