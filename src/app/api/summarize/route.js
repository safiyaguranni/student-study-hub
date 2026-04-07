import hf from "@/lib/huggingface";

export async function POST(request) {
  try {
    const { text } = await request.json();

    if (!text || text.trim().length < 50) {
      return Response.json(
        { error: "Please provide at least 50 characters of text to summarize." },
        { status: 400 }
      );
    }

    // Use HuggingFace's summarization model
    const result = await hf.summarization({
      model: "facebook/bart-large-cnn",
      inputs: text.substring(0, 3000), // BART has input limits
      parameters: {
        max_length: 300,
        min_length: 50,
        do_sample: false,
      },
    });

    return Response.json({ summary: result.summary_text });
  } catch (error) {
    console.error("Summarize API error:", error);
    return Response.json(
      { error: "Failed to summarize text. Please check your HuggingFace API key and try again." },
      { status: 500 }
    );
  }
}
