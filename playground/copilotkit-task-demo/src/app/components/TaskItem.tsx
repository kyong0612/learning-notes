import { Task } from '../hooks/useTasks';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  const priorityColors = {
    low: 'bg-blue-100 text-blue-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  };

  return (
    <div className={`p-4 mb-2 border rounded-lg shadow-sm ${task.completed ? 'bg-gray-50' : 'bg-white'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggle(task.id)}
            className="w-5 h-5 mr-3 border-gray-300 rounded"
          />
          <div className={task.completed ? 'task-completed' : ''}>
            <h3 className="text-lg font-medium">{task.title}</h3>
            <p className="text-sm text-gray-600">{task.description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {task.dueDate && (
            <span className="text-xs text-gray-500">
              期限: {format(new Date(task.dueDate), 'yyyy年MM月dd日', { locale: ja })}
            </span>
          )}
          <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[task.priority]}`}>
            {task.priority === 'low' ? '低' : task.priority === 'medium' ? '中' : '高'}
          </span>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1 text-gray-400 hover:text-red-500"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
