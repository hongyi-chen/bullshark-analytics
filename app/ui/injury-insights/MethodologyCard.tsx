import Card from '@/app/ui/common/Card';
import ExternalLink from '@/app/ui/common/ExternalLink';
import css from './MethodologyCard.module.scss';

export default function MethodologyCard() {
  return (
    <Card>
      <section className={css.container} aria-labelledby="methodology-heading">
        <div className={css.header}>
          <h3 id="methodology-heading">Risk Types</h3>
        </div>
        <div className={css.content}>
          <ul className={css.list}>
            <li>
              <span className={css.listTitle}>High Volume Spike:</span> This warning appears when your
              week-over-week mileage increased by more than 10%. Sometimes 10%+ weeks are okay, but
              stacking many 10%+ weeks back-to-back can increase injury risk. Research "The 10% rule"
              to learn more.
            </li>
            <li>
              <span className={css.listTitle}>SSRD30:</span> Session-Specific Running Distance relative
              to your longest run in the past 30 days. Research shows that when a single run exceeds 10%
              of your longest recent run, injury risk increases significantly. Spikes of 10-30% show a
              64% increased injury rate, while spikes over 100% show a 128% increased rate.{' '}
              <ExternalLink href="https://bjsm.bmj.com/content/59/17/1203" className={css.link}>
                Learn more
              </ExternalLink>
            </li>
          </ul>
        </div>
      </section>
    </Card>
  );
}
