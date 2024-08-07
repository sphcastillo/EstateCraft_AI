// allows me to get access to embedding database
import { Pinecone } from "@pinecone-database/pinecone";

if(!process.env.PINECONE_API_KEY) {
    throw new Error("Pinecone API Key is not set");
};

const pineconeClient = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
});

export default pineconeClient;