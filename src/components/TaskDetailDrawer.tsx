import { useEffect } from 'react'
import type { ReactNode } from 'react'
import type { Section, Task, TaskComment, TaskDependency } from '../types'
import { difficultyOptions, priorityOptions } from '../constants'
import { formatDate, getLabel } from '../utils'
import { Icon } from './icons'
import { StatusOptions, SubtaskProgress } from './ui'

type DependencyLink = {
  dependency: TaskDependency
  task: Task | undefined
}

type TaskDetailDrawerProps = {
  selectedTask: Task
  onClose: () => void
  sections: Section[]
  updatingStatusTaskId: string | null
  updateTaskStatus: (taskId: string, status: string) => void
  updatingPriorityTaskId: string | null
  updateTaskPriority: (taskId: string, priority: string) => void
  updatingSectionTaskId: string | null
  updateTaskSection: (taskId: string, sectionId: string) => void
  getSubtasks: (taskId: string) => Task[]
  deletingTaskId: string | null
  deleteTask: (taskId: string) => void
  subtaskDrafts: Record<string, string>
  setSubtaskDrafts: (value: React.SetStateAction<Record<string, string>>) => void
  creatingSubtaskTaskId: string | null
  createSubtask: (parentTask: Task) => void
  getTaskComments: (taskId: string) => TaskComment[]
  commentDrafts: Record<string, string>
  setCommentDrafts: (value: React.SetStateAction<Record<string, string>>) => void
  addingCommentTaskId: string | null
  addComment: (taskId: string) => void
  deletingCommentId: string | null
  deleteComment: (commentId: string) => void
  getBlockingTasks: (taskId: string) => DependencyLink[]
  getBlockedTasks: (taskId: string) => DependencyLink[]
  removingDependencyId: string | null
  removeTaskDependency: (dependencyId: string) => void
  addingDependencyTaskId: string | null
  addTaskDependency: (taskId: string, dependsOnTaskId: string) => void
  selectedTaskAvailableBlockers: Task[]
  selectedTaskCanMoveUp: boolean
  selectedTaskCanMoveDown: boolean
  editingTaskId: string | null
  editTitle: string
  setEditTitle: (value: string) => void
  editDescription: string
  setEditDescription: (value: string) => void
  editDifficulty: string
  setEditDifficulty: (value: string) => void
  editStartDate: string
  setEditStartDate: (value: string) => void
  editDueDate: string
  setEditDueDate: (value: string) => void
  savingTaskId: string | null
  saveTaskEdits: (taskId: string) => void
  cancelEditingTask: () => void
  startEditingTask: (task: Task) => void
  quickSetTaskDone: (task: Task) => void
  quickReopenTask: (task: Task) => void
  duplicatingTaskId: string | null
  duplicateTask: (task: Task) => void
  movingTaskId: string | null
  moveTask: (taskId: string, direction: 'up' | 'down') => void
  archivingTaskId: string | null
  archiveTask: (task: Task) => void
  restoreTask: (task: Task) => void
}

// Asana-style field row: muted fixed-width label on the left, value/control right.
function FieldRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex min-h-9 items-start gap-3 py-0.5">
      <span className="w-28 shrink-0 pt-2 text-[12px] text-[var(--text-muted)]">{label}</span>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}

// Inline control inside a field row — reads like text, reveals affordance on hover.
const fieldControl =
  'w-full max-w-[260px] cursor-pointer rounded-[var(--radius-sm)] border border-transparent bg-transparent px-1.5 py-1 text-[14px] text-[var(--text-primary)] outline-none transition-colors hover:bg-[var(--background-hover)] focus:bg-[var(--background-paper)] focus:shadow-[var(--ring-primary)] disabled:cursor-not-allowed disabled:opacity-60'

const sectionLabel = 'text-[14px] font-medium text-[var(--text-primary)]'

