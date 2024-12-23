/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";
import { generateEmbeddingsInPineconeVectorStrore } from "@/lib/langchain";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function generateEmbeddings(docId: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  //turn a pdf into embeddings [0]
  await generateEmbeddingsInPineconeVectorStrore(docId);

  revalidatePath("/dashboard");

  return { success: true };
}
