import { useEffect } from 'react';
import userStore from '../stores/userStore';

import { Flex, Layout } from 'antd';
import { Typography } from 'antd';
import { Content, Footer, Header } from 'antd/es/layout/layout';
import TaskForm from '../components/TaskForm';
import { tasksService } from '../services/tasks';
import tasksStore from '../stores/tasksStore';
import { Circle, CircleCheck, X } from 'lucide-react';

const { Title } = Typography;

function TasksPage() {
  const { userData } = userStore();
  const { tasks, setTasks, deleteTask, updateTask } = tasksStore();

  const handleDelete = (taskId: number) => async () => {
    try {
      if (!userData?.token) {
        console.error('Token not found');
        return;
      }

      await tasksService.deleteTask(userData?.token, taskId);

      deleteTask(taskId);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleChangeCompleteStatus = (taskId: number) => async () => {
    try {
      if (!userData?.token) {
        console.error('Token not found');
        return;
      }

      const taskToUpdate = tasks.find((task) => task.id === taskId);

      if (!taskToUpdate) {
        console.error('Task not found');
        return;
      }

      await tasksService.updateTask(userData?.token, taskId, {
        completed: !taskToUpdate.completed,
      });

      updateTask(taskId, {
        completed: !taskToUpdate.completed,
      });
    } catch (error) {
      console.error('Error changing complete status:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!userData?.token) {
          console.error('Token not found');
          return;
        }

        const data = await tasksService.getTasks(userData?.token);

        setTasks(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [setTasks, userData?.token]);

  if (!userData) {
    <p>Something went wrong</p>;
  }

  useEffect(() => {
    console.log('Tasks:', tasks);
  }, [tasks]);

  return (
    <Flex vertical className="h-screen bg-gray-100">
      <Layout>
        <Header className="py-2 mb-0">
          <Title className="text-white">Fini</Title>
        </Header>
        <Content className="flex p-5 overflow-y-auto">
          <div className="mx-auto max-w-md h-min p-8 rounded-lg bg-white shadow-md flex flex-col gap-2">
            <TaskForm />
            {tasks?.map((task) => (
              <div
                key={task.id}
                className="p-4 bg-white shadow-md rounded-lg mb-4 border border-gray-200"
              >
                <div className="flex justify-between items-center">
                  <div className="flex justify-between items-center gap-2">
                    <div
                      className={`cursor-pointer ${
                        task.completed ? 'text-green-500' : 'text-gray-500'
                      }`}
                      onClick={handleChangeCompleteStatus(task.id)}
                    >
                      {task.completed ? (
                        <CircleCheck width={15} />
                      ) : (
                        <Circle width={15} />
                      )}
                    </div>
                    <Title level={4} className="m-0">
                      {task.title}
                    </Title>
                  </div>
                  <span
                    className="cursor-pointer"
                    onClick={handleDelete(task.id)}
                  >
                    <X width={15} />
                  </span>
                </div>
                <p>{task.description}</p>
              </div>
            ))}
          </div>
        </Content>
        <Footer>
          <p className="text-center">Made with ❤️ by Lucas Alves</p>
        </Footer>
      </Layout>
    </Flex>
  );
}

export default TasksPage;
