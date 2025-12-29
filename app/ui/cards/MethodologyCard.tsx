import Card from '@/app/ui/cards/Card';
import css from './MethodologyCard.module.scss';

export default function MethodologyCard() {
  return (
    <Card>
      <div className={css.container} id="methodology-card">
        <div className={css.header}>
          <h3>Risk Types</h3>
        </div>
        <div className={css.content}>
          <ul className={css.list}>
            <li>
              <span className={css.listTitle}>High Volume Spike:</span> This warning appears when your 
              week-over-week mileage increased by more than 10%. Sometimes 10%+ weeks are okay, but 
              stacking many 10%+ weeks back-to-back can increase injury risk. Research "The 10% rule"
              to learn more.
            </li>
          </ul>
        </div>
      </div>
    </Card>
  );
}
