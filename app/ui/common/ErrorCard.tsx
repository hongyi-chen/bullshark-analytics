import Card from "./Card";
import css from "./ErrorCard.module.scss";

interface ErrorCardProps {
  errorMessage: string;
  title?: string;
}

export default function ErrorCard({ errorMessage, title = "Couldn't load data" }: ErrorCardProps) {
  return (
    <div role="alert" aria-live="assertive">
      <Card
        header={
          <>
            <div className="bold">{title}</div>
            <div className="muted">Check that the API endpoints are working.</div>
          </>
        }
      >
        <pre className={css.errorMessage}>{errorMessage}</pre>
      </Card>
    </div>
  );
}
