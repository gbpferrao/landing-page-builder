export const appHeaderSecondaryButtonClass =
  "border-white/15 bg-white/10 text-white hover:border-white/30 hover:bg-white/20 hover:text-white";

export const appHeaderPrimaryButtonClass =
  "border-zinc-700 bg-zinc-900 text-white hover:border-zinc-600 hover:bg-zinc-800 hover:text-white";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function AppHeader({ actions, backAction, projectControl, title = "A&A Studio" }) {
  return (
    <header className="app-header">
      <div className="app-header-inner">
        <div className="app-header-brand">
          {backAction}
          <h1>{title}</h1>
          {projectControl ? (
            <>
              <span className="app-header-divider" aria-hidden="true" />
              {projectControl}
            </>
          ) : null}
        </div>
        {actions ? <div className="app-header-actions">{actions}</div> : null}
      </div>
    </header>
  );
}

export default AppHeader;
