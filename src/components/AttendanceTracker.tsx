import { useState, useMemo } from "react";
import { BookOpen, TrendingUp, TrendingDown, ClipboardPaste, Trash2, AlertCircle } from "lucide-react";

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
      // Skip header line
      if (line.includes('Subject Code') || line.includes('Percentage') || line.trim() === '') continue;

      // Split by tabs or multiple spaces
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
          const targetPercentage = 0.75;

          // Calculate classes that can be skipped while staying at 75%
          // After skipping X classes: attended / (total + X) >= 0.75
          // attended >= 0.75 * (total + X)
          // attended >= 0.75 * total + 0.75 * X
          // attended - 0.75 * total >= 0.75 * X
          // X <= (attended - 0.75 * total) / 0.75
          // X <= (4 * attended - 3 * total) / 3
          const canSkip = Math.max(0, Math.floor((4 * attended - 3 * total) / 3));

          // Calculate classes needed to reach 75%
          // After attending Y more classes: (attended + Y) / (total + Y) >= 0.75
          // attended + Y >= 0.75 * (total + Y)
          // attended + Y >= 0.75 * total + 0.75 * Y
          // 0.25 * Y >= 0.75 * total - attended
          // Y >= (0.75 * total - attended) / 0.25
          // Y >= 3 * total - 4 * attended
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
            id,
            code,
            name,
            type,
            present,
            od,
            makeup,
            absent,
            percentage,
            total,
            canSkip,
            needToAttend,
            status,
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
    
    // Overall can skip: (4 * attended - 3 * total) / 3
    const overallCanSkip = Math.max(0, Math.floor((4 * totalAttended - 3 * totalClasses) / 3));
    
    // Overall need to attend: 3 * total - 4 * attended
    const overallNeedToAttend = Math.max(0, Math.ceil(3 * totalClasses - 4 * totalAttended));
    
    const belowThreshold = subjects.filter(s => s.percentage < 75).length;
    const atRisk = subjects.filter(s => s.percentage >= 75 && s.percentage < 80).length;
    const safe = subjects.filter(s => s.percentage >= 80).length;

    return { totalAttended, totalClasses, overallPercentage, overallCanSkip, overallNeedToAttend, belowThreshold, atRisk, safe };
  }, [subjects]);

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4 glow-effect">
            <BookOpen className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Attendance Tracker
          </h1>
          <p className="text-muted-foreground">
            Paste your attendance report to analyze
          </p>
        </div>

        {/* Input Section */}
        <div className="glass-card rounded-3xl p-6 md:p-8 mb-6 animate-slide-up">
          <label className="block text-sm font-medium text-muted-foreground mb-3">
            Paste your attendance report here
          </label>
          <textarea
            value={rawInput}
            onChange={(e) => setRawInput(e.target.value)}
            placeholder={`Paste your attendance table here...

Example format:
1	CSUL401	Database Management System	Lecture	3	0	0	3	50.00
2	CSUL402	Theory of Computation	Lecture	3	0	0	2	60.00`}
            className="input-field min-h-[150px] font-mono text-sm resize-y"
          />
          <div className="flex gap-3 mt-4">
            <button
              onClick={handlePaste}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all"
            >
              <ClipboardPaste className="w-4 h-4" />
              Analyze
            </button>
            <button
              onClick={handleClear}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-secondary text-secondary-foreground font-semibold hover:bg-muted transition-all"
            >
              <Trash2 className="w-4 h-4" />
              Clear
            </button>
          </div>
        </div>

        {/* Overall Stats */}
        {overallStats && (
          <div className="space-y-4 mb-6 animate-fade-in">
            {/* Main Overall Card */}
            <div className={`glass-card rounded-2xl p-6 border-l-4 ${overallStats.overallPercentage >= 75 ? 'border-l-success' : 'border-l-danger'}`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">📊 Overall Combined</h3>
                  <p className="text-sm text-muted-foreground">
                    Attended {overallStats.totalAttended} / {overallStats.totalClasses} total classes
                  </p>
                </div>
                <div className="text-center md:text-right px-4">
                  <p className={`text-3xl font-bold ${overallStats.overallPercentage >= 75 ? 'text-success' : 'text-danger'}`}>
                    {overallStats.overallPercentage.toFixed(1)}%
                  </p>
                  <p className="text-xs text-muted-foreground">Overall</p>
                </div>
                <div className={`flex items-center gap-3 px-4 py-3 rounded-xl min-w-[220px] ${
                  overallStats.overallPercentage >= 75 ? 'result-card-success' : 'result-card-danger'
                }`}>
                  {overallStats.overallPercentage >= 75 ? (
                    <>
                      <TrendingDown className="w-5 h-5 text-success flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          Can skip <span className="text-success font-bold">{overallStats.overallCanSkip}</span> class{overallStats.overallCanSkip !== 1 ? 'es' : ''} total
                        </p>
                        <p className="text-xs text-muted-foreground">and stay at 75% overall</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <TrendingUp className="w-5 h-5 text-danger flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          Need <span className="text-danger font-bold">{overallStats.overallNeedToAttend}</span> more class{overallStats.overallNeedToAttend !== 1 ? 'es' : ''}
                        </p>
                        <p className="text-xs text-muted-foreground">to reach 75% overall</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="glass-card rounded-2xl p-4 text-center">
                <p className="text-muted-foreground text-sm mb-1">Below 75%</p>
                <p className="text-2xl font-bold text-danger">{overallStats.belowThreshold}</p>
              </div>
              <div className="glass-card rounded-2xl p-4 text-center">
                <p className="text-muted-foreground text-sm mb-1">At Risk (75-80%)</p>
                <p className="text-2xl font-bold text-warning">{overallStats.atRisk}</p>
              </div>
              <div className="glass-card rounded-2xl p-4 text-center">
                <p className="text-muted-foreground text-sm mb-1">Safe (80%+)</p>
                <p className="text-2xl font-bold text-success">{overallStats.safe}</p>
              </div>
            </div>
          </div>
        )}

        {/* Subject Cards */}
        {subjects.length > 0 && (
          <div className="grid gap-4 animate-fade-in">
            {subjects.map((subject) => (
              <div
                key={subject.id}
                className={`glass-card rounded-2xl p-5 border-l-4 ${
                  subject.status === 'success' ? 'border-l-success' :
                  subject.status === 'warning' ? 'border-l-warning' : 'border-l-danger'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Subject Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-xs font-mono text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                        {subject.code}
                      </span>
                      <span className="text-xs text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded">
                        {subject.type}
                      </span>
                    </div>
                    <h3 className="font-semibold text-foreground truncate">{subject.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Attended {subject.present + subject.od + subject.makeup} / {subject.total} classes
                      {subject.absent > 0 && <span className="text-danger"> • {subject.absent} absent</span>}
                    </p>
                  </div>

                  {/* Current Percentage */}
                  <div className="text-center md:text-right px-4">
                    <p className={`text-3xl font-bold ${
                      subject.status === 'success' ? 'text-success' :
                      subject.status === 'warning' ? 'text-warning' : 'text-danger'
                    }`}>
                      {subject.percentage.toFixed(1)}%
                    </p>
                    <p className="text-xs text-muted-foreground">Current</p>
                  </div>

                  {/* Action Required */}
                  <div className={`flex items-center gap-3 px-4 py-3 rounded-xl min-w-[200px] ${
                    subject.percentage >= 75 ? 'result-card-success' : 'result-card-danger'
                  }`}>
                    {subject.percentage >= 75 ? (
                      <>
                        <TrendingDown className="w-5 h-5 text-success flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            Can skip <span className="text-success font-bold">{subject.canSkip}</span> class{subject.canSkip !== 1 ? 'es' : ''}
                          </p>
                          <p className="text-xs text-muted-foreground">and stay at 75%</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <TrendingUp className="w-5 h-5 text-danger flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            Need <span className="text-danger font-bold">{subject.needToAttend}</span> more class{subject.needToAttend !== 1 ? 'es' : ''}
                          </p>
                          <p className="text-xs text-muted-foreground">to reach 75%</p>
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
          <div className="glass-card rounded-3xl p-12 text-center animate-fade-in">
            <AlertCircle className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">No Data Yet</h3>
            <p className="text-muted-foreground/80">
              Paste your attendance report above to see analysis
            </p>
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-muted-foreground/60 text-xs mt-8">
          Target attendance: 75% minimum • Calculations assume you attend/miss future classes consecutively
        </p>
      </div>
    </div>
  );
};

export default AttendanceTracker;
