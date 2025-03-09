import { useState } from 'react';

interface TaskFormProps {
  onAddTask: (task: {
    title: string;
    description: string;
    dueDate: string | null;
    priority: 'low' | 'medium' | 'high';
    completed: boolean;
  }) => void;
}

export default function TaskForm({ onAddTask }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask({
      title,
      description,
      dueDate: dueDate ? dueDate : null,
      priority,
      completed: false
    });

    // フォームをリセット
    setTitle('');
    setDescription('');
    setDueDate('');
    setPriority('medium');
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 mb-6 border rounded-lg shadow-sm bg-white">
      <h2 className="mb-4 text-xl font-semibold">新しいタスクを追加</h2>
      
      <div className="mb-4">
        <label htmlFor="title" className="block mb-1 font-medium">
          タイトル*
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="タスクのタイトルを入力"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="description" className="block mb-1 font-medium">
          説明
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="タスクの詳細を入力"
          rows={2}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="dueDate" className="block mb-1 font-medium">
            期限
          </label>
          <input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div>
          <label htmlFor="priority" className="block mb-1 font-medium">
            優先度
          </label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
            className="w-full p-2 border rounded"
          >
            <option value="low">低</option>
            <option value="medium">中</option>
            <option value="high">高</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        className="w-full p-2 text-white bg-blue-600 rounded hover:bg-blue-700"
      >
        タスクを追加
      </button>
    </form>
  );
}
