'use client';

import { useState } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import { useTasks } from './hooks/useTasks';
import { useCopilotAction, useCopilotReadable } from "@copilotkit/react-core";

export default function Home() {
  const { tasks, addTask, updateTask, deleteTask, toggleTaskCompletion } = useTasks();
  const [filter, setFilter] = useState<'all' | 'incomplete' | 'completed'>('all');

  // CopilotKitにタスク一覧を共有
  useCopilotReadable({
    description: "現在のタスク一覧。各タスクにはid, title, description, dueDate, priority, completed, createdAtの属性がある",
    value: tasks,
  });

  // タスク追加アクションを定義
  useCopilotAction({
    name: "addNewTask",
    description: "新しいタスクを追加する",
    parameters: [
      { 
        name: "title", 
        type: "string", 
        description: "タスクのタイトル", 
        required: true 
      },
      { 
        name: "description", 
        type: "string", 
        description: "タスクの詳細説明", 
        required: false 
      },
      { 
        name: "dueDate", 
        type: "string", 
        description: "タスクの期限（YYYY-MM-DD形式）", 
        required: false 
      },
      { 
        name: "priority", 
        type: "string", 
        enum: ["low", "medium", "high"],
        description: "タスクの優先度（low, medium, high）", 
        required: false 
      }
    ],
    handler: ({ title, description, dueDate, priority }) => {
      const newTask = addTask({
        title,
        description: description || "",
        dueDate: dueDate || null,
        priority: (priority as 'low' | 'medium' | 'high') || 'medium',
        completed: false
      });
      return { 
        success: true, 
        taskId: newTask.id,
        message: `"${title}"というタスクを追加しました`
      };
    }
  });

  // タスク完了トグルアクション
  useCopilotAction({
    name: "toggleTaskStatus",
    description: "タスクの完了状態を切り替える",
    parameters: [
      { 
        name: "taskId", 
        type: "string", 
        description: "対象タスクのID", 
        required: true 
      }
    ],
    handler: ({ taskId }) => {
      const task = tasks.find(t => t.id === taskId);
      if (!task) {
        return { success: false, message: "指定されたIDのタスクが見つかりません" };
      }
      toggleTaskCompletion(taskId);
      return { 
        success: true, 
        message: `"${task.title}"を${!task.completed ? '完了' : '未完了'}に変更しました` 
      };
    }
  });

  // タスク削除アクション
  useCopilotAction({
    name: "deleteTask",
    description: "タスクを削除する",
    parameters: [
      { 
        name: "taskId", 
        type: "string", 
        description: "対象タスクのID", 
        required: true 
      }
    ],
    handler: ({ taskId }) => {
      const task = tasks.find(t => t.id === taskId);
      if (!task) {
        return { success: false, message: "指定されたIDのタスクが見つかりません" };
      }
      deleteTask(taskId);
      return { 
        success: true, 
        message: `"${task.title}"を削除しました` 
      };
    }
  });

  // タスク更新アクション
  useCopilotAction({
    name: "updateTask",
    description: "タスクを更新する",
    parameters: [
      { 
        name: "taskId", 
        type: "string", 
        description: "対象タスクのID", 
        required: true 
      },
      { 
        name: "title", 
        type: "string", 
        description: "更新後のタイトル", 
        required: false 
      },
      { 
        name: "description", 
        type: "string", 
        description: "更新後の説明", 
        required: false 
      },
      { 
        name: "dueDate", 
        type: "string", 
        description: "更新後の期限（YYYY-MM-DD形式）", 
        required: false 
      },
      { 
        name: "priority", 
        type: "string", 
        enum: ["low", "medium", "high"],
        description: "更新後の優先度", 
        required: false 
      }
    ],
    handler: ({ taskId, ...updates }) => {
      const task = tasks.find(t => t.id === taskId);
      if (!task) {
        return { success: false, message: "指定されたIDのタスクが見つかりません" };
      }
      updateTask(taskId, updates);
      return { 
        success: true, 
        message: `"${task.title}"を更新しました` 
      };
    }
  });

  // タスク検索アクション
  useCopilotAction({
    name: "searchTasks",
    description: "キーワードでタスクを検索する",
    parameters: [
      { 
        name: "keyword", 
        type: "string", 
        description: "検索キーワード", 
        required: true 
      }
    ],
    handler: ({ keyword }) => {
      const results = tasks.filter(task => 
        task.title.toLowerCase().includes(keyword.toLowerCase()) || 
        (task.description && task.description.toLowerCase().includes(keyword.toLowerCase()))
      );
      
      return { 
        success: true, 
        count: results.length,
        results: results.map(task => ({
          id: task.id,
          title: task.title,
          completed: task.completed,
          priority: task.priority,
          dueDate: task.dueDate
        }))
      };
    }
  });

  // 表示するタスクをフィルタリング
  const filteredTasks = tasks.filter(task => {
    if (filter === 'incomplete') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true; // 'all'の場合はすべて表示
  });

  return (
    <main className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold">AIタスク管理アプリ</h1>
          <p className="mt-2 text-gray-600">
            CopilotKitを活用したインテリジェントなタスク管理アプリ
          </p>
          <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-700">
            右下のアイコンをクリックして、AIアシスタントに話しかけてみてください。<br />
            「明日までに企画書を完成させるタスクを追加して」「高優先度のタスクを教えて」など
          </div>
        </header>

        <div className="mb-6">
          <TaskForm onAddTask={addTask} />
        </div>

        <div className="mb-4">
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded ${
                filter === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              すべて
            </button>
            <button
              onClick={() => setFilter('incomplete')}
              className={`px-3 py-1 rounded ${
                filter === 'incomplete' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              未完了
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-3 py-1 rounded ${
                filter === 'completed' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              完了済み
            </button>
          </div>
        </div>

        <TaskList
          tasks={filteredTasks}
          onToggleTask={toggleTaskCompletion}
          onDeleteTask={deleteTask}
        />
      </div>
    </main>
  );
}
