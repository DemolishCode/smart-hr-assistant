import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="px-6 py-4 flex justify-between items-center border-b">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
            H
          </div>
          <span className="text-xl font-bold text-gray-900">Smart HR</span>
        </div>
        <div className="flex gap-4">
          <Link href="/login">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link href="/login">
            <Button>Get Started</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="py-20 px-6 text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
            Transform Your HR Operations with <span className="text-blue-600">AI Intelligence</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Automate resume parsing, get instant answers to policy questions, and manage your workforce efficiently with our next-generation HR assistant.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/login">
              <Button size="lg" className="h-12 px-8 text-lg gap-2">
                Launch Assistant <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="https://github.com/yourusername/smart-hr-assistant" target="_blank">
               <Button size="lg" variant="outline" className="h-12 px-8 text-lg">
                 View on GitHub
               </Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gray-50">
           <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">
              <FeatureCard 
                title="AI Policy Chatbot" 
                desc="Instantly answers employee questions about leave, benefits, and company policies using advanced RAG technology."
              />
              <FeatureCard 
                title="Smart Resume Parsing" 
                desc="Upload PDF resumes and let AI automatically extract skills, experience, and candidate details in seconds."
              />
              <FeatureCard 
                title="Employee Dashboard" 
                desc="Centralized view of your workforce with role-based access control and real-time data management."
              />
           </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-500 text-sm border-t">
        © 2024 Smart HR Assistant. Powered by Next.js & FastAPI.
      </footer>
    </div>
  );
}

function FeatureCard({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
      <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-6">
        <CheckCircle2 className="h-6 w-6" />
      </div>
      <h3 className="text-xl font-bold mb-3 text-gray-900">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{desc}</p>
    </div>
  )
}
