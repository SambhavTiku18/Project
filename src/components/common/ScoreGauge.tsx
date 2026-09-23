import React from 'react';

interface ScoreGaugeProps {
  score: number; // 0 to 100
  label: string;
  sublabel?: string;
  size?: 'sm' | 'md' | 'lg';
  showCategory?: boolean;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  score,
  label,
  sublabel,
  size = 'md',
  showCategory = true,
}) => {
  const clampedScore = Math.min(100, Math.max(0, Math.round(score)));

  // Color logic
  let strokeColor = '#10b981'; // Emerald/Green for >= 80
  let bgColor = 'text-emerald-600 bg-emerald-50 border-emerald-200';
  let categoryText = 'Excellent';

  if (clampedScore < 60) {
    strokeColor = '#ef4444'; // Red for < 60
    bgColor = 'text-red-600 bg-red-50 border-red-200';
    categoryText = 'Needs Work';
  } else if (clampedScore < 75) {
    strokeColor = '#f59e0b'; // Amber for 60-74
    bgColor = 'text-amber-600 bg-amber-50 border-amber-200';
    categoryText = 'Fair / Good';
  } else if (clampedScore < 88) {
    strokeColor = '#3b82f6'; // Blue for 75-87
    bgColor = 'text-blue-600 bg-blue-50 border-blue-200';
    categoryText = 'Strong';
  }

  // Dimensions
  const config = {
    sm: { radius: 38, strokeWidth: 7, sizePx: 96, fontSize: 'text-xl', labelSize: 'text-xs' },
    md: { radius: 56, strokeWidth: 9, sizePx: 140, fontSize: 'text-3xl', labelSize: 'text-sm' },
    lg: { radius: 74, strokeWidth: 12, sizePx: 180, fontSize: 'text-4xl', labelSize: 'text-base' },
  }[size];

  const circumference = 2 * Math.PI * config.radius;
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
      <div className="relative flex items-center justify-center" style={{ width: config.sizePx, height: config.sizePx }}>
        <svg
          className="transform -rotate-90"
          width={config.sizePx}
          height={config.sizePx}
          viewBox={`0 0 ${config.sizePx} ${config.sizePx}`}
        >
          {/* Background circle */}
          <circle
            cx={config.sizePx / 2}
            cy={config.sizePx / 2}
            r={config.radius}
            stroke="#e2e8f0"
            strokeWidth={config.strokeWidth}
            fill="transparent"
          />
          {/* Animated progress circle */}
          <circle
            cx={config.sizePx / 2}
            cy={config.sizePx / 2}
            r={config.radius}
            stroke={strokeColor}
            strokeWidth={config.strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            style={{
              transition: 'stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
        </svg>

        {/* Center score text */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className={`font-bold tracking-tight text-slate-900 ${config.fontSize}`}>
            {clampedScore}
          </span>
          <span className="text-[11px] font-medium text-slate-400 -mt-1">/100</span>
        </div>
      </div>

      <div className="mt-3 text-center">
        <h4 className={`font-semibold text-slate-800 ${config.labelSize}`}>{label}</h4>
        {sublabel && <p className="text-xs text-slate-500 mt-0.5 max-w-[180px]">{sublabel}</p>}
        {showCategory && (
          <div className="mt-2">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${bgColor}`}>
              {categoryText}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
