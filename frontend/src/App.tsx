import { useEffect } from 'react';
import { api } from './lib/api';
import { Flex, Layout } from 'antd';
import { Typography } from 'antd';
const { Title } = Typography;
import { Content, Footer, Header } from 'antd/es/layout/layout';
import LoginForm from './components/LoginForm';

function App() {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api('/tasks', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Authorization: `Bearer ${localStorage.getItem('token')}`,
            Authorization: `Bearer ${import.meta.env.VITE_TOKEN_TEST}`, // testes
          },
        });
        console.log(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Flex vertical className="h-screen bg-gray-100">
      <Layout>
        <Header className='py-2 mb-0'>
          <Title className="text-white">Fini</Title>
        </Header>
        <Content className="flex p-5">
          <LoginForm />
        </Content>
        <Footer>
          <p className="text-center">Made with ❤️ by Lucas Alves</p>
        </Footer>
      </Layout>
    </Flex>
  );
}

export default App;
