import { Typography } from 'antd';
const { Title } = Typography;
import { Header } from 'antd/es/layout/layout';
import { LogOut } from 'lucide-react';
import userStore from '../stores/userStore';
import { useNavigate } from 'react-router';

function MainHeader({ isLoggedIn }: { isLoggedIn: boolean }) {
  const { clearUserData } = userStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      clearUserData();
      console.log('User logged out');

      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <Header className="py-2 mb-0 flex justify-between items-center">
      <Title className="text-white mb-0">Fini</Title>
      {isLoggedIn && (
        <div
          className="transition-all duration-300 transform hover:scale-110"
          onClick={handleLogout}
        >
          <LogOut className="text-white cursor-pointer" />
        </div>
      )}
    </Header>
  );
}

export default MainHeader;
