import { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate: string | null;
  priority: 'low' | 'medium' | 'high';
  description: string;
  createdAt: string;
}

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    // ローカルストレージからタスクを読み込む
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  useEffect(() => {
    // タスクの変更をローカルストレージに保存
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      id: nanoid(),
      createdAt: new Date().toISOString(),
      ...taskData
    };
    setTasks([...tasks, newTask]);
    return newTask;
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, ...updates } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const toggleTaskCompletion = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const getTaskById = (id: string) => {
    return tasks.find(task => task.id === id) || null;
  };

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    getTaskById
  };
};
