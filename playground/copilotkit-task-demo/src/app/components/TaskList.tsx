import TaskItem from './TaskItem';
import { Task } from '../hooks/useTasks';

interface TaskListProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

export default function TaskList({ tasks, onToggleTask, onDeleteTask }: TaskListProps) {
  // タスクを未完了と完了でグループ化
  const incompleteTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  // 優先度でソート (高 -> 中 -> 低)
  const sortByPriority = (a: Task, b: Task) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  };

  // 未完了タスクは優先度でソート
  const sortedIncompleteTasks = [...incompleteTasks].sort(sortByPriority);
  
  // 完了タスクは完了日時の新しい順（実装簡略化のため、ここでは固定順）
  const sortedCompletedTasks = [...completedTasks];

  return (
    <div>
      <h2 className="mb-3 text-xl font-semibold">タスク一覧</h2>
      
      {sortedIncompleteTasks.length === 0 && completedTasks.length === 0 && (
        <p className="p-4 text-center text-gray-500">
          タスクがありません。新しいタスクを追加してください。
        </p>
      )}

      {sortedIncompleteTasks.length > 0 && (
        <div className="mb-6">
          <h3 className="mb-2 font-medium">未完了 ({sortedIncompleteTasks.length})</h3>
          {sortedIncompleteTasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={onToggleTask}
              onDelete={onDeleteTask}
            />
          ))}
        </div>
      )}

      {sortedCompletedTasks.length > 0 && (
        <div>
          <h3 className="mb-2 font-medium">完了済み ({sortedCompletedTasks.length})</h3>
          {sortedCompletedTasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={onToggleTask}
              onDelete={onDeleteTask}
            />
          ))}
        </div>
      )}
    </div>
  );
}
