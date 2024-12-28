/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import React from "react";
import { adminDb, adminStorage } from "@/firebaseAdmin";
import { indexName } from "@/lib/langchain";
import pineconClient from "@/lib/pinecone";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export default async function deleteDocument(docId: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  await adminDb
    .collection("users")
    .doc(userId)
    .collection("files")
    .doc(docId)
    .delete();
  await adminStorage
    .bucket(process.env.FIREBASE_STORAGE_BUCKET)
    .file(`users/${userId}/files/${docId}`)
    .delete();

  const index = await pineconClient.index(indexName);
  await index.namespace(docId).deleteAll();

  revalidatePath("/dashboard");
}
