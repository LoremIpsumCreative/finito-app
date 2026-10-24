import { useState } from 'react'
import type { ActivityLog, Workspace } from '../types'

export type SidebarTool = 'workspaces' | 'activity'
export type { ThemePreference } from './SettingsModal'

type WorkspaceSidebarProps = {
  activityLogs: ActivityLog[]
  workspaces: Workspace[]
  currentWorkspaceId: string | null
  newWorkspaceName: string
  setNewWorkspaceName: (value: string) => void
  creatingWorkspace: boolean
  createWorkspace: (event: React.FormEvent<HTMLFormElement>) => void
  switchWorkspace: (workspaceId: string) => void
  activeTool: SidebarTool
  /** When embedded in the mobile sheet, drop the full-height panel chrome. */
  embedded?: boolean
}

const sectionLabel = 'px-2 pb-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]'

// Fixed workspace-level nav (visual parity with Asana; decorative for now).
const NAV: { label: string; paths: string }[] = [
  { label: 'Home', paths: '<path d="M5 12l-2 0l9 -9l9 9l-2 0" /><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" /><path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />' },
  { label: 'Inbox', paths: '<path d="M4 13h3l3 3h4l3 -3h3" /><path d="M5 19h14a2 2 0 0 0 2 -2v-10a2 2 0 0 0 -2 -2h-14a2 2 0 0 0 -2 2v10a2 2 0 0 0 2 2" />' },
  { label: 'My tasks', paths: '<path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" /><path d="M9 12l2 2l4 -4" />' },
  { label: 'Projects', paths: '<path d="M4 5a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" /><path d="M14 5a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" /><path d="M4 15a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" /><path d="M14 15a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" />' },
  { label: 'Portfolios', paths: '<path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z" /><path d="M8 7v-2a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v2" /><path d="M12 12l0 .01" /><path d="M3 13a20 20 0 0 0 18 0" />' },
]

function NavSvg({ paths }: { paths: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-[18px] w-[18px]"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: paths }}
    />
  )
}

/**
 * Asana-style contextual sidebar: fixed workspace nav up top, the active tool's
 * content (workspace list or recent activity) in the middle, Upgrade/Invite below.
 */
