import { api } from "../lib/api";
import type { Task } from "../stores/tasksStore";

export const tasksService = {
  getTasks: async (token: string) : Promise<Task[]> => {
    const data = await api('/tasks', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!data) {
      throw new Error('Failed to fetch tasks');
    }

    return data as Task[];
  },

  createTask: async (token: string, task: { title: string; description: string }) : Promise<Task> => {
    const data = await api('/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(task),
    });

    if (!data) {
      throw new Error('Failed to fetch tasks');
    }

    return data as Task;
  },

  deleteTask: async (token: string, taskId: number) : Promise<void> => {
    await api(`/tasks/${taskId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  },

  updateTask: async (token: string, taskId: number, task: { title?: string; description?: string; completed?: boolean }) : Promise<Task> => {
    const data = await api(`/tasks/${taskId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(task),
    });

    if (!data) {
      throw new Error('Failed to fetch tasks');
    }

    return data as Task;
  }
}