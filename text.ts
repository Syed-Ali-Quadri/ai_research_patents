// src/tools/searchParams.ts
import { z } from "zod";
import { MongoClient, Db, Collection } from "mongodb";

// ---------- Structured OUTPUT (your interface) ----------

export const SearchAPIResponseSchema = z.object({
    generated_text: z.string(),
    graphs: z.object({
        s_curve: z.object({
            x: z.array(z.number()),
            y: z.array(z.number()),
            description: z.string(),
        }),
        hype_curve: z.object({
            x: z.array(z.number()),
            series: z.array(
                z.object({
                    name: z.string(),
                    data: z.array(z.number()),
                })
            ),
            description: z.string(),
        }),
        innovation_usage: z.object({
            x: z.array(z.string()),
            y: z.array(z.number()),
            description: z.string(),
        }),
        technology_convergence: z.object({
            technologies: z.array(z.string()),
            convergence_scores: z.array(z.number()),
            description: z.string(),
        }),
    }),
    summary: z.string(),
    metadata: z.object({
        source_documents: z.array(z.string()),
        filters_used: z.array(z.string()),
        timestamp: z.string(), // ISO-8601
    }),
});

export type SearchAPIResponse = z.infer<typeof SearchAPIResponseSchema>;

// ---------- INPUT to searchParams tool ----------

export const SearchParamsInputSchema = z.object({
    query: z.string().min(1, "query is required"),
    /**
     * Optional text tags for extra filtering (you can pipe these into Mongo).
     * Example: ["year:>=2020", "region:US"]
     */
    filters: z.array(z.string()).optional(),
    /**
     * Max docs to fetch from DB(s).
     */
    limit: z.number().int().min(1).max(200).default(50),
});

export type SearchParamsInput = z.infer<typeof SearchParamsInputSchema>;

// ---------- MongoDB helpers ----------

const MONGO_URI = process.env.MONGODB_URI;
const MONGO_DB_NAME = process.env.MONGODB_DB_NAME ?? "patents_db";

if (!MONGO_URI) {
    throw new Error("MONGODB_URI is not set");
}

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

async function getDb(): Promise<Db> {
    if (cachedDb) return cachedDb;
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    cachedClient = client;
    cachedDb = client.db(MONGO_DB_NAME);
    return cachedDb;
}

async function getCollections() {
    const db = await getDb();
    const adcCol = db.collection("adc_patents");
    const icCol = db.collection("ic_patents");
    return { adcCol, icCol };
}
