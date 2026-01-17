"use client"

export const dynamic = 'force-dynamic'

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageSquare, FileUp, Users } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ModeToggle } from "@/components/mode-toggle";

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="px-6 py-4 flex justify-between items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
            H
          </div>
          <span className="text-xl font-bold">{t.common.appName}</span>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ModeToggle />
          <Link href="/login">
            <Button variant="ghost">{t.common.login}</Button>
          </Link>
          <Link href="/login">
            <Button>{t.common.getStarted}</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="py-20 px-6 text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight leading-tight">
            {t.landing.heroTitle} <br className="hidden sm:block" /><span className="text-primary">{t.landing.heroHighlight}</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            {t.landing.heroDescription}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/login">
              <Button size="lg" className="h-12 px-8 text-base gap-2 w-full sm:w-auto shadow-lg hover:shadow-xl transition-all">
                {t.common.login} <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="https://github.com" target="_blank">
               <Button size="lg" variant="outline" className="h-12 px-8 text-base w-full sm:w-auto">
                 GitHub
               </Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-muted/50">
           <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-6">
              <FeatureCard 
                icon={MessageSquare}
                title={t.landing.features.chatbot.title}
                desc={t.landing.features.chatbot.description}
              />
              <FeatureCard 
                icon={FileUp}
                title={t.landing.features.resume.title}
                desc={t.landing.features.resume.description}
              />
              <FeatureCard 
                icon={Users}
                title={t.landing.features.dashboard.title}
                desc={t.landing.features.dashboard.description}
              />
           </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-muted-foreground text-sm border-t">
        {t.landing.footer}
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="bg-card p-6 rounded-xl shadow-sm border hover:shadow-md transition-all duration-300 hover:-translate-y-1">
      <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
    </div>
  )
}
