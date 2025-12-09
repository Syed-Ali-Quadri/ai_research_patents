import OpenAI from "openai";
import { z } from "zod";

// Graph schemas
const SCurveSchema = z.object({
    x: z.array(z.number()),
    y: z.array(z.number()),
    description: z.string(),
});

const HypeCurveSeriesSchema = z.object({
    name: z.string(),
    data: z.array(z.number()),
});

const HypeCurveSchema = z.object({
    x: z.array(z.number()),
    series: z.array(HypeCurveSeriesSchema),
    description: z.string(),
});

const InnovationUsageSchema = z.object({
    x: z.array(z.string()),
    y: z.array(z.number()),
    description: z.string(),
});

// Technology convergence
const TechnologyConvergenceSchema = z.object({
    technologies: z.array(z.string()),
    convergence_scores: z.array(z.number()),
    description: z.string(),
});

// Metadata
const MetadataSchema = z.object({
    source_documents: z.array(z.string()),
    filters_used: z.array(z.string()),
    timestamp: z.string(),
});

// Full response schema
export const AnalysisResponseSchema = z.object({
    generated_text: z.string(),
    
    graphs: z.object({
        s_curve: SCurveSchema,
        hype_curve: HypeCurveSchema,
        innovation_usage: InnovationUsageSchema,
    }),

    technology_convergence: TechnologyConvergenceSchema,

    summary: z.string(),
    metadata: MetadataSchema,
});

export type AnalysisResponse = z.infer<typeof AnalysisResponseSchema>;

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeQuery(query: string): Promise<AnalysisResponse> {
    try {
        const systemPrompt = `
You are an expert AI research analyst specializing in technology patents, innovation trends and convergence. 
Provide:
- generated_text (analysis)
- graphs (s_curve, hype_curve, innovation_usage)
- technology_convergence
- summary
- metadata

Graphs must be realistic JSON data, including x values, y or series, and descriptions.
`;

        const userPrompt = `
Analyze: "${query}"

Return JSON with:
- generated_text (3-4 paragraphs)
- graphs: s_curve, hype_curve, innovation_usage
- technology_convergence
- summary
- metadata

Graphs must be realistic data over time.
`;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
            ],
            response_format: {
                type: "json_schema",
                json_schema: {
                    name: "analysis_response",
                    strict: true,
                    schema: {
                        type: "object",
                        properties: {
                            generated_text: { type: "string" },

                            graphs: {
                                type: "object",
                                properties: {
                                    s_curve: {
                                        type: "object",
                                        properties: {
                                            x: { type: "array", items: { type: "number" } },
                                            y: { type: "array", items: { type: "number" } },
                                            description: { type: "string" }
                                        },
                                        required: ["x", "y", "description"],
                                        additionalProperties: false
                                    },
                                    hype_curve: {
                                        type: "object",
                                        properties: {
                                            x: { type: "array", items: { type: "number" } },
                                            series: {
                                                type: "array",
                                                items: {
                                                    type: "object",
                                                    properties: {
                                                        name: { type: "string" },
                                                        data: { type: "array", items: { type: "number" } }
                                                    },
                                                    required: ["name","data"],
                                                    additionalProperties: false
                                                }
                                            },
                                            description: { type: "string" }
                                        },
                                        required: ["x","series","description"],
                                        additionalProperties: false
                                    },
                                    innovation_usage: {
                                        type: "object",
                                        properties: {
                                            x: { type: "array", items: { type: "string" } },
                                            y: { type: "array", items: { type: "number" } },
                                            description: { type: "string" }
                                        },
                                        required: ["x","y","description"],
                                        additionalProperties: false
                                    }
                                },
                                required: ["s_curve","hype_curve","innovation_usage"],
                                additionalProperties: false
                            },

                            technology_convergence: {
                                type: "object",
                                properties: {
                                    technologies: { type: "array", items: { type: "string" } },
                                    convergence_scores: { type: "array", items: { type: "number" } },
                                    description: { type: "string" }
                                },
                                required: ["technologies","convergence_scores","description"],
                                additionalProperties: false
                            },

                            summary: { type: "string" },

                            metadata: {
                                type: "object",
                                properties: {
                                    source_documents: { type: "array", items: { type: "string" } },
                                    filters_used: { type: "array", items: { type: "string" } },
                                    timestamp: { type: "string" }
                                },
                                required: ["source_documents","filters_used","timestamp"],
                                additionalProperties: false
                            }
                        },
                        required: ["generated_text","graphs","technology_convergence","summary","metadata"],
                        additionalProperties: false
                    }
                }
            },
            temperature: 0.7,
            max_tokens: 2000,
        });

        const content = completion.choices[0].message.content;
        if (!content) throw new Error("No response");

        const parsed = JSON.parse(content);
        return AnalysisResponseSchema.parse(parsed);

    } catch (error) {
        console.error("Analysis Error:", error);
        return {
            generated_text: `Unable to analyze "${query}".`,
            graphs: {
                s_curve: { x:[], y:[], description:"" },
                hype_curve: { x:[], series:[], description:"" },
                innovation_usage: { x:[], y:[], description:"" },
            },
            technology_convergence: {
                technologies: [], convergence_scores: [], description: ""
            },
            summary: "Analysis unavailable.",
            metadata: {
                source_documents: [],
                filters_used: [],
                timestamp: new Date().toISOString(),
            },
        };
    }
}
