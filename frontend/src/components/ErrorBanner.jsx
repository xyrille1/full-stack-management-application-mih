export default function ErrorBanner({ message, onDismiss }) {
  if (!message) return null;

  return (
    <div className="error-banner" role="alert">
      <span>{message}</span>
      <button type="button" className="link-button" onClick={onDismiss}>
        Dismiss
      </button>
    </div>
  );
}
