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
          <div className="bold" id="error-title">Couldn't load dashboard</div>
          <div className="muted">Check that the API endpoints are working.</div>
        </>
      }
    >
      <div 
        role="alert" 
        aria-live="assertive"
        aria-labelledby="error-title"
        aria-describedby="error-message"
      >
        <pre id="error-message" className={css.errorMessage}>{errorMessage}</pre>
      </div>
    </Card>
  );
}
