import Card from '@/app/ui/common/Card';
import { WarningIcon } from '@/app/ui/common/icons';
import css from './DisclaimerCard.module.scss';

export default function DisclaimerCard() {
  return (
    <Card className={css.disclaimerCard}>
      <div className={css.content} role="alert">
        <div className={css.iconContainer}>
          <WarningIcon size={24} className={css.icon} title="Important disclaimer" />
        </div>
        <div className={css.text}>
          <h3 className={css.title}>Important Disclaimer</h3>
          <p className={css.message}>
            Welcome to the Injury Insights Beta!

            This is not medical advice. Do your own research, talk to professionals, listen to your body, etc.
          </p>
        </div>
      </div>
    </Card>
  );
}
