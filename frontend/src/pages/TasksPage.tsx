import { useEffect } from 'react';
import { api } from '../lib/api';
import userStore from '../stores/userStore';

function TasksPage() {
  const { userData } = userStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!userData?.token) {
          console.error('Token not found');
        }

        const data = await api('/tasks', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userData?.token}`,
          },
        });
        console.log(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [userData?.token]);

  return <p>tasks page</p>;
}

export default TasksPage;
