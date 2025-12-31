import Card from "./Card";
import css from "./ErrorCard.module.scss";

interface ErrorCardProps {
  errorMessage: string;
}

export default function ErrorCard({ errorMessage }: ErrorCardProps) {
  return (
    <Card
      header={
        <>
          <div className="bold">Couldn’t load dashboard</div>
          <div className="muted">Check that the API endpoints are working.</div>
        </>
      }
    >
      <pre className={css.errorMessage}>{errorMessage}</pre>
    </Card>
  );
}