export function TaskDetailDrawer({
  selectedTask,
  onClose,
  sections,
  updatingStatusTaskId,
  updateTaskStatus,
  updatingPriorityTaskId,
  updateTaskPriority,
  updatingSectionTaskId,
  updateTaskSection,
  getSubtasks,
  deletingTaskId,
  deleteTask,
  subtaskDrafts,
  setSubtaskDrafts,
  creatingSubtaskTaskId,
  createSubtask,
  getTaskComments,
  commentDrafts,
  setCommentDrafts,
  addingCommentTaskId,
  addComment,
  deletingCommentId,
  deleteComment,
  getBlockingTasks,
  getBlockedTasks,
  removingDependencyId,
  removeTaskDependency,
  addingDependencyTaskId,
  addTaskDependency,
  selectedTaskAvailableBlockers,
  selectedTaskCanMoveUp,
  selectedTaskCanMoveDown,
  editingTaskId,
  editTitle,
  setEditTitle,
  editDescription,
  setEditDescription,
  editDifficulty,
  setEditDifficulty,
  editStartDate,
  setEditStartDate,
  editDueDate,
  setEditDueDate,
  savingTaskId,
  saveTaskEdits,
  cancelEditingTask,
  startEditingTask,
  quickSetTaskDone,
  quickReopenTask,
  duplicatingTaskId,
  duplicateTask,
  movingTaskId,
  moveTask,
  archivingTaskId,
  archiveTask,
  restoreTask,
}: TaskDetailDrawerProps) {
  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const isDone = selectedTask.status === 'done'
  const subtasks = getSubtasks(selectedTask.id)
  const completedSubtasks = subtasks.filter((subtask) => subtask.status === 'done').length
  const comments = getTaskComments(selectedTask.id)
  const blockingLinks = getBlockingTasks(selectedTask.id)
  const blockedLinks = getBlockedTasks(selectedTask.id)
  const isEditing = editingTaskId === selectedTask.id

  const actionBtn =
    'rounded-[var(--radius-sm)] px-2.5 py-1.5 text-[13px] font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--background-hover)] hover:text-[var(--text-primary)] disabled:cursor-not-allowed disabled:opacity-60'

  return (
    <div className="fixed inset-0 z-40">
      <div
        className="absolute inset-0 bg-black/30"
        style={{ animation: 'finito-fade-in 0.2s ease' }}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="absolute inset-y-0 right-0 flex w-full max-w-[720px] flex-col border-l border-[var(--outline)] bg-[var(--background-paper)] shadow-[var(--shadow-popover)]"
        style={{ animation: 'finito-pane-in 0.5s var(--ease-standard)' }}
      >
        {/* Top action bar */}
        <div className="flex shrink-0 items-center justify-between gap-2 border-b border-[var(--outline)] px-4 py-2">
          <button
            type="button"
            onClick={() => (isDone ? quickReopenTask(selectedTask) : quickSetTaskDone(selectedTask))}
            className={`flex h-8 items-center gap-1.5 rounded-[var(--radius-md)] px-3 text-[13px] font-medium transition-colors ${
              isDone
                ? 'border border-transparent bg-[var(--success-main)] text-[var(--success-contrast)]'
                : 'border border-[var(--outline-strong)] text-[var(--text-secondary)] hover:bg-[var(--background-hover)] hover:text-[var(--text-primary)]'
            }`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <path d="M5 12l5 5l9 -9" />
            </svg>
            {isDone ? 'Completed' : 'Mark complete'}
          </button>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close task details"
            className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)] text-[var(--text-muted)] transition-colors hover:bg-[var(--background-hover)] hover:text-[var(--text-primary)]"
          >
            <Icon name="x" className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {isEditing ? (
            <input
              type="text"
              value={editTitle}
              onChange={(event) => setEditTitle(event.target.value)}
              aria-label="Task title"
              className="w-full rounded-[var(--radius-sm)] border border-[var(--outline)] bg-[var(--background-paper)] px-2 py-1 text-[22px] font-semibold text-[var(--text-primary)] outline-none focus:border-[var(--primary)]"
            />
          ) : (
            <h2 className={`text-[22px] font-semibold leading-tight text-[var(--text-primary)] ${isDone ? 'line-through opacity-70' : ''}`}>
              {selectedTask.title}
            </h2>
          )}

          {/* Field stack */}
          <div className="mt-4">
            <FieldRow label="Status">
              <select
                aria-label={`Status for ${selectedTask.title}`}
                value={selectedTask.status}
                disabled={updatingStatusTaskId === selectedTask.id}
                onChange={(event) => updateTaskStatus(selectedTask.id, event.target.value)}
                className={fieldControl}
              >
                <StatusOptions />
              </select>
            </FieldRow>

            <FieldRow label="Priority">
              <select
                aria-label={`Priority for ${selectedTask.title}`}
                value={selectedTask.priority ?? ''}
                disabled={updatingPriorityTaskId === selectedTask.id}
                onChange={(event) => updateTaskPriority(selectedTask.id, event.target.value)}
                className={fieldControl}
              >
                <option value="">No priority</option>
                {priorityOptions.map((priority) => (
                  <option key={priority.value} value={priority.value}>
                    {priority.label}
                  </option>
                ))}
              </select>
            </FieldRow>

            <FieldRow label="Section">
              <select
                aria-label={`Section for ${selectedTask.title}`}
                value={selectedTask.section_id ?? ''}
                disabled={updatingSectionTaskId === selectedTask.id}
                onChange={(event) => updateTaskSection(selectedTask.id, event.target.value)}
                className={fieldControl}
              >
                {sections.map((section) => (
                  <option key={section.id} value={section.id}>
                    {section.name}
                  </option>
                ))}
              </select>
            </FieldRow>

            <FieldRow label="Scope">
              <span className="px-1.5 text-[14px] text-[var(--text-secondary)]">
                {selectedTask.difficulty ? getLabel(difficultyOptions, selectedTask.difficulty) : 'Not scoped'}
              </span>
            </FieldRow>

            <FieldRow label="Start date">
              <span className="px-1.5 text-[14px] text-[var(--text-secondary)]">{formatDate(selectedTask.start_date)}</span>
            </FieldRow>

            <FieldRow label="Due date">
              <span className="px-1.5 text-[14px] text-[var(--text-secondary)]">{formatDate(selectedTask.due_date)}</span>
            </FieldRow>

            <FieldRow label="Blocked by">
              <div className="flex flex-col gap-2 pt-1">
                {blockingLinks.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {blockingLinks.map(({ dependency, task: blockingTask }) => (
                      <span
                        key={dependency.id}
                        className="inline-flex items-center gap-1.5 rounded-[var(--radius-full)] bg-[var(--error-light)] px-2.5 py-1 text-[12px] font-medium text-[var(--error-dark)]"
                      >
                        {blockingTask?.title ?? 'Unknown task'}
                        <button
                          type="button"
                          disabled={removingDependencyId === dependency.id}
                          onClick={() => removeTaskDependency(dependency.id)}
                          className="text-[var(--error-dark)]/70 transition hover:text-[var(--error-dark)] disabled:opacity-65"
                          aria-label={`Remove blocker ${blockingTask?.title ?? 'task'}`}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <select
                  aria-label={`Add blocker for ${selectedTask.title}`}
                  value=""
                  disabled={addingDependencyTaskId === selectedTask.id || selectedTaskAvailableBlockers.length === 0}
                  onChange={(event) => {
                    addTaskDependency(selectedTask.id, event.target.value)
                    event.currentTarget.value = ''
                  }}
                  className="max-w-[260px] cursor-pointer rounded-[var(--radius-sm)] border border-transparent bg-transparent px-1.5 py-1 text-[13px] text-[var(--text-muted)] outline-none transition-colors hover:bg-[var(--background-hover)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <option value="">{addingDependencyTaskId === selectedTask.id ? 'Adding blocker…' : '+ Add blocker'}</option>
                  {selectedTaskAvailableBlockers.map((candidateTask) => (
                    <option key={candidateTask.id} value={candidateTask.id}>
                      {candidateTask.title}
                    </option>
                  ))}
                </select>
              </div>
            </FieldRow>

            {blockedLinks.length > 0 && (
              <FieldRow label="Blocks">
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {blockedLinks.map(({ dependency, task: blockedTask }) => (
                    <span
                      key={dependency.id}
                      className="inline-flex items-center rounded-[var(--radius-full)] bg-[var(--primary-light)] px-2.5 py-1 text-[12px] font-medium text-[var(--primary)]"
                    >
                      {blockedTask?.title ?? 'Unknown task'}
                    </span>
                  ))}
                </div>
              </FieldRow>
            )}
          </div>

          {/* Description */}
          <div className="mt-5 border-t border-[var(--outline)] pt-4">
            <p className={sectionLabel}>Description</p>
            {isEditing ? (
              <textarea
                value={editDescription}
                onChange={(event) => setEditDescription(event.target.value)}
                rows={3}
                aria-label="Task description"
                className="mt-2 w-full resize-none rounded-[var(--radius-sm)] border border-[var(--outline)] bg-[var(--background-paper)] px-3 py-2 text-[14px] text-[var(--text-primary)] outline-none focus:border-[var(--primary)]"
              />
            ) : selectedTask.description ? (
              <p className="mt-2 whitespace-pre-wrap text-[14px] leading-6 text-[var(--text-secondary)]">{selectedTask.description}</p>
            ) : (
              <p className="mt-2 text-[14px] text-[var(--text-muted)]">What is this task about?</p>
            )}

            {isEditing && (
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                <label className="block text-[12px] text-[var(--text-muted)]">
                  Scope
                  <select
                    value={editDifficulty}
                    onChange={(event) => setEditDifficulty(event.target.value)}
                    className="mt-1 w-full rounded-[var(--radius-sm)] border border-[var(--outline)] bg-[var(--background-paper)] px-2 py-1.5 text-[14px] text-[var(--text-primary)] outline-none focus:border-[var(--primary)]"
                  >
                    {difficultyOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block text-[12px] text-[var(--text-muted)]">
                  Start date
                  <input
                    type="date"
                    value={editStartDate}
                    onChange={(event) => setEditStartDate(event.target.value)}
                    className="mt-1 w-full rounded-[var(--radius-sm)] border border-[var(--outline)] bg-[var(--background-paper)] px-2 py-1.5 text-[14px] text-[var(--text-primary)] outline-none focus:border-[var(--primary)]"
                  />
                </label>
                <label className="block text-[12px] text-[var(--text-muted)]">
                  Due date
                  <input
                    type="date"
                    value={editDueDate}
                    onChange={(event) => setEditDueDate(event.target.value)}
                    className="mt-1 w-full rounded-[var(--radius-sm)] border border-[var(--outline)] bg-[var(--background-paper)] px-2 py-1.5 text-[14px] text-[var(--text-primary)] outline-none focus:border-[var(--primary)]"
                  />
                </label>
              </div>
            )}
          </div>

          {/* Subtasks */}
          <div className="mt-5 border-t border-[var(--outline)] pt-4">
            <div className="flex items-center justify-between gap-3">
              <p className={sectionLabel}>Subtasks</p>
              {subtasks.length > 0 && <span className="text-[12px] text-[var(--text-muted)]">{completedSubtasks}/{subtasks.length}</span>}
            </div>

            {subtasks.length > 0 && <SubtaskProgress done={completedSubtasks} total={subtasks.length} className="mt-2" />}

            {subtasks.length > 0 && (
              <div className="mt-2 flex flex-col">
                {subtasks.map((subtask) => (
                  <div key={subtask.id} className="group/st flex items-center gap-2 border-b border-[var(--outline-soft)] py-1.5">
                    <button
                      type="button"
                      aria-label={subtask.status === 'done' ? 'Mark subtask not done' : 'Mark subtask done'}
                      disabled={updatingStatusTaskId === subtask.id}
                      onClick={() => updateTaskStatus(subtask.id, subtask.status === 'done' ? 'not_started' : 'done')}
                      className="shrink-0"
                    >
                      {subtask.status === 'done' ? (
                        <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[var(--success-main)]">
                          <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3"><path d="M5 12l5 5l9 -9" /></svg>
                        </span>
                      ) : (
                        <span className="block h-[18px] w-[18px] rounded-full border-[1.5px] border-[var(--text-disabled)]" />
                      )}
                    </button>
                    <p className={`min-w-0 flex-1 truncate text-[14px] text-[var(--text-primary)] ${subtask.status === 'done' ? 'line-through opacity-60' : ''}`}>
                      {subtask.title}
                    </p>
                    <button
                      type="button"
                      disabled={deletingTaskId === subtask.id}
                      onClick={() => deleteTask(subtask.id)}
                      className="shrink-0 text-[var(--text-muted)] opacity-0 transition hover:text-[var(--error-dark)] group-hover/st:opacity-100 disabled:opacity-65"
                      aria-label={`Delete subtask ${subtask.title}`}
                    >
                      <Icon name="x" className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-2 flex items-center gap-2">
              <span className="block h-[18px] w-[18px] shrink-0 rounded-full border-[1.5px] border-dashed border-[var(--text-disabled)]" />
              <input
                value={subtaskDrafts[selectedTask.id] ?? ''}
                onChange={(event) =>
                  setSubtaskDrafts((currentDrafts) => ({ ...currentDrafts, [selectedTask.id]: event.target.value }))
                }
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && (subtaskDrafts[selectedTask.id] ?? '').trim()) createSubtask(selectedTask)
                }}
                placeholder="Add a subtask"
                className="min-w-0 flex-1 bg-transparent text-[14px] text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
              />
              {creatingSubtaskTaskId === selectedTask.id && <span className="text-[12px] text-[var(--text-muted)]">Adding…</span>}
            </div>
          </div>

          {/* Activity / comments */}
          <div className="mt-5 border-t border-[var(--outline)] pt-4">
            <p className={sectionLabel}>Activity</p>

            <div className="mt-3 flex items-start gap-2">
              <input
                value={commentDrafts[selectedTask.id] ?? ''}
                onChange={(event) =>
                  setCommentDrafts((currentDrafts) => ({ ...currentDrafts, [selectedTask.id]: event.target.value }))
                }
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && (commentDrafts[selectedTask.id] ?? '').trim()) addComment(selectedTask.id)
                }}
                placeholder="Add a comment"
                className="min-w-0 flex-1 rounded-[var(--radius-md)] border border-[var(--outline)] bg-[var(--background-paper)] px-3 py-2 text-[14px] text-[var(--text-primary)] outline-none transition focus:border-[var(--primary)] placeholder:text-[var(--text-muted)]"
              />
              <button
                type="button"
                disabled={addingCommentTaskId === selectedTask.id || !(commentDrafts[selectedTask.id] ?? '').trim()}
                onClick={() => addComment(selectedTask.id)}
                className="shrink-0 rounded-[var(--radius-md)] bg-[var(--primary-main)] px-3 py-2 text-[13px] font-medium text-[var(--primary-contrast)] transition hover:bg-[var(--primary-dark)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {addingCommentTaskId === selectedTask.id ? 'Sending…' : 'Comment'}
              </button>
            </div>

            {comments.length > 0 ? (
              <div className="mt-3 flex flex-col gap-3">
                {comments.map((comment) => (
                  <div key={comment.id} className="group/c flex gap-2.5">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--surface-subtle)] text-[11px] font-semibold text-[var(--text-secondary)]">
                      {(comment.body ?? '?').slice(0, 1).toUpperCase()}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] text-[var(--text-muted)]">
                          {comment.created_at
                            ? new Intl.DateTimeFormat('en-AU', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(comment.created_at))
                            : 'No date'}
                        </span>
                        <button
                          type="button"
                          disabled={deletingCommentId === comment.id}
                          onClick={() => deleteComment(comment.id)}
                          className="text-[12px] text-[var(--text-muted)] opacity-0 transition hover:text-[var(--error-dark)] group-hover/c:opacity-100 disabled:opacity-65"
                        >
                          {deletingCommentId === comment.id ? 'Deleting…' : 'Delete'}
                        </button>
                      </div>
                      <p className="mt-0.5 whitespace-pre-wrap text-[14px] leading-6 text-[var(--text-primary)]">{comment.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-[14px] text-[var(--text-muted)]">No activity yet.</p>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="shrink-0 border-t border-[var(--outline)] px-4 py-2">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={savingTaskId === selectedTask.id}
                onClick={() => saveTaskEdits(selectedTask.id)}
                className="rounded-[var(--radius-sm)] bg-[var(--primary-main)] px-3 py-1.5 text-[13px] font-medium text-[var(--primary-contrast)] transition hover:bg-[var(--primary-dark)] disabled:opacity-60"
              >
                {savingTaskId === selectedTask.id ? 'Saving…' : 'Save changes'}
              </button>
              <button type="button" onClick={cancelEditingTask} className={actionBtn}>
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-0.5">
              <button type="button" onClick={() => startEditingTask(selectedTask)} className={actionBtn}>
                Edit details
              </button>
              <button type="button" disabled={duplicatingTaskId === selectedTask.id} onClick={() => duplicateTask(selectedTask)} className={actionBtn}>
                {duplicatingTaskId === selectedTask.id ? 'Duplicating…' : 'Duplicate'}
              </button>
              <button type="button" disabled={!selectedTaskCanMoveUp || movingTaskId === selectedTask.id} onClick={() => moveTask(selectedTask.id, 'up')} className={actionBtn}>
                Move up
              </button>
              <button type="button" disabled={!selectedTaskCanMoveDown || movingTaskId === selectedTask.id} onClick={() => moveTask(selectedTask.id, 'down')} className={actionBtn}>
                Move down
              </button>
              {selectedTask.archived_at ? (
                <button type="button" disabled={archivingTaskId === selectedTask.id} onClick={() => restoreTask(selectedTask)} className={actionBtn}>
                  {archivingTaskId === selectedTask.id ? 'Restoring…' : 'Restore'}
                </button>
              ) : (
                <button type="button" disabled={archivingTaskId === selectedTask.id} onClick={() => archiveTask(selectedTask)} className={actionBtn}>
                  {archivingTaskId === selectedTask.id ? 'Archiving…' : 'Archive'}
                </button>
              )}
              <button
                type="button"
                disabled={deletingTaskId === selectedTask.id}
                onClick={() => deleteTask(selectedTask.id)}
                className="ml-auto rounded-[var(--radius-sm)] px-2.5 py-1.5 text-[13px] font-medium text-[var(--error-dark)] transition-colors hover:bg-[var(--error-light)] disabled:opacity-60"
              >
                {deletingTaskId === selectedTask.id ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
