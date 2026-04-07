import Link from "next/link";

const features = [
  {
    href: "/chat",
    icon: "🤖",
    title: "AI Chat Tutor",
    description:
      "Ask any academic question and get detailed, patient explanations powered by AI.",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  {
    href: "/quiz",
    icon: "📝",
    title: "Quiz Generator",
    description:
      "Generate custom quizzes on any topic with instant feedback and explanations.",
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  },
  {
    href: "/study-plan",
    icon: "📅",
    title: "Study Planner",
    description:
      "Get a personalized day-by-day study schedule tailored to your exams and availability.",
    gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  },
  {
    href: "/summarize",
    icon: "📄",
    title: "Notes Summarizer",
    description:
      "Paste your notes or text and get a concise, AI-generated summary in seconds.",
    gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  },
  {
    href: "/notes",
    icon: "📁",
    title: "My Notes",
    description:
      "Upload and manage your study materials — PDFs, docs, images — all in one place.",
    gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  },
];

const stats = [
  { label: "AI Models", value: "2+", icon: "🧠" },
  { label: "Features", value: "5", icon: "⚡" },
  { label: "Free Tier", value: "100%", icon: "🎉" },
  { label: "Storage", value: "Cloud", icon: "☁️" },
];

export default function DashboardPage() {
  return (
    <>
      <div className="welcome-hero">
        <h1>Welcome to AI Student Coach 🎓</h1>
        <p>
          Your intelligent study companion powered by Groq & Hugging Face.
          Chat with AI, generate quizzes, plan your studies, summarize notes,
          and store your files — all for free.
        </p>
      </div>

      <div className="stats-row">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card">
            <p className="stat-card-label">
              {stat.icon} {stat.label}
            </p>
            <p className="stat-card-value">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="page-header">
        <h2 className="page-title">Explore Features</h2>
        <p className="page-subtitle">
          Choose a tool below to supercharge your learning
        </p>
      </div>

      <div className="dashboard-grid">
        {features.map((feature) => (
          <Link
            key={feature.href}
            href={feature.href}
            className="dashboard-card"
            id={`feature-${feature.href.replace("/", "")}`}
          >
            <div className="card">
              <div
                className="card-icon"
                style={{ background: feature.gradient }}
              >
                {feature.icon}
              </div>
              <h3 className="card-title">{feature.title}</h3>
              <p className="card-description">{feature.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
