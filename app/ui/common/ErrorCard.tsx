import Card from "./Card";
import css from "./ErrorCard.module.scss";

interface ErrorCardProps {
  errorMessage: string;
}

export default function ErrorCard({ errorMessage }: ErrorCardProps) {
  return (
    <div role="alert" aria-live="assertive">
      <Card
        header={
          <>
            <div className="bold">
              <span aria-hidden="true">⚠️ </span>
              Couldn&apos;t load dashboard
            </div>
            <div className="muted">Check that the API endpoints are working.</div>
          </>
        }
      >
        <pre className={css.errorMessage} aria-label="Error details">
          {errorMessage}
        </pre>
      </Card>
    </div>
  );
}
