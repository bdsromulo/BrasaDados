export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="brand">
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <path d="M39 5h8l14 14v8H48V23L39 14Z" fill="#2448C7" />
        <path d="M59 39v8L45 61h-8V48h4l9-9Z" fill="#14264D" />
        <path d="M25 59h-8L3 45v-8h13v4l9 9Z" fill="#2448C7" />
        <path d="M5 25v-8L19 3h8v13h-4l-9 9Z" fill="#D9F06B" />
        <rect x="23" y="23" width="18" height="18" rx="4" fill="#2448C7" />
      </svg>
      {!compact && (
        <span>
          brasa<span className="brand-weight">dados</span>
          <small>DADOS PÚBLICOS, ACESSO SIMPLES</small>
        </span>
      )}
    </span>
  );
}
