import Card from "./Card";
import css from "./ErrorCard.module.scss";

interface ErrorCardProps {
  errorMessage: string;
  title?: string;
}

export default function ErrorCard({
  errorMessage,
  title = "Couldn't load data",
}: ErrorCardProps) {
  return (
    <Card
      header={
        <>
          <h2 className="bold">{title}</h2>
          <p className="muted">Check that the API endpoints are working.</p>
        </>
      }
    >
      <div role="alert" aria-live="assertive">
        <pre className={css.errorMessage}>{errorMessage}</pre>
      </div>
    </Card>
  );
}
