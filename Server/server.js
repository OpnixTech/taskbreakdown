const express = require("express");
const cors = require("cors");
require("dotenv").config();

console.log("Gemini key loaded:", process.env.GEMINI_API_KEY ? "YES" : "NO");
const { GoogleGenAI } = require("@google/genai");

const app = express();

app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.post("/api/breakdown", async (req, res) => {
  try {
    const { projectName, projectDescription, detail } = req.body;

    if (!projectName) {
      return res.status(400).json({
        error: "Project name is required.",
      });
    }

    const prompt = `
You are an expert project manager.

Break down the following project into practical, actionable tasks.

Project Name:
${projectName}

Project Description:
${projectDescription || "No description provided."}

Breakdown Detail:
${detail || "detailed"}

Rules:

1. Generate tasks specifically for THIS project.
2. Do not give generic tasks unless they genuinely apply.
3. Generate between 6 and 15 tasks.
4. Each task must be clear and actionable.
5. Assign one category:
   Planning
   Design
   Development
   Testing
   Documentation
   Launch

6. Assign priority:
   High
   Medium
   Low

7. Return ONLY the task data.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",

      contents: prompt,

      config: {
        responseMimeType: "application/json",

        responseSchema: {
          type: "array",

          items: {
            type: "object",

            properties: {
              name: {
                type: "string",
              },

              category: {
                type: "string",
              },

              priority: {
                type: "string",
              },
            },

            required: ["name", "category", "priority"],
          },
        },
      },
    });

    const tasks = JSON.parse(response.text);

    res.json({
      success: true,
      tasks: tasks,
    });
  } catch (error) {
    console.error("=================================");
    console.error("GEMINI AI ERROR");
    console.error("=================================");
    console.error(error);
    console.error("=================================");

    res.status(500).json({
      success: false,
      error: error.message || "Failed to generate AI breakdown.",
    });
  }
});
app.get("/", (req, res) => {
  res.send("TaskBreak AI Backend is running!");
});
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`TaskBreak AI server running on http://localhost:${PORT}`);
});
