type ViewMode = 'card' | 'table' | 'kanban' | 'timeline' | 'calendar'

type ViewTabsProps = {
  viewMode: ViewMode
  setViewMode: (viewMode: ViewMode) => void
}

const tabs: { mode: ViewMode; label: string }[] = [
  { mode: 'table', label: 'List' },
  { mode: 'card', label: 'Card' },
  { mode: 'kanban', label: 'Board' },
  { mode: 'timeline', label: 'Timeline' },
  { mode: 'calendar', label: 'Calendar' },
]

/** Asana-style project view tabs: blue text on a tinted pill when selected (6px radius, 28px tall). */
export function ViewTabs({ viewMode, setViewMode }: ViewTabsProps) {
  return (
    <nav className="flex items-center gap-1 overflow-x-auto">
      {tabs.map((tab) => {
        const isActive = viewMode === tab.mode
        return (
          <button
            key={tab.mode}
            type="button"
            onClick={() => setViewMode(tab.mode)}
            className={`h-7 shrink-0 whitespace-nowrap rounded-[var(--radius-sm)] px-2.5 text-[13px] font-medium transition-colors duration-[var(--duration-base)] ${
              isActive
                ? 'bg-[var(--primary-light)] text-[var(--primary)]'
                : 'text-[var(--text-secondary)] hover:bg-[var(--background-hover)] hover:text-[var(--text-primary)]'
            }`}
            aria-current={isActive ? 'page' : undefined}
          >
            {tab.label}
          </button>
        )
      })}
    </nav>
  )
}
