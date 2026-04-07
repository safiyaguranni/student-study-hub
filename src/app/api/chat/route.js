import groq from "@/lib/groq";

export async function POST(request) {
  try {
    const { messages } = await request.json();

    const chatCompletion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are an expert AI tutor for students. Your goal is to help students learn and understand concepts deeply. Follow these guidelines:
- Explain concepts clearly with examples
- Break down complex topics into simpler parts
- Use analogies and real-world connections
- Encourage critical thinking by asking follow-up questions
- Be patient, supportive, and encouraging
- If a student is struggling, try a different approach
- Use markdown formatting for better readability when helpful
- Keep responses focused and informative`
        },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 2048,
    });

    const reply = chatCompletion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response. Please try again.";

    return Response.json({ reply });
  } catch (error) {
    console.error("Chat API error:", error);
    return Response.json(
      { error: "Failed to generate response. Please check your API key." },
      { status: 500 }
    );
  }
}
