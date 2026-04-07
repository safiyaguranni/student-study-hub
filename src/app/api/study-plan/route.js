import groq from "@/lib/groq";

export async function POST(request) {
  try {
    const { subjects, hoursPerDay, examDate, additionalNotes = "" } = await request.json();

    const chatCompletion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are an expert academic study planner. Create a detailed, personalized study plan for a student. The plan should be practical, balanced, and include breaks.

Return ONLY valid JSON in this exact format, no other text:
{
  "title": "Study Plan Title",
  "overview": "Brief overview of the plan",
  "totalDays": 10,
  "schedule": [
    {
      "day": 1,
      "date": "Day 1",
      "title": "Day title/focus",
      "tasks": [
        "Specific task 1 with time allocation",
        "Specific task 2 with time allocation"
      ],
      "tips": "Helpful tip for this day"
    }
  ],
  "generalTips": [
    "General study tip 1",
    "General study tip 2"
  ]
}

Rules:
- Be specific about what to study and for how long
- Include break times within the daily schedule
- Prioritize harder/weaker subjects during peak hours
- Include revision days before the exam
- Make the plan realistic and achievable
- account for the student's available hours`
        },
        {
          role: "user",
          content: `Create a study plan with these details:
Subjects: ${subjects}
Available hours per day: ${hoursPerDay}
Exam date: ${examDate}
${additionalNotes ? `Additional notes: ${additionalNotes}` : ''}`
        }
      ],
      temperature: 0.7,
      max_tokens: 4096,
      response_format: { type: "json_object" },
    });

    const content = chatCompletion.choices[0]?.message?.content;
    const planData = JSON.parse(content);

    return Response.json(planData);
  } catch (error) {
    console.error("Study Plan API error:", error);
    return Response.json(
      { error: "Failed to generate study plan. Please check your API key and try again." },
      { status: 500 }
    );
  }
}
