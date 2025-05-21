import { create } from 'zustand';

export type Task = {
  completed: boolean;
  createdAt: string;
  description: string;
  id: number;
  title: string;
  userId: number;
  updatedAt: string;
};

interface TasksState {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  deleteTask: (taskId: number) => void;
  updateTask: (taskId: number, updatedTask: Partial<Task>) => void;
}

const tasksStore = create<TasksState>((set) => ({
  tasks: [],
  setTasks: (tasks: Task[]) => set({ tasks }),
  addTask: (task: Task) => set((state) => ({ tasks: [...state.tasks, task] })),
  deleteTask: (taskId: number) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== taskId),
    })),
  updateTask: (taskId: number, updatedTask: Partial<Task>) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId ? { ...task, ...updatedTask } : task
      ),
    })),
}));

export default tasksStore;
