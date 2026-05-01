export function WhatsappIcon() {
  return (
    <svg className="whatsapp-icon" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M16.04 3.2c-7.03 0-12.75 5.7-12.75 12.72 0 2.24.59 4.42 1.71 6.35L3.2 28.8l6.69-1.75a12.7 12.7 0 0 0 6.15 1.57h.01c7.02 0 12.74-5.7 12.75-12.72 0-3.4-1.32-6.59-3.73-9a12.64 12.64 0 0 0-9.03-3.7Zm.01 23.27h-.01c-1.91 0-3.78-.51-5.42-1.48l-.39-.23-3.97 1.04 1.06-3.86-.25-.4a10.54 10.54 0 0 1-1.62-5.62c0-5.83 4.75-10.57 10.6-10.57 2.83 0 5.49 1.1 7.49 3.1a10.5 10.5 0 0 1 3.1 7.47c0 5.82-4.75 10.55-10.59 10.55Zm5.8-7.9c-.32-.16-1.88-.93-2.17-1.03-.29-.11-.5-.16-.71.16-.21.31-.82 1.03-1 1.24-.18.21-.37.24-.69.08-.32-.16-1.34-.49-2.55-1.57a9.55 9.55 0 0 1-1.76-2.19c-.18-.32-.02-.49.14-.65.14-.14.32-.37.48-.55.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.71-1.7-.98-2.33-.26-.62-.52-.53-.71-.54h-.61c-.21 0-.56.08-.85.4-.29.32-1.11 1.08-1.11 2.64 0 1.56 1.14 3.07 1.3 3.28.16.21 2.24 3.42 5.43 4.8.76.33 1.35.52 1.81.67.76.24 1.46.21 2.01.13.61-.09 1.88-.77 2.14-1.51.26-.74.26-1.38.18-1.51-.08-.13-.29-.21-.61-.37Z"
      />
    </svg>
  );
}

export function InstagramIcon() {
  return (
    <svg className="footer-brand-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.5" cy="6.5" r="1.4" fill="currentColor" />
    </svg>
  );
}

export function LucideIcon({ name }) {
  return <i data-lucide={resolveLucideIconName(name)} />;
}

function resolveLucideIconName(name) {
  const iconName = String(name || "").trim().toLowerCase();
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(iconName) ? iconName : "circle-check";
}

export default LucideIcon;
