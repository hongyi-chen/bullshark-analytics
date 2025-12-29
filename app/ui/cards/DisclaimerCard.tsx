import Card from '@/app/ui/cards/Card';
import css from './DisclaimerCard.module.scss';

export default function DisclaimerCard() {
  return (
    <Card className={css.disclaimerCard}>
      <div className={css.content}>
        <div className={css.iconContainer}>
          <svg
            className={css.icon}
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
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
        <div className={css.text}>
          <h3 className={css.title}>Important Disclaimer</h3>
          <p className={css.message}>
            This is not medical advice. Do your own research, talk to professionals, listen to your body, etc.
          </p>
        </div>
      </div>
    </Card>
  );
}
