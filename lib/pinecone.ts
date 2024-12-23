/* eslint-disable @typescript-eslint/no-unused-vars */
import { Pinecone } from "@pinecone-database/pinecone";

if (!process.env.PINECONE_API_KEY) {
  throw new Error("Pinecone API key is required");
}

const pineconClient = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

export default pineconClient;
