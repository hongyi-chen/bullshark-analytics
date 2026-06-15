import Card from "./Card";
import css from "./ErrorCard.module.scss";

interface ErrorCardProps {
  errorMessage: string;
  title?: string;
}

export default function ErrorCard({ 
  errorMessage, 
  title = "Couldn't load dashboard" 
}: ErrorCardProps) {
  return (
    <Card
      header={
        <>
          <div className="bold">{title}</div>
          <div className="muted">Check that the API endpoints are working.</div>
        </>
      }
    >
      <div role="alert" aria-live="assertive" aria-atomic="true">
        <pre className={css.errorMessage}>{errorMessage}</pre>
      </div>
    </Card>
  );
}
