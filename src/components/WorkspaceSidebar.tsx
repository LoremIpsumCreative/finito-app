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

/**
 * Asana-style contextual sidebar. The far-left rail chooses the tool; this panel
 * shows that tool's content (workspace list or recent activity) as flat rows.
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

  const shell = embedded
    ? 'flex w-full flex-col gap-4 p-3'
    : 'hidden h-full shrink-0 flex-col gap-4 overflow-y-auto border-r border-[var(--outline)] bg-[var(--sidebar-bg)] px-2 py-3 lg:flex'

  return (
    <aside className={shell} style={embedded ? undefined : { width: 'var(--sidebar-width)' }}>
      {activeTool === 'workspaces' ? (
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
                {isCurrent && (
                  <span className="shrink-0 text-[10px] font-medium text-[var(--primary)]">Current</span>
                )}
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
                {log.details && (
                  <p className="mt-0.5 line-clamp-2 text-[11px] text-[var(--text-muted)]">{log.details}</p>
                )}
              </div>
            ))
          ) : (
            <p className="px-2 py-3 text-[13px] text-[var(--text-muted)]">No activity yet.</p>
          )}
        </div>
      )}
    </aside>
  )
}
