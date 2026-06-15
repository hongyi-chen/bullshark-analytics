interface LoadingAnnouncerProps {
  isLoading: boolean;
  loadingMessage?: string;
  loadedMessage?: string;
}

export default function LoadingAnnouncer({
  isLoading,
  loadingMessage = "Loading content",
  loadedMessage = "Content loaded",
}: LoadingAnnouncerProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    >
      {isLoading ? loadingMessage : loadedMessage}
    </div>
  );
}
