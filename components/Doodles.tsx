type DoodleProps = { className?: string };

export function HeroDoodle({ className }: DoodleProps) {
  return (
    <svg
      viewBox="0 0 160 120"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M40 60 L40 80 Q40 86 46 86 L70 86 L90 100 L90 40 L70 54 L46 54 Q40 54 40 60 Z" fill="#fff" />
      <path d="M102 50 Q118 58 118 70 Q118 82 102 90" />
      <path d="M112 42 Q138 56 138 70 Q138 84 112 98" opacity="0.55" />
      <path d="M28 70 Q23 73 28 78" opacity="0.5" />
      <path d="M22 66 Q14 72 22 80" opacity="0.3" />
    </svg>
  );
}

export function SelectDoodle({ className }: DoodleProps) {
  return (
    <svg
      viewBox="0 0 100 80"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect x="10" y="12" width="80" height="56" rx="6" />
      <path d="M20 24 L50 24" opacity="0.45" />
      <rect x="18" y="32" width="52" height="8" rx="2" fill="#000" opacity="0.12" stroke="none" />
      <path d="M20 34 L70 34" />
      <path d="M20 42 L58 42" opacity="0.35" />
      <path d="M20 50 L62 50" opacity="0.25" />
      <path d="M66 38 L66 52 L70 48 L74 56 L78 54 L74 46 L80 46 Z" fill="#000" stroke="#000" />
    </svg>
  );
}

export function HotkeyDoodle({ className }: DoodleProps) {
  return (
    <svg
      viewBox="0 0 110 80"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect x="10" y="28" width="26" height="22" rx="4" />
      <text x="23" y="43" fontSize="8" fontFamily="ui-monospace, monospace" textAnchor="middle" fill="currentColor" stroke="none">Ctrl</text>
      <rect x="42" y="28" width="56" height="22" rx="4" fill="#000" opacity="0.06" stroke="currentColor" />
      <text x="70" y="43" fontSize="8" fontFamily="ui-monospace, monospace" textAnchor="middle" fill="currentColor" stroke="none">Space</text>
      <path d="M55 16 Q55 10 62 10" opacity="0.35" />
      <path d="M70 14 L70 9" opacity="0.35" />
      <path d="M82 17 Q86 12 90 13" opacity="0.35" />
      <path d="M44 66 L66 66" opacity="0.4" />
      <path d="M50 72 L60 72" opacity="0.25" />
    </svg>
  );
}

export function ListenDoodle({ className }: DoodleProps) {
  return (
    <svg
      viewBox="0 0 110 80"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M22 50 Q22 28 44 28 Q66 28 66 50" />
      <rect x="16" y="46" width="12" height="20" rx="4" />
      <rect x="60" y="46" width="12" height="20" rx="4" />
      <path d="M82 40 Q88 50 82 60" opacity="0.6" />
      <path d="M90 34 Q100 50 90 66" opacity="0.35" />
    </svg>
  );
}

export function PillDoodle({ className }: DoodleProps) {
  return (
    <svg
      viewBox="0 0 160 60"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect x="10" y="15" width="140" height="32" rx="16" />
      <circle cx="28" cy="31" r="6" fill="#000" stroke="#000" />
      <path d="M24 31 L26 29 L26 33 Z M27 28 L29 26 L29 36 L27 34 Z" fill="#fff" stroke="none" />
      <path d="M45 26 L45 36" opacity="0.8" />
      <path d="M50 22 L50 40" />
      <path d="M55 26 L55 36" opacity="0.6" />
      <path d="M60 20 L60 42" />
      <path d="M65 26 L65 36" opacity="0.6" />
      <path d="M70 22 L70 40" />
      <path d="M75 26 L75 36" opacity="0.4" />
      <path d="M128 25 L140 37 M140 25 L128 37" opacity="0.45" />
    </svg>
  );
}

export function PrivateDoodle({ className }: DoodleProps) {
  return (
    <svg
      viewBox="0 0 90 90"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect x="18" y="40" width="54" height="38" rx="5" />
      <path d="M28 40 L28 28 Q28 14 45 14 Q62 14 62 28 L62 40" />
      <circle cx="45" cy="58" r="3" fill="#000" stroke="#000" />
      <path d="M45 61 L45 68" />
    </svg>
  );
}

export function LanguageDoodle({ className }: DoodleProps) {
  return (
    <svg
      viewBox="0 0 100 80"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <circle cx="34" cy="40" r="22" />
      <path d="M12 40 L56 40" opacity="0.5" />
      <path d="M34 18 Q46 40 34 62 Q22 40 34 18" opacity="0.5" />
      <path d="M68 30 L82 62 M61 50 L74 50" opacity="0.85" />
    </svg>
  );
}

export function UpdateDoodle({ className }: DoodleProps) {
  return (
    <svg
      viewBox="0 0 90 90"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M20 45 Q20 22 45 22 Q60 22 68 34" />
      <path d="M60 34 L70 34 L70 24" />
      <path d="M70 45 Q70 68 45 68 Q30 68 22 56" />
      <path d="M30 56 L20 56 L20 66" />
    </svg>
  );
}

export function VoiceDoodle({ className }: DoodleProps) {
  return (
    <svg
      viewBox="0 0 90 90"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect x="34" y="14" width="22" height="38" rx="11" />
      <path d="M24 42 Q24 60 45 60 Q66 60 66 42" />
      <path d="M45 60 L45 72" />
      <path d="M36 72 L54 72" />
    </svg>
  );
}
