import { Clock, TrendingUp, Calendar, BarChart3 } from "lucide-react";
import Layout from "@/components/Layout";

const History = () => {
  const mockHistory = [
    { date: "Jan 12, 2026", overall: 72.5, subjects: 12, action: "need 8 more" },
    { date: "Jan 10, 2026", overall: 68.3, subjects: 12, action: "need 15 more" },
    { date: "Jan 5, 2026", overall: 65.2, subjects: 12, action: "need 22 more" },
    { date: "Dec 28, 2025", overall: 78.4, subjects: 12, action: "can skip 4" },
  ];

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-accent mb-6 neon-glow animate-pulse-glow">
            <Clock className="w-10 h-10 text-background" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            <span className="neon-text">your</span>
            <span className="text-foreground"> journey</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            track ur attendance glow up 📈
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-slide-up">
          <div className="glass-card rounded-2xl p-5 text-center hover:scale-105 transition-transform">
            <BarChart3 className="w-8 h-8 text-primary mx-auto mb-3" />
            <p className="text-3xl font-bold text-foreground stat-number">4</p>
            <p className="text-muted-foreground text-sm">analyses done</p>
          </div>
          <div className="glass-card rounded-2xl p-5 text-center hover:scale-105 transition-transform">
            <TrendingUp className="w-8 h-8 text-success mx-auto mb-3" />
            <p className="text-3xl font-bold text-success stat-number">+7.3%</p>
            <p className="text-muted-foreground text-sm">improvement</p>
          </div>
          <div className="glass-card rounded-2xl p-5 text-center hover:scale-105 transition-transform">
            <Calendar className="w-8 h-8 text-accent mx-auto mb-3" />
            <p className="text-3xl font-bold text-foreground stat-number">15</p>
            <p className="text-muted-foreground text-sm">days tracked</p>
          </div>
          <div className="glass-card rounded-2xl p-5 text-center hover:scale-105 transition-transform">
            <span className="text-3xl block mb-2">🎯</span>
            <p className="text-3xl font-bold text-foreground stat-number">75%</p>
            <p className="text-muted-foreground text-sm">target</p>
          </div>
        </div>

        {/* History Timeline */}
        <div className="glass-card rounded-3xl p-6 md:p-8 animate-slide-up neon-border">
          <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
            <span>📜</span> recent analyses
          </h2>

          <div className="space-y-4">
            {mockHistory.map((entry, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-4 rounded-2xl border transition-all hover:scale-[1.02] ${
                  entry.overall >= 75
                    ? 'bg-success/5 border-success/20'
                    : 'bg-danger/5 border-danger/20'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    entry.overall >= 75 ? 'bg-success/20' : 'bg-danger/20'
                  }`}>
                    <span className="text-2xl">{entry.overall >= 75 ? '✅' : '😬'}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{entry.date}</p>
                    <p className="text-sm text-muted-foreground">{entry.subjects} subjects analyzed</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className={`text-2xl font-bold stat-number ${
                    entry.overall >= 75 ? 'text-success' : 'text-danger'
                  }`}>
                    {entry.overall}%
                  </p>
                  <p className={`text-sm ${entry.overall >= 75 ? 'text-success' : 'text-danger'}`}>
                    {entry.action}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 rounded-2xl bg-secondary/50 border border-border text-center">
            <span className="text-4xl mb-3 block">🚧</span>
            <p className="text-muted-foreground">
              history sync coming soon bestie! <br />
              <span className="text-sm">we're cooking something fire 🔥</span>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default History;
