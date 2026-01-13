import { Lightbulb, Target, Zap, Heart, Calculator, Github } from "lucide-react";
import Layout from "@/components/Layout";

const About = () => {
  const features = [
    {
      icon: Calculator,
      emoji: "📊",
      title: "instant analysis",
      description: "paste ur attendance data, get results in a flash"
    },
    {
      icon: Target,
      emoji: "🎯",
      title: "75% target",
      description: "we calculate exactly how many classes u can skip"
    },
    {
      icon: Zap,
      emoji: "⚡",
      title: "per-subject breakdown",
      description: "see which subjects are safe and which need work"
    },
  ];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-accent mb-6 neon-glow animate-pulse-glow">
            <Lightbulb className="w-10 h-10 text-background" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            <span className="neon-text">why</span>
            <span className="text-foreground"> bunkcalc?</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            because knowing when to bunk is an art form 🎨
          </p>
        </div>

        {/* Story Section */}
        <div className="glass-card rounded-3xl p-8 mb-8 animate-slide-up neon-border">
          <div className="flex items-start gap-4 mb-6">
            <span className="text-4xl">💭</span>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">the vibe</h2>
              <p className="text-muted-foreground leading-relaxed">
                we've all been there - staring at the attendance sheet, doing mental math, 
                wondering if we can skip that 8am lecture. bunkcalc does the math so u don't have to 
                (and so u don't accidentally get detained fr fr 💀)
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-4 mb-8 animate-slide-up">
          {features.map((feature, index) => (
            <div
              key={index}
              className="glass-card rounded-2xl p-6 text-center hover:scale-105 transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <span className="text-3xl">{feature.emoji}</span>
              </div>
              <h3 className="font-bold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div className="glass-card rounded-3xl p-8 mb-8 animate-slide-up">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
            <span>🧮</span> how it works
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-secondary/30">
              <span className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-background font-bold text-sm">1</span>
              <div>
                <p className="font-semibold text-foreground">paste ur attendance report</p>
                <p className="text-sm text-muted-foreground">copy from ur college portal, we parse it automatically</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-secondary/30">
              <span className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-background font-bold text-sm">2</span>
              <div>
                <p className="font-semibold text-foreground">we do the math</p>
                <p className="text-sm text-muted-foreground">calculate skippable classes based on 75% requirement</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-secondary/30">
              <span className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-background font-bold text-sm">3</span>
              <div>
                <p className="font-semibold text-foreground">plan ur bunks wisely</p>
                <p className="text-sm text-muted-foreground">see per-subject breakdown & overall stats</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Card */}
        <div className="glass-card rounded-3xl p-8 text-center animate-slide-up neon-border">
          <Heart className="w-12 h-12 text-danger mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">made with love</h2>
          <p className="text-muted-foreground mb-6">
            for students, by someone who understands the struggle 💅
          </p>
          <div className="flex items-center justify-center gap-4">
            <span className="text-3xl emoji-bounce">🎓</span>
            <span className="text-3xl emoji-bounce" style={{ animationDelay: '0.1s' }}>📚</span>
            <span className="text-3xl emoji-bounce" style={{ animationDelay: '0.2s' }}>☕</span>
            <span className="text-3xl emoji-bounce" style={{ animationDelay: '0.3s' }}>🔥</span>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
