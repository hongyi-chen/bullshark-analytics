import { AthleteWithTrainingData } from '@/app/ui/types';
import { formatRiskType } from '@/app/utils/formatRiskType';
import Card from '@/app/ui/common/Card';
import { WarningIcon, CheckIcon } from '@/app/ui/common/icons';
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
          <h3 id="training-warnings-heading">Training Warnings</h3>
          {hasWarnings && (
            <span className={css.warningCount} aria-label={`${riskyWeeksArray.length} weeks with warnings`}>
              {riskyWeeksArray.length} {riskyWeeksArray.length === 1 ? 'Week' : 'Weeks'}
            </span>
          )}
        </div>

        {hasWarnings ? (
          <ul 
            className={css.warningsList} 
            aria-labelledby="training-warnings-heading"
            role="list"
          >
            {riskyWeeksArray.map(({ week, riskCount, risks }) => (
              <li 
                key={week} 
                className={`${css.warningItem} ${getRiskSeverityClass(riskCount)}`}
                aria-label={`Week of ${new Date(week).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric', 
                  year: 'numeric'
                })}: ${riskCount} ${riskCount === 1 ? 'risk' : 'risks'}`}
              >
                <div className={css.warningIcon} aria-hidden="true">
                  <WarningIcon size={20} title="" />
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
                  <ul className={css.risksList} aria-label="Risk details">
                    {risks.map((risk, idx) => (
                      <li key={idx}>{formatRiskType(risk)}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className={css.placeholder} role="status">
            <div className={css.icon} aria-hidden="true">
              <CheckIcon size={32} title="" />
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
