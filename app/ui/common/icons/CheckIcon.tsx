interface CheckIconProps {
  size?: number;
  className?: string;
  title?: string;
}

export default function CheckIcon({ 
  size = 24, 
  className,
  title = "Success"
}: CheckIconProps) {
  const titleId = `check-icon-${Math.random().toString(36).substr(2, 9)}`;
  
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
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.3"
      />
    </svg>
  );
}
