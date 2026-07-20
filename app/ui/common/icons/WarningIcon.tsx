interface WarningIconProps {
  size?: number;
  className?: string;
  title?: string;
}

export default function WarningIcon({ 
  size = 24, 
  className,
  title = "Warning"
}: WarningIconProps) {
  const titleId = `warning-icon-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-labelledby={titleId}
    >
      <title id={titleId}>{title}</title>
      <path
        d="M12 2L2 20h20L12 2z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 9v4M12 17h.01"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
