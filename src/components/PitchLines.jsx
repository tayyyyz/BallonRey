export default function PitchLines() {
  return (
    <svg
      className="pitch-lines"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="1.5" y="1.5" width="97" height="97" fill="none" stroke="white" strokeWidth="0.4" opacity="0.55" />
      <line x1="1.5" y1="50" x2="98.5" y2="50" stroke="white" strokeWidth="0.4" opacity="0.55" />
      <circle cx="50" cy="50" r="9" fill="none" stroke="white" strokeWidth="0.4" opacity="0.55" />
      <circle cx="50" cy="50" r="0.6" fill="white" opacity="0.55" />

      <rect x="26" y="1.5" width="48" height="16" fill="none" stroke="white" strokeWidth="0.4" opacity="0.55" />
      <rect x="38" y="1.5" width="24" height="7" fill="none" stroke="white" strokeWidth="0.4" opacity="0.55" />
      <circle cx="50" cy="12.5" r="0.6" fill="white" opacity="0.55" />
      <path d="M 38 17 A 9 9 0 0 0 62 17" fill="none" stroke="white" strokeWidth="0.4" opacity="0.55" />

      <rect x="26" y="82.5" width="48" height="16" fill="none" stroke="white" strokeWidth="0.4" opacity="0.55" />
      <rect x="38" y="91.5" width="24" height="7" fill="none" stroke="white" strokeWidth="0.4" opacity="0.55" />
      <circle cx="50" cy="87.5" r="0.6" fill="white" opacity="0.55" />
      <path d="M 38 83 A 9 9 0 0 1 62 83" fill="none" stroke="white" strokeWidth="0.4" opacity="0.55" />

      <path d="M 1.5 3.5 A 2 2 0 0 1 3.5 1.5" fill="none" stroke="white" strokeWidth="0.4" opacity="0.55" />
      <path d="M 96.5 1.5 A 2 2 0 0 1 98.5 3.5" fill="none" stroke="white" strokeWidth="0.4" opacity="0.55" />
      <path d="M 98.5 96.5 A 2 2 0 0 1 96.5 98.5" fill="none" stroke="white" strokeWidth="0.4" opacity="0.55" />
      <path d="M 3.5 98.5 A 2 2 0 0 1 1.5 96.5" fill="none" stroke="white" strokeWidth="0.4" opacity="0.55" />
    </svg>
  );
}
