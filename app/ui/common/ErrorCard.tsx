import Card from "./Card";
import css from "./ErrorCard.module.scss";

interface ErrorCardProps {
  errorMessage: string;
}

export default function ErrorCard({ errorMessage }: ErrorCardProps) {
  return (
    <Card
      as="div"
      ariaLabel="Error notification"
      header={
        <>
          <div className="bold">Couldn't load dashboard</div>
          <div className="muted">Check that the API endpoints are working.</div>
        </>
      }
    >
      <div role="alert" aria-live="assertive">
        <pre className={css.errorMessage}>{errorMessage}</pre>
      </div>
    </Card>
  );
}
