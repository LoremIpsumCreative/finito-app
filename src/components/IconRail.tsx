import { Icon } from './icons'
import type { IconName } from './icons'
import type { SidebarTool } from './WorkspaceSidebar'

type IconRailProps = {
  activeTool: SidebarTool
  setActiveTool: (tool: SidebarTool) => void
  onOpenSettings: () => void
  signOut: () => void
  userEmail: string
}

const navItems: { tool: SidebarTool; label: string; icon: IconName }[] = [
  { tool: 'workspaces', label: 'Spaces', icon: 'workspaces' },
  { tool: 'activity', label: 'Activity', icon: 'activity' },
]

function initials(email: string) {
  const name = email.split('@')[0] ?? ''
  return name.slice(0, 2).toUpperCase() || '?'
}

/**
 * Asana-style 64px icon rail: the app's top-level switch. Brand mark on top,
 * tool icons that drive the contextual sidebar, settings + account at the bottom.
 */
export function IconRail({ activeTool, setActiveTool, onOpenSettings, signOut, userEmail }: IconRailProps) {
  const itemClass = (isActive: boolean) =>
    `flex w-full flex-col items-center gap-1 rounded-[var(--radius-md)] px-1 py-2 text-[10px] font-medium transition-colors duration-[var(--duration-base)] ${
      isActive
        ? 'bg-[var(--background-active)] text-[var(--text-primary)]'
        : 'text-[var(--text-muted)] hover:bg-[var(--background-hover)] hover:text-[var(--text-primary)]'
    }`

  return (
    <aside
      className="hidden h-full shrink-0 flex-col items-center gap-1 border-r border-[var(--outline)] bg-[var(--rail-bg)] px-2 py-3 lg:flex"
      style={{ width: 'var(--rail-width)' }}
    >
      <img src="/app-logo_finito.svg" alt="Finito" className="mb-2 h-8 w-8" />

      <nav className="flex w-full flex-col items-center gap-1">
        {navItems.map((item) => (
          <button
            key={item.tool}
            type="button"
            onClick={() => setActiveTool(item.tool)}
            className={itemClass(activeTool === item.tool)}
            aria-pressed={activeTool === item.tool}
          >
            <Icon name={item.icon} className="h-[22px] w-[22px]" strokeWidth={1.75} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="mt-auto flex w-full flex-col items-center gap-1">
        <button type="button" onClick={onOpenSettings} className={itemClass(false)}>
          <Icon name="settings" className="h-[22px] w-[22px]" strokeWidth={1.75} />
          Settings
        </button>
        <button
          type="button"
          onClick={signOut}
          className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary-main)] text-[11px] font-semibold text-[var(--primary-contrast)]"
          title={`${userEmail} — sign out`}
          aria-label="Account and sign out"
        >
          {initials(userEmail)}
        </button>
      </div>
    </aside>
  )
}
