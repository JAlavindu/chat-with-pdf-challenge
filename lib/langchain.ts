/* eslint-disable @typescript-eslint/no-unused-vars */
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import pineconClient from "./pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { PineconeConflictError } from "@pinecone-database/pinecone/dist/errors";
import { Index, RecordMetadata } from "@pinecone-database/pinecone";
import { adminDb } from "@/firebaseAdmin";
import { auth } from "@clerk/nextjs/server";
import { split } from "postcss/lib/list";

const model = new ChatOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  modelName: "gpt-4o",
});

export const indexName = "default";

export async function generateDocs(docId: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  console.log("--- Fetching the download URL from Firebase...");
  const firebaseRef = await adminDb
    .collection("users")
    .doc(userId)
    .collection("files")
    .doc(docId)
    .get();

  if (!firebaseRef.exists) {
    throw new Error(`Document with ID ${docId} does not exist`);
  }

  const downloadUrl = firebaseRef.data()?.downloadUrl;

  if (!downloadUrl) {
    console.error(
      `Document data: ${JSON.stringify(firebaseRef.data(), null, 2)}`
    );
    throw new Error(
      "Download URL not found for this file. Please ensure it exists in Firestore."
    );
  }

  console.log(`--- Download URL fetched successfully... ${downloadUrl} ---`);

  // Fetch and process the PDF
  const response = await fetch(downloadUrl);
  const data = await response.blob();

  console.log("--- Loading the PDF document...");
  const loader = new PDFLoader(data);
  const docs = await loader.load();

  console.log("--- Splitting the PDF into individual pages...");
  const splitter = new RecursiveCharacterTextSplitter();

  const splitDocs = await splitter.splitDocuments(docs);
  console.log(`--- Split into ${splitDocs.length} parts...`);

  return splitDocs;
}

async function namespaceExists(
  index: Index<RecordMetadata>,
  namespace: string
) {
  if (namespace === null) throw new Error("No namespace value provided");
  const { namespaces } = await index.describeIndexStats();
  return namespaces?.[namespace] !== undefined;
}

export async function generateEmbeddingsInPineconeVectorStrore(docId: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  let pinconeVectorStore;

  console.log("---Generating embeddings...");
  const embeddings = new OpenAIEmbeddings();

  const index = await pineconClient.index(indexName);
  const namespaceAlreadyExists = await namespaceExists(index, userId);

  if (namespaceAlreadyExists) {
    console.log(
      `--- Namespace ${docId} already exists, reusing existing embeddings... ---`
    );

    pinconeVectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex: index,
      namespace: docId,
    });

    return pinconeVectorStore;
  } else {
    const splitDocs = await generateDocs(docId);

    console.log(
      `--- Storing the embeddings in namespace ${docId} in the ${indexName} pinecone vector store...`
    );

    pinconeVectorStore = await PineconeStore.fromDocuments(
      splitDocs,
      embeddings,
      {
        pineconeIndex: index,
        namespace: docId,
      }
    );
    return pinconeVectorStore;
  }
}
