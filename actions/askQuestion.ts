/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";
import { adminDb } from "@/firebaseAdmin";
import { auth } from "@clerk/nextjs/server";
import { generateLangchainCompletion } from "@/lib/langchain";
import { Message } from "@/components/Chat";

const PRO_LIMIT = 2;
const FREE_LIMIT = 2;

export async function askQuestion(id: string, question: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const chatRef = await adminDb
    .collection("users")
    .doc(userId)
    .collection("files")
    .doc(id)
    .collection("chat");

  const chatSnapshot = await chatRef.get();
  const userMessages = chatSnapshot.docs.filter(
    (doc) => doc.data().user === "human"
  );

  const useRef = await adminDb.collection("users").doc(userId!).get();

  if (!useRef.data()?.hasActiveMembership) {
    if (userMessages.length >= FREE_LIMIT) {
      return {
        success: false,
        messages: `You'll need to upgrade to PRO to ask more than ${FREE_LIMIT} questions`,
      };
    }
  }

  //check if user is on PRO plan and has asked more than 100 questions
  if (useRef.data()?.hasActiveMembership) {
    if (userMessages.length >= PRO_LIMIT) {
      return {
        success: false,
        messages: `You've reached the limit of 100 questions for the month`,
      };
    }
  }

  const userMessage: Message = {
    role: "human",
    message: question,
    createdAt: new Date(),
  };

  await chatRef.add(userMessage);

  //generate AI response
  const reply = await generateLangchainCompletion(id, question);

  const aiMessage: Message = {
    role: "ai",
    message: reply,
    createdAt: new Date(),
  };

  await chatRef.add(aiMessage);

  return { success: true, messages: null };
}
