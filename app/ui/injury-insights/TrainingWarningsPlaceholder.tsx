import { AthleteWithTrainingData } from '@/app/ui/types';
import { formatRiskType } from '@/app/utils/formatRiskType';
import Card from '@/app/ui/common/Card';
import css from './TrainingWarningsPlaceholder.module.scss';

interface TrainingWarningsPlaceholderProps {
  athlete: AthleteWithTrainingData;
  riskyWeeks?: Map<string, { riskCount: number; risks: string[] }>;
}

function getRiskSeverityClass(riskCount: number): string {
  if (riskCount >= 3) return css.severityHigh;
  if (riskCount >= 2) return css.severityMedium;
  return css.severityLow;
}

export default function TrainingWarningsPlaceholder({ athlete, riskyWeeks }: TrainingWarningsPlaceholderProps) {
  const riskyWeeksArray = riskyWeeks
    ? Array.from(riskyWeeks.entries())
        .map(([week, data]) => ({ week, ...data }))
        .sort((a, b) => b.week.localeCompare(a.week))
    : [];

  const hasWarnings = riskyWeeksArray.length > 0;

  return (
    <Card>
      <div className={css.container}>
        <div className={css.header}>
          <h3>Training Warnings</h3>
          {hasWarnings && (
            <span className={css.warningCount}>
              {riskyWeeksArray.length} {riskyWeeksArray.length === 1 ? 'Week' : 'Weeks'}
            </span>
          )}
        </div>

        {hasWarnings ? (
          <div className={css.warningsList}>
            {riskyWeeksArray.map(({ week, riskCount, risks }) => (
              <div key={week} className={`${css.warningItem} ${getRiskSeverityClass(riskCount)}`}>
                <div className={css.warningIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 2L2 20h20L12 2z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 9v4M12 17h.01"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className={css.warningContent}>
                  <div className={css.warningHeader}>
                    <span className={css.warningWeek}>
                      Week of {new Date(week).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                    <span className={css.warningRiskCount}>
                      {riskCount} {riskCount === 1 ? 'Risk' : 'Risks'}
                    </span>
                  </div>
                  <ul className={css.risksList}>
                    {risks.map((risk, idx) => (
                      <li key={idx}>{formatRiskType(risk)}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={css.placeholder}>
            <div className={css.icon}>
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.3"
                />
              </svg>
            </div>
            <p className={css.message}>
              No training warnings detected for {athlete.name}.
            </p>
            <p className={css.description}>
              Keep up the good work! Training volume appears to be within safe parameters.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
