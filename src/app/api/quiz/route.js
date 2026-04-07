import groq from "@/lib/groq";

export async function POST(request) {
  try {
    const { topic, difficulty = "medium", count = 5 } = await request.json();

    const chatCompletion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are a quiz generator for students. Generate exactly ${count} multiple-choice questions about the given topic. Each question should have 4 options with only one correct answer.

Return ONLY valid JSON in this exact format, no other text:
{
  "questions": [
    {
      "question": "The question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Brief explanation of why this is correct",
      "difficulty": "${difficulty}"
    }
  ]
}

Rules:
- correctAnswer is the 0-based index of the correct option
- Make questions appropriate for the ${difficulty} difficulty level
- easy: basic recall and understanding
- medium: application and analysis
- hard: synthesis, evaluation, and tricky edge cases
- Questions should be educational and accurate
- Explanations should help students learn`
        },
        {
          role: "user",
          content: `Generate ${count} ${difficulty} difficulty quiz questions about: ${topic}`
        }
      ],
      temperature: 0.8,
      max_tokens: 4096,
      response_format: { type: "json_object" },
    });

    const content = chatCompletion.choices[0]?.message?.content;
    const quizData = JSON.parse(content);

    return Response.json(quizData);
  } catch (error) {
    console.error("Quiz API error:", error);
    return Response.json(
      { error: "Failed to generate quiz. Please check your API key and try again." },
      { status: 500 }
    );
  }
}
