import { useEffect } from 'react';
import { Flex, Layout } from 'antd';
import { Content, Footer } from 'antd/es/layout/layout';
import LoginForm from './components/LoginForm';
import userStore from './stores/userStore';
import { useNavigate } from 'react-router';
import MainHeader from './components/MainHeader';

function App() {

  const { userData } = userStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (userData && userData.user.name) {
      navigate('/tasks')
    }
  }, [navigate, userData])

  return (
    <Flex vertical className="h-screen bg-gray-100">
      <Layout>
        <MainHeader isLoggedIn={!!userData} />
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
