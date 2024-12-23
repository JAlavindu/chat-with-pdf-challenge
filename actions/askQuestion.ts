/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";
import { adminDb } from "@/firebaseAdmin";
import { auth } from "@clerk/nextjs/server";
import { generateLangchainCompletion } from "@/lib/langchain";

const FREE_LIMIT = 3;
const PRO_LIMIT = 100;

type Message = {
  role: string;
  message: string;
  createdAt: Date;
};

export async function askQuestion(id: string, question: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const ref = await adminDb
    .collection("users")
    .doc(userId)
    .collection("files")
    .doc(id)
    .collection("chat");

  const chatSnapshot = await ref.get();
  const userMessages = chatSnapshot.docs.filter(
    (doc) => doc.data().user === "human"
  );

  const userMessage: Message = {
    role: "human",
    message: question,
    createdAt: new Date(),
  };

  await ref.add(userMessage);

  //generate AI response
  const reply = await generateLangchainCompletion(id, question);

  const aiMessage: Message = {
    role: "ai",
    message: reply,
    createdAt: new Date(),
  };

  await ref.add(aiMessage);

  return { success: true, messages: null };
}
