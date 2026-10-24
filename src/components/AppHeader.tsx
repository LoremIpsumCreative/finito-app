import { Icon } from './icons'
import { IconButton } from './ui'

type AppHeaderProps = {
  searchQuery: string
  setSearchQuery: (value: string) => void
  onNewTask: () => void
  onToggleSidebar: () => void
}

/**
 * Asana-style global top bar (48px): hamburger · Create (coral) · centered search · brand on mobile.
 * View tabs live in the project tab bar (ViewTabs), not here.
 */
export function AppHeader({ searchQuery, setSearchQuery, onNewTask, onToggleSidebar }: AppHeaderProps) {
  return (
    <header
      className="flex shrink-0 items-center gap-3 border-b border-[var(--outline)] bg-[var(--topbar-bg)] px-3"
      style={{ height: 'var(--topbar-height)' }}
    >
      <button
        type="button"
        onClick={onToggleSidebar}
        aria-label="Toggle sidebar"
        className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-md)] text-[var(--text-secondary)] transition-colors hover:bg-[var(--background-hover)] lg:flex"
      >
        <Icon name="section" className="h-[18px] w-[18px]" />
      </button>

      {/* Brand — shown on mobile (on desktop it lives in the rail) */}
      <div className="flex shrink-0 items-center gap-2 lg:hidden">
        <img src="/app-logo_finito.svg" alt="Finito" className="h-6 w-6" />
        <span
          className="text-[18px] leading-none text-[var(--text-primary)]"
          style={{ fontFamily: 'var(--font-display)', fontWeight: 500 }}
        >
          Finito
        </span>
      </div>

      <button
        type="button"
        onClick={onNewTask}
        className="flex h-8 shrink-0 items-center gap-1.5 rounded-[var(--radius-full)] bg-[var(--brand)] pl-2.5 pr-3.5 text-[13px] font-semibold text-[var(--brand-contrast)] transition-colors duration-[var(--duration-base)] hover:bg-[var(--brand-hover)] active:bg-[var(--brand-active)]"
      >
        <Icon name="add" className="h-4 w-4" />
        Create
      </button>

      <div className="relative mx-auto hidden w-full max-w-[460px] sm:block">
        <Icon
          name="search"
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]"
        />
        <input
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search tasks"
          className="h-8 w-full rounded-[var(--radius-full)] border border-[var(--outline)] bg-[var(--surface-subtle)] pl-9 pr-9 text-[13px] text-[var(--text-primary)] outline-none transition focus:border-[var(--primary-main)] focus:bg-[var(--background-paper)] focus:shadow-[var(--ring-primary)] placeholder:text-[var(--text-muted)]"
        />
        {searchQuery ? (
          <IconButton
            icon="x"
            variant="ghost"
            size="xs"
            aria-label="Clear search"
            onClick={() => setSearchQuery('')}
            className="absolute right-2 top-1/2 -translate-y-1/2"
          />
        ) : (
          <kbd className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-[var(--outline)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--text-muted)]">
            ⌘K
          </kbd>
        )}
      </div>
    </header>
  )
}
