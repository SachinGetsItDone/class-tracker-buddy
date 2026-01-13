import { useState, useMemo } from "react";
import { TrendingUp, TrendingDown, Zap, X, Ghost } from "lucide-react";
import Layout from "@/components/Layout";

interface SubjectData {
  id: number;
  code: string;
  name: string;
  type: string;
  present: number;
  od: number;
  makeup: number;
  absent: number;
  percentage: number;
  total: number;
  canSkip: number;
  needToAttend: number;
  status: 'success' | 'warning' | 'danger';
}

const AttendanceTracker = () => {
  const [rawInput, setRawInput] = useState<string>("");
  const [subjects, setSubjects] = useState<SubjectData[]>([]);

  const parseInput = (input: string) => {
    const lines = input.trim().split('\n');
    const parsed: SubjectData[] = [];

    for (const line of lines) {
      if (line.includes('Subject Code') || line.includes('Percentage') || line.trim() === '') continue;

      const parts = line.split(/\t+|\s{2,}/).map(p => p.trim()).filter(Boolean);
      
      if (parts.length >= 9) {
        const id = parseInt(parts[0]);
        const code = parts[1];
        const name = parts[2];
        const type = parts[3];
        const present = parseInt(parts[4]) || 0;
        const od = parseInt(parts[5]) || 0;
        const makeup = parseInt(parts[6]) || 0;
        const absent = parseInt(parts[7]) || 0;
        const percentage = parseFloat(parts[8]) || 0;

        if (!isNaN(id)) {
          const attended = present + od + makeup;
          const total = attended + absent;
          const canSkip = Math.max(0, Math.floor((4 * attended - 3 * total) / 3));
          const needToAttend = Math.max(0, Math.ceil(3 * total - 4 * attended));

          let status: 'success' | 'warning' | 'danger';
          if (percentage >= 85) {
            status = 'success';
          } else if (percentage >= 75) {
            status = 'warning';
          } else {
            status = 'danger';
          }

          parsed.push({
            id, code, name, type, present, od, makeup, absent, percentage, total, canSkip, needToAttend, status,
          });
        }
      }
    }

    setSubjects(parsed);
  };

  const handlePaste = () => {
    parseInput(rawInput);
  };

  const handleClear = () => {
    setRawInput("");
    setSubjects([]);
  };

  const overallStats = useMemo(() => {
    if (subjects.length === 0) return null;
    
    const totalAttended = subjects.reduce((sum, s) => sum + s.present + s.od + s.makeup, 0);
    const totalClasses = subjects.reduce((sum, s) => sum + s.total, 0);
    const overallPercentage = totalClasses > 0 ? (totalAttended / totalClasses) * 100 : 0;
    const overallCanSkip = Math.max(0, Math.floor((4 * totalAttended - 3 * totalClasses) / 3));
    const overallNeedToAttend = Math.max(0, Math.ceil(3 * totalClasses - 4 * totalAttended));
    const belowThreshold = subjects.filter(s => s.percentage < 75).length;
    const atRisk = subjects.filter(s => s.percentage >= 75 && s.percentage < 80).length;
    const safe = subjects.filter(s => s.percentage >= 80).length;

    return { totalAttended, totalClasses, overallPercentage, overallCanSkip, overallNeedToAttend, belowThreshold, atRisk, safe };
  }, [subjects]);

  const getStatusEmoji = (percentage: number) => {
    if (percentage >= 85) return "🔥";
    if (percentage >= 75) return "😅";
    return "💀";
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            <span className="neon-text">paste &</span>
            <span className="text-foreground"> analyze</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            drop ur report, see if u can bunk 💅
          </p>
        </div>

        {/* Input Section */}
        <div className="glass-card rounded-3xl p-6 md:p-8 mb-8 animate-slide-up neon-border">
          <label className="block text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
            <span>📋</span> drop ur attendance data here bestie
          </label>
          <textarea
            value={rawInput}
            onChange={(e) => setRawInput(e.target.value)}
            placeholder={`paste that table fr fr...

1	CSUL401	Database Management System	Lecture	3	0	0	3	50.00
2	CSUL402	Theory of Computation	Lecture	3	0	0	2	60.00`}
            className="input-field min-h-[140px] resize-y"
          />
          <div className="flex gap-3 mt-5">
            <button
              onClick={handlePaste}
              className="flex items-center gap-2 px-8 py-4 rounded-2xl btn-neon text-base"
            >
              <Zap className="w-5 h-5" />
              analyze it ✨
            </button>
            <button
              onClick={handleClear}
              className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-secondary text-secondary-foreground font-semibold hover:bg-muted transition-all"
            >
              <X className="w-5 h-5" />
              clear
            </button>
          </div>
        </div>

        {/* Overall Stats */}
        {overallStats && (
          <div className="space-y-5 mb-8 animate-slide-up-delay">
            {/* Main Overall Card */}
            <div className={`glass-card rounded-3xl p-8 border-l-4 ${overallStats.overallPercentage >= 75 ? 'border-l-success' : 'border-l-danger'}`}>
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl emoji-bounce">📊</span>
                    <h3 className="text-2xl font-bold text-foreground">overall vibes</h3>
                  </div>
                  <p className="text-muted-foreground">
                    {overallStats.totalAttended} / {overallStats.totalClasses} classes attended
                  </p>
                </div>
                
                <div className="text-center lg:text-right">
                  <p className={`text-5xl font-bold stat-number ${overallStats.overallPercentage >= 75 ? 'text-success' : 'text-danger'}`}>
                    {overallStats.overallPercentage.toFixed(1)}%
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {getStatusEmoji(overallStats.overallPercentage)} current
                  </p>
                </div>

                <div className={`flex items-center gap-4 px-6 py-5 rounded-2xl min-w-[260px] ${
                  overallStats.overallPercentage >= 75 ? 'result-card-success' : 'result-card-danger'
                }`}>
                  {overallStats.overallPercentage >= 75 ? (
                    <>
                      <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center">
                        <TrendingDown className="w-6 h-6 text-success" />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-foreground">
                          skip <span className="text-success">{overallStats.overallCanSkip}</span> class{overallStats.overallCanSkip !== 1 ? 'es' : ''} 🎉
                        </p>
                        <p className="text-sm text-muted-foreground">still above 75% no cap</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-xl bg-danger/20 flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-danger" />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-foreground">
                          attend <span className="text-danger">{overallStats.overallNeedToAttend}</span> more 😭
                        </p>
                        <p className="text-sm text-muted-foreground">to reach 75% bruh</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="glass-card rounded-2xl p-5 text-center group hover:scale-105 transition-transform cursor-default">
                <p className="text-4xl mb-2">💀</p>
                <p className="text-3xl font-bold text-danger stat-number">{overallStats.belowThreshold}</p>
                <p className="text-muted-foreground text-sm mt-1">below 75%</p>
              </div>
              <div className="glass-card rounded-2xl p-5 text-center group hover:scale-105 transition-transform cursor-default">
                <p className="text-4xl mb-2">😬</p>
                <p className="text-3xl font-bold text-warning stat-number">{overallStats.atRisk}</p>
                <p className="text-muted-foreground text-sm mt-1">risky (75-80%)</p>
              </div>
              <div className="glass-card rounded-2xl p-5 text-center group hover:scale-105 transition-transform cursor-default">
                <p className="text-4xl mb-2">✅</p>
                <p className="text-3xl font-bold text-success stat-number">{overallStats.safe}</p>
                <p className="text-muted-foreground text-sm mt-1">we chillin (80%+)</p>
              </div>
            </div>
          </div>
        )}

        {/* Subject Cards */}
        {subjects.length > 0 && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <span>📚</span> subject breakdown
            </h2>
            {subjects.map((subject, index) => (
              <div
                key={subject.id}
                className={`glass-card rounded-2xl p-5 border-l-4 hover:scale-[1.02] transition-all duration-300 ${
                  subject.status === 'success' ? 'border-l-success' :
                  subject.status === 'warning' ? 'border-l-warning' : 'border-l-danger'
                }`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Subject Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className={`text-xs font-mono px-3 py-1 rounded-full ${
                        subject.type === 'Lab' ? 'bg-accent/20 text-accent' : 'bg-primary/20 text-primary'
                      }`}>
                        {subject.code}
                      </span>
                      <span className="text-xs text-muted-foreground bg-secondary px-3 py-1 rounded-full">
                        {subject.type}
                      </span>
                    </div>
                    <h3 className="font-semibold text-foreground text-lg truncate">{subject.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {subject.present + subject.od + subject.makeup}/{subject.total} attended
                      {subject.absent > 0 && <span className="text-danger ml-2">• {subject.absent} bunked 💨</span>}
                    </p>
                  </div>

                  {/* Current Percentage */}
                  <div className="text-center lg:text-right px-4">
                    <div className="flex items-center gap-2 justify-center lg:justify-end">
                      <span className="text-2xl">{getStatusEmoji(subject.percentage)}</span>
                      <p className={`text-4xl font-bold stat-number ${
                        subject.status === 'success' ? 'text-success' :
                        subject.status === 'warning' ? 'text-warning' : 'text-danger'
                      }`}>
                        {subject.percentage.toFixed(0)}%
                      </p>
                    </div>
                  </div>

                  {/* Action Required */}
                  <div className={`flex items-center gap-3 px-5 py-4 rounded-xl min-w-[220px] ${
                    subject.percentage >= 75 ? 'result-card-success' : 'result-card-danger'
                  }`}>
                    {subject.percentage >= 75 ? (
                      <>
                        <TrendingDown className="w-5 h-5 text-success flex-shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            can skip <span className="text-success font-bold">{subject.canSkip}</span> 🏃
                          </p>
                          <p className="text-xs text-muted-foreground">still safe at 75%</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <TrendingUp className="w-5 h-5 text-danger flex-shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            need <span className="text-danger font-bold">{subject.needToAttend}</span> more 😰
                          </p>
                          <p className="text-xs text-muted-foreground">to hit 75%</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {subjects.length === 0 && !rawInput && (
          <div className="glass-card rounded-3xl p-16 text-center animate-fade-in neon-border">
            <Ghost className="w-20 h-20 text-muted-foreground/30 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-foreground mb-3">no data yet bestie</h3>
            <p className="text-muted-foreground">
              paste ur attendance report above to see the tea ☕
            </p>
          </div>
        )}

      </div>
    </Layout>
  );
};

export default AttendanceTracker;