export function WorkspaceSidebar({
  activityLogs,
  workspaces,
  currentWorkspaceId,
  newWorkspaceName,
  setNewWorkspaceName,
  creatingWorkspace,
  createWorkspace,
  switchWorkspace,
  activeTool,
  embedded = false,
}: WorkspaceSidebarProps) {
  const [isAddingWorkspace, setIsAddingWorkspace] = useState(false)

  const panel =
    activeTool === 'workspaces' ? (
      <div className="flex flex-col gap-0.5">
        <p className={sectionLabel}>Workspaces</p>
        {workspaces.map((workspace) => {
          const isCurrent = workspace.id === currentWorkspaceId
          return (
            <button
              key={workspace.id}
              type="button"
              onClick={() => switchWorkspace(workspace.id)}
              className={`flex min-h-8 w-full items-center gap-2.5 rounded-[var(--radius-md)] px-2 py-1.5 text-left text-[13px] transition-colors duration-[var(--duration-base)] ${
                isCurrent
                  ? 'bg-[var(--primary-light)] font-medium text-[var(--primary)]'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--background-hover)] hover:text-[var(--text-primary)]'
              }`}
              title={isCurrent ? 'Current workspace' : 'Switch to this workspace'}
            >
              <span
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-[var(--radius-xs)] text-[10px] font-semibold text-[var(--primary-contrast)]"
                style={{ background: 'var(--primary-main)' }}
                aria-hidden="true"
              >
                {workspace.name.slice(0, 1).toUpperCase()}
              </span>
              <span className="min-w-0 flex-1 truncate">{workspace.name}</span>
              {isCurrent && <span className="shrink-0 text-[10px] font-medium text-[var(--primary)]">Current</span>}
            </button>
          )
        })}

        {isAddingWorkspace ? (
          <form
            onSubmit={(event) => {
              createWorkspace(event)
              setIsAddingWorkspace(false)
            }}
            className="mt-0.5 flex min-h-8 w-full items-center gap-2 rounded-[var(--radius-md)] border border-dashed border-[var(--outline-hover)] px-2 py-1.5"
          >
            <input
              value={newWorkspaceName}
              onChange={(event) => setNewWorkspaceName(event.target.value)}
              onBlur={() => {
                if (!newWorkspaceName.trim()) setIsAddingWorkspace(false)
              }}
              onKeyDown={(event) => {
                if (event.key === 'Escape') {
                  setNewWorkspaceName('')
                  setIsAddingWorkspace(false)
                }
              }}
              placeholder="Workspace name"
              className="min-w-0 flex-1 bg-transparent text-[13px] text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
              autoFocus
            />
            <button
              type="submit"
              disabled={creatingWorkspace}
              className="shrink-0 text-[11px] font-medium text-[var(--primary)] disabled:text-[var(--text-disabled)]"
            >
              Add
            </button>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setIsAddingWorkspace(true)}
            className="mt-0.5 flex min-h-8 w-full items-center gap-2.5 rounded-[var(--radius-md)] px-2 py-1.5 text-left text-[13px] text-[var(--text-muted)] transition-colors hover:bg-[var(--background-hover)] hover:text-[var(--text-primary)]"
            title="Add workspace"
          >
            <span className="flex h-5 w-5 shrink-0 items-center justify-center text-[15px] leading-none" aria-hidden="true">+</span>
            Add workspace
          </button>
        )}
      </div>
    ) : (
      <div className="flex flex-col gap-0.5">
        <p className={sectionLabel}>Recent activity</p>
        {activityLogs.length > 0 ? (
          activityLogs.slice(0, 12).map((log) => (
            <div key={log.id} className="rounded-[var(--radius-md)] px-2 py-1.5 hover:bg-[var(--background-hover)]">
              <p className="truncate text-[13px] text-[var(--text-primary)]">{log.action}</p>
              {log.details && <p className="mt-0.5 line-clamp-2 text-[11px] text-[var(--text-muted)]">{log.details}</p>}
            </div>
          ))
        ) : (
          <p className="px-2 py-3 text-[13px] text-[var(--text-muted)]">No activity yet.</p>
        )}
      </div>
    )

  if (embedded) {
    return <aside className="flex w-full flex-col gap-4 p-3">{panel}</aside>
  }

  const navRow =
    'flex w-full items-center gap-2.5 rounded-[var(--radius-md)] px-2 py-1.5 text-left text-[13px] text-[var(--text-secondary)] transition-colors hover:bg-[var(--background-hover)] hover:text-[var(--text-primary)]'

  return (
    <aside
      className="hidden h-full shrink-0 flex-col border-r border-[var(--outline)] bg-[var(--sidebar-bg)] lg:flex"
      style={{ width: 'var(--sidebar-width)' }}
    >
      <nav className="flex flex-col gap-0.5 px-2 pt-3">
        {NAV.map((item) => (
          <button key={item.label} type="button" className={navRow}>
            <span className="shrink-0 text-[var(--text-muted)]">
              <NavSvg paths={item.paths} />
            </span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="mx-2 my-2 border-t border-[var(--outline)]" />

      <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-3">{panel}</div>

      <div className="flex flex-col gap-1.5 border-t border-[var(--outline)] p-2">
        <button
          type="button"
          className="flex h-9 items-center justify-center rounded-[var(--radius-md)] bg-[var(--warning-main)] text-[13px] font-semibold text-[var(--warning-contrast)] transition-opacity hover:opacity-90"
        >
          Upgrade
        </button>
        <button
          type="button"
          className="flex h-9 items-center justify-center gap-1.5 rounded-[var(--radius-md)] border border-[var(--outline)] text-[13px] font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--background-hover)]"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
            <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" /><path d="M16 19h6" /><path d="M19 16v6" /><path d="M6 21v-2a4 4 0 0 1 4 -4h4" />
          </svg>
          Invite
        </button>
      </div>
    </aside>
  )
}
