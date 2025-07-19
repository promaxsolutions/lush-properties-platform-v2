import { Router } from "express";
import { z } from "zod";

const router = Router();

// Schema for AI chat requests
const aiChatSchema = z.object({
  prompt: z.string().min(1).max(1000),
});

// AI Chat endpoint - ready for OpenAI integration
router.post("/ai-chat", async (req, res) => {
  try {
    const { prompt } = aiChatSchema.parse(req.body);

    // TODO: Replace with actual OpenAI API integration
    // Example OpenAI integration:
    // const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    // const completion = await openai.chat.completions.create({
    //   model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    //   messages: [
    //     {
    //       role: "system",
    //       content: "You are a helpful project management assistant for construction projects. You have access to project data, uploads, and can help with claims, stages, and summaries."
    //     },
    //     {
    //       role: "user",
    //       content: prompt
    //     }
    //   ],
    //   max_tokens: 500
    // });
    // const reply = completion.choices[0].message.content;

    // Mock response for now - replace with OpenAI response
    let reply = "I'm here to help with your project management needs. ";
    
    if (prompt.toLowerCase().includes('upload')) {
      reply += "I can assist with document uploads and analysis.";
    } else if (prompt.toLowerCase().includes('claim')) {
      reply += "I can help generate progress claims for your projects.";
    } else if (prompt.toLowerCase().includes('summarize')) {
      reply += "I can analyze and summarize uploaded documents.";
    } else {
      reply += "Try asking about uploads, claims, or project summaries.";
    }

    res.json({ reply });
  } catch (error) {
    console.error("AI Chat error:", error);
    res.status(500).json({ error: "Failed to process AI request" });
  }
});

export { router as aiRoutes };