import { useEffect } from 'react';
import userStore from '../stores/userStore';

import { Flex, Layout, Radio, type RadioChangeEvent } from 'antd';
import { Typography } from 'antd';
import { Content, Footer, Header } from 'antd/es/layout/layout';
import TaskForm from '../components/TaskForm';
import { tasksService } from '../services/tasks';
import tasksStore from '../stores/tasksStore';
import type { FilterType } from '../stores/tasksStore';
import { Circle, CircleCheck, X } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';

const { Title } = Typography;

function TasksPage() {
  const { userData } = userStore();
  const { getFilteredTasks, setFilter, filter, setTasks, deleteTask, updateTask } = tasksStore();
  const { openNotificationWithIcon, contextHolder } = useNotifications();
  
  const filteredTasks = getFilteredTasks();

  const handleFilterChange = (e: RadioChangeEvent) => {
    setFilter(e.target.value as FilterType);
  };

  const handleDelete = (taskId: number) => async () => {
    try {
      if (!userData?.token) {
        console.error('Token not found');
        openNotificationWithIcon('error', 'Authentication Error', 'You need to be logged to delete tasks.');
        return;
      }

      await tasksService.deleteTask(userData?.token, taskId);
      deleteTask(taskId);
      openNotificationWithIcon('success', 'Tarefa Excluída', 'A tarefa foi excluída com sucesso.');
    } catch (error) {
      console.error('Error deleting task:', error);
      openNotificationWithIcon('error', 'Error when deleting', 'Deleting the task failed.');
    }
  };

  const handleChangeCompleteStatus = (taskId: number) => async () => {
    try {
      if (!userData?.token) {
        console.error('Token not found');
        openNotificationWithIcon('error', 'Authentication Error', 'You need to be logged to delete tasks..');
        return;
      }

      const taskToUpdate = filteredTasks.find((task) => task.id === taskId);

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
      
      openNotificationWithIcon(
        'success', 
        'Task Updated', 
        `The task is ${!taskToUpdate.completed ? 'completed' : 'pending'}.`
      );
    } catch (error) {
      console.error('Error changing complete status:', error);
      openNotificationWithIcon('error', 'Error updating task', 'Failed to update the task.');
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
    return <p>Something went wrong</p>;
  }

  return (
    <Flex vertical className="h-screen bg-gray-100">
      <Layout>
        {contextHolder}
        <Header className="py-2 mb-0">
          <Title className="text-white">Fini</Title>
        </Header>
        <Content className="flex p-5 overflow-y-auto">
          <div className="mx-auto max-w-md h-min p-8 rounded-lg bg-white shadow-md flex flex-col gap-2">
            <TaskForm />
            
            <div className="flex justify-center my-4">
              <Radio.Group 
                value={filter} 
                onChange={handleFilterChange}
                buttonStyle="solid"
                className="mb-4"
              >
                <Radio.Button value="all">All</Radio.Button>
                <Radio.Button value="completed">Done</Radio.Button>
                <Radio.Button value="incomplete">Pending</Radio.Button>
              </Radio.Group>
            </div>
            
            {filteredTasks.length === 0 ? (
              <div className="text-center text-gray-500 my-4">
                {filter === 'all' 
                  ? 'No tasks found. Create a new one 🚀.' 
                  : `No ${filter === 'completed' ? 'completed' : 'pending'} tasks found.`}
              </div>
            ) : (
              filteredTasks.map((task) => (
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
              ))
            )}
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
