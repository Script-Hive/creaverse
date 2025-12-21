import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Vote, 
  Users, 
  Trophy, 
  Sparkles, 
  ArrowRight,
  Zap,
  Shield,
  Globe,
  ChevronRight,
  Star
} from "lucide-react";
import { useTranslateTexts } from "@/components/ui/translatable-text";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Creation",
    description: "Generate content, refine prompts, and build projects with intelligent AI assistance.",
    color: "primary",
  },
  {
    icon: Vote,
    title: "DAO Governance",
    description: "Propose ideas, vote on decisions, and shape the future of our creative ecosystem.",
    color: "secondary",
  },
  {
    icon: Users,
    title: "Community Hub",
    description: "Connect with creators, share your work, and collaborate on groundbreaking projects.",
    color: "accent",
  },
  {
    icon: Trophy,
    title: "Earn Rewards",
    description: "Get recognized for your contributions with reputation points, badges, and rewards.",
    color: "success",
  },
];

const stats = [
  { value: "10K+", label: "Active Members" },
  { value: "500+", label: "Proposals Passed" },
  { value: "$2M+", label: "Treasury Value" },
  { value: "1K+", label: "Projects Created" },
];

export default function Landing() {
  // All texts to translate
  const textsToTranslate = useMemo(() => [
    "Features", "Community", "Governance", "Sign In", "Launch App",
    "AI + DAO + Creative Community",
    "Create. Govern.", "Build the Future.",
    "Join the decentralized creative ecosystem where AI accelerates your ideas, community shapes decisions, and contributions are rewarded.",
    "Enter Creaverse", "Explore Governance",
    "Active Members", "Proposals Passed", "Treasury Value", "Projects Created",
    "Everything You Need to", "Create & Govern",
    "A complete ecosystem for creators, innovators, and community builders.",
    "AI-Powered Creation", "Generate content, refine prompts, and build projects with intelligent AI assistance.",
    "DAO Governance", "Propose ideas, vote on decisions, and shape the future of our creative ecosystem.",
    "Community Hub", "Connect with creators, share your work, and collaborate on groundbreaking projects.",
    "Earn Rewards", "Get recognized for your contributions with reputation points, badges, and rewards.",
    "AI-Powered", "Create with", "AI Assistance",
    "Our intelligent AI tools help you generate content, craft perfect prompts, and guide you through complex projects step by step.",
    "Text Generation for proposals, docs & content",
    "Prompt Assistant to optimize your AI queries",
    "Project Co-pilot for guided creation",
    "Image Prompt Generator for visual concepts",
    "Try AI Tools", "You",
    "Help me write a proposal for community events",
    "I'll help you craft a compelling proposal. Let's start with your goals...",
    "Powered by Advanced AI",
    "Ready to Join the", "Creative Revolution",
    "Be part of a community that's redefining how creators collaborate, govern, and build together.",
    "Get Started Now",
    "All rights reserved.", "Discord", "Twitter", "GitHub",
  ], []);

  const { t } = useTranslateTexts(textsToTranslate);

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center glow-primary">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">Creaverse DAO</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t("Features")}</a>
            <a href="#community" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t("Community")}</a>
            <a href="#governance" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t("Governance")}</a>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/auth">
              <Button variant="ghost" size="sm">{t("Sign In")}</Button>
            </Link>
            <Link to="/feed">
              <Button variant="glow" size="sm">{t("Launch App")}</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 bg-gradient-hero">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-soft" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl" />
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <Badge variant="glow" className="mb-6 fade-in-up">
              <Zap className="w-3 h-3 mr-1" />
              {t("AI + DAO + Creative Community")}
            </Badge>

            {/* Headline */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 fade-in-up stagger-1">
              {t("Create. Govern.")}
              <span className="block text-gradient-primary">{t("Build the Future.")}</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 fade-in-up stagger-2">
              {t("Join the decentralized creative ecosystem where AI accelerates your ideas, community shapes decisions, and contributions are rewarded.")}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 fade-in-up stagger-3">
              <Link to="/feed">
                <Button variant="hero" size="xl">
                  {t("Enter Creaverse")}
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/governance">
                <Button variant="hero-outline" size="xl">
                  {t("Explore Governance")}
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 fade-in-up stagger-4">
              {stats.map((stat, index) => (
                <div key={index} className="text-center p-4">
                  <p className="text-3xl md:text-4xl font-bold text-gradient-primary">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{t(stat.label)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">{t("Features")}</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t("Everything You Need to")} <span className="text-gradient-primary">{t("Create & Govern")}</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("A complete ecosystem for creators, innovators, and community builders.")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index}
                  className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1"
                >
                  <div className={`w-12 h-12 rounded-xl bg-${feature.color}/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6 text-${feature.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{t(feature.title)}</h3>
                  <p className="text-sm text-muted-foreground">{t(feature.description)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* AI Tools Showcase */}
      <section className="py-20 md:py-32 bg-muted/30 relative overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-30" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="glow" className="mb-4">
                <Brain className="w-3 h-3 mr-1" />
                {t("AI-Powered")}
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                {t("Create with")} <span className="text-gradient-primary">{t("AI Assistance")}</span>
              </h2>
              <p className="text-muted-foreground mb-8">
                {t("Our intelligent AI tools help you generate content, craft perfect prompts, and guide you through complex projects step by step.")}
              </p>

              <div className="space-y-4">
                {[
                  "Text Generation for proposals, docs & content",
                  "Prompt Assistant to optimize your AI queries",
                  "Project Co-pilot for guided creation",
                  "Image Prompt Generator for visual concepts",
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                      <ChevronRight className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm">{t(item)}</span>
                  </div>
                ))}
              </div>

              <Link to="/ai-tools" className="inline-block mt-8">
                <Button variant="gradient">
                  {t("Try AI Tools")}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-card border border-border/50 p-6 relative overflow-hidden">
                {/* Mock AI Chat Interface */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-medium">{t("You")}</span>
                    </div>
                    <div className="flex-1 p-3 rounded-lg bg-muted/50 text-sm">
                      {t("Help me write a proposal for community events")}
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Brain className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 p-3 rounded-lg bg-primary/10 border border-primary/20 text-sm">
                      {t("I'll help you craft a compelling proposal. Let's start with your goals...")}
                      <span className="inline-block w-2 h-4 bg-primary ml-1 animate-pulse" />
                    </div>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-2xl" />
                <div className="absolute -top-10 -left-10 w-32 h-32 bg-secondary/20 rounded-full blur-2xl" />
              </div>

              {/* Floating badge */}
              <div className="absolute -top-4 -right-4 px-4 py-2 rounded-full bg-card border border-border shadow-lg flex items-center gap-2">
                <Star className="w-4 h-4 text-warning" />
                <span className="text-sm font-medium">{t("Powered by Advanced AI")}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center p-8 md:p-12 rounded-3xl bg-gradient-card border border-border relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5" />
            
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-6 glow-primary">
                <Globe className="w-8 h-8 text-primary-foreground" />
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {t("Ready to Join the")} <span className="text-gradient-primary">{t("Creative Revolution")}</span>?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                {t("Be part of a community that's redefining how creators collaborate, govern, and build together.")}
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/feed">
                  <Button variant="hero">
                    {t("Get Started Now")}
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">Creaverse DAO</span>
            </div>
            
            <p className="text-sm text-muted-foreground">
              © 2024 Creaverse DAO. {t("All rights reserved.")}
            </p>

            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t("Discord")}</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t("Twitter")}</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t("GitHub")}</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
