import { useState, useMemo } from "react";
import { Calculator, TrendingUp, TrendingDown, Target, BookOpen, AlertCircle } from "lucide-react";

interface AttendanceResult {
  currentPercentage: number;
  status: 'success' | 'warning' | 'danger';
  canSkip: number;
  needToAttend: number;
  message: string;
}

const AttendanceTracker = () => {
  const [totalClasses, setTotalClasses] = useState<string>("");
  const [attendedClasses, setAttendedClasses] = useState<string>("");

  const result = useMemo<AttendanceResult | null>(() => {
    const total = parseInt(totalClasses);
    const attended = parseInt(attendedClasses);

    if (isNaN(total) || isNaN(attended) || total <= 0 || attended < 0) {
      return null;
    }

    if (attended > total) {
      return null;
    }

    const currentPercentage = (attended / total) * 100;
    const targetPercentage = 75;

    // Calculate how many classes can be skipped while maintaining 75%
    // attended / (total + x) >= 0.75
    // attended >= 0.75 * (total + x)
    // attended >= 0.75 * total + 0.75 * x
    // attended - 0.75 * total >= 0.75 * x
    // (attended - 0.75 * total) / 0.75 >= x
    const canSkip = Math.floor((attended - targetPercentage / 100 * total) / (targetPercentage / 100));

    // Calculate how many classes needed to reach 75%
    // (attended + y) / (total + y) >= 0.75
    // attended + y >= 0.75 * (total + y)
    // attended + y >= 0.75 * total + 0.75 * y
    // 0.25 * y >= 0.75 * total - attended
    // y >= (0.75 * total - attended) / 0.25
    const needToAttend = Math.max(0, Math.ceil((targetPercentage / 100 * total - attended) / (1 - targetPercentage / 100)));

    let status: 'success' | 'warning' | 'danger';
    let message: string;

    if (currentPercentage >= 85) {
      status = 'success';
      message = "Excellent! Your attendance is great! 🎉";
    } else if (currentPercentage >= 75) {
      status = 'warning';
      message = "You're at the threshold. Be careful! ⚠️";
    } else {
      status = 'danger';
      message = "Attendance is below 75%. Time to catch up! 📚";
    }

    return {
      currentPercentage,
      status,
      canSkip: Math.max(0, canSkip),
      needToAttend,
      message,
    };
  }, [totalClasses, attendedClasses]);

  const getProgressWidth = () => {
    if (!result) return "0%";
    return `${Math.min(100, result.currentPercentage)}%`;
  };

  const getProgressClass = () => {
    if (!result) return "progress-fill-danger";
    if (result.status === 'success') return "progress-fill-success";
    if (result.status === 'warning') return "progress-fill-warning";
    return "progress-fill-danger";
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-lg animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8 animate-slide-up">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4 glow-effect">
            <BookOpen className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Attendance Tracker
          </h1>
          <p className="text-muted-foreground">
            Calculate your attendance and plan ahead
          </p>
        </div>

        {/* Main Card */}
        <div className="glass-card rounded-3xl p-6 md:p-8 glow-effect animate-slide-up" style={{ animationDelay: '0.1s' }}>
          {/* Input Section */}
          <div className="space-y-4 mb-8">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Total Classes Held
              </label>
              <input
                type="number"
                value={totalClasses}
                onChange={(e) => setTotalClasses(e.target.value)}
                placeholder="e.g., 50"
                className="input-field"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Classes Attended
              </label>
              <input
                type="number"
                value={attendedClasses}
                onChange={(e) => setAttendedClasses(e.target.value)}
                placeholder="e.g., 40"
                className="input-field"
                min="0"
              />
            </div>
          </div>

          {/* Results Section */}
          {result && (
            <div className="space-y-6 animate-fade-in">
              {/* Current Attendance */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold status-badge-${result.status}`}>
                    {result.status === 'success' ? 'Safe' : result.status === 'warning' ? 'Caution' : 'Critical'}
                  </span>
                </div>
                <div className="text-5xl md:text-6xl font-extrabold mb-2">
                  <span className={result.status === 'success' ? 'text-success' : result.status === 'warning' ? 'text-warning' : 'text-danger'}>
                    {result.currentPercentage.toFixed(1)}%
                  </span>
                </div>
                <p className="text-muted-foreground text-sm mb-4">{result.message}</p>
                
                {/* Progress Bar */}
                <div className="progress-bar h-3 w-full">
                  <div 
                    className={`h-full ${getProgressClass()} transition-all duration-500 ease-out`}
                    style={{ width: getProgressWidth() }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>0%</span>
                  <span className="text-primary font-medium">75% Target</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Result Cards */}
              <div className="grid gap-4">
                {result.currentPercentage >= 75 ? (
                  <div className={`result-card result-card-success`}>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center flex-shrink-0">
                        <TrendingDown className="w-6 h-6 text-success" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-1">
                          Classes You Can Skip
                        </h3>
                        <p className="text-3xl font-bold text-success mb-1">
                          {result.canSkip}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {result.canSkip === 0 
                            ? "You can't skip any more classes to maintain 75%"
                            : `You can skip up to ${result.canSkip} class${result.canSkip > 1 ? 'es' : ''} and still maintain 75%`
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className={`result-card result-card-danger`}>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-danger/20 flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="w-6 h-6 text-danger" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-1">
                          Classes Needed to Reach 75%
                        </h3>
                        <p className="text-3xl font-bold text-danger mb-1">
                          {result.needToAttend}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Attend the next {result.needToAttend} consecutive class{result.needToAttend > 1 ? 'es' : ''} to reach 75%
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Info Card */}
                <div className="result-card bg-secondary/50 border-border">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Calculator className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-1">
                        Attendance Summary
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Attended <span className="text-foreground font-medium">{attendedClasses}</span> out of <span className="text-foreground font-medium">{totalClasses}</span> classes
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Missed <span className="text-foreground font-medium">{parseInt(totalClasses) - parseInt(attendedClasses)}</span> classes so far
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!result && (totalClasses || attendedClasses) && (
            <div className="text-center py-8 animate-fade-in">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">
                Please enter valid numbers (attended ≤ total)
              </p>
            </div>
          )}

          {!totalClasses && !attendedClasses && (
            <div className="text-center py-8 animate-fade-in">
              <Target className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
              <p className="text-muted-foreground">
                Enter your class details to get started
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-muted-foreground/60 text-xs mt-6">
          Target attendance: 75% minimum
        </p>
      </div>
    </div>
  );
};

export default AttendanceTracker;
