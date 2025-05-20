import { Button, Form, Input, notification, type FormProps } from 'antd';
import { api } from '../lib/api';
import { useState, useEffect } from 'react';
import { Typography } from 'antd';
import userStore from '../stores/userStore';
import type { UserData } from '../types/user';

const { Title, Text } = Typography;

// right now, the only used is the error one
const notificationInfos = {
  success: {
    message: 'Success',
    description: 'You have successfully logged in.',
  },
  info: {
    message: 'Info',
    description: 'This is an info notification.',
  },
  warning: {
    message: 'Warning',
    description: 'This is a warning notification.',
  },
  error: {
    message: 'Erro',
    description: 'Something went wrong. Please try again.',
  },
};

type FieldType = {
  name?: string;
  email: string;
  password: string;
};

type NotificationType = 'success' | 'info' | 'warning' | 'error';

async function mockLoading(timeout: number, log: string) {
  return await new Promise((resolve) => {
    setTimeout(() => {
      console.log(log);
      resolve(true);
    }, timeout);
  });
}

function LoginForm() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] =
    useState<NotificationType>('success');
  const [notificationApi, contextHolder] = notification.useNotification();

  const { setUserData, userData } = userStore();

  const signIn = async (values: FieldType): Promise<UserData> => {
    const { email, password } = values;

    try {
      const data = await api('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      setUserData(data as UserData);
      return data as UserData;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signUp = async (values: FieldType): Promise<void> => {
    const { email, password, name } = values;
    try {
      const response = await api('/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          name,
        }),
      });

      console.log('data', response);
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  };

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    console.log('Success:', values);

    try {
      setIsLoading(true);
      await mockLoading(2000, 'Loading...');

      if (isRegistering) {
        try {
          await signUp(values);
          await signIn(values);
        } catch (error) {
          console.error('Erro no processo de cadastro/login:', error);
          openNotificationWithIcon('error');
        }
      } else {
        try {
          await signIn(values);
          openNotificationWithIcon('success');
        } catch (error) {
          console.error('Erro no login:', error);
          openNotificationWithIcon('error');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };
  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (
    errorInfo
  ) => {
    console.log('Failed:', errorInfo);
  };

  // Função para definir o tipo e mostrar a notificação
  const openNotificationWithIcon = (type: NotificationType) => {
    setNotificationType(type);
    setShowNotification(true);
  };

  useEffect(() => {
    if (showNotification) {
      notificationApi[notificationType]({
        message: notificationInfos[notificationType].message,
        description: notificationInfos[notificationType].description,
        className: `custom-notification-${notificationType}`,
      });

      setShowNotification(false);
    }
  }, [
    notificationApi,
    showNotification,
    notificationType,
    setShowNotification,
  ]);

  return (
    <div className="mx-auto max-w-md h-min p-8 rounded-lg bg-white shadow-md flex flex-col">
      {contextHolder}
      <Title level={3} className="text-center mb-4">
        Hello {userData?.user.name} 👋
      </Title>

      <Text className="mx-auto mb-6">Let's finish what you started.</Text>
      <Form
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        layout="vertical"
      >
        <Form.Item<FieldType>
          name="email"
          label="Email"
          rules={[{ required: true, message: 'Please input your email!' }]}
        >
          <Input type="email" placeholder="Email" />
        </Form.Item>

        <Form.Item<FieldType>
          name="password"
          label="Password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>

        <Form.Item<FieldType>
          name="name"
          label="Username"
          rules={[
            {
              required: isRegistering ? true : false,
              message: 'Please input your username!',
            },
          ]}
          className={isRegistering ? '' : 'invisible'}
        >
          <Input placeholder="Username" />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={isLoading}
            disabled={isLoading}
          >
            {isRegistering ? 'Sign Up' : 'Sign In'}
          </Button>
        </Form.Item>

        <Button
          onClick={() => setIsRegistering(!isRegistering)}
          disabled={isLoading}
          type="link"
          block
        >
          {isRegistering
            ? 'Already have an account? Sign in'
            : "Don't have an account? Sign up"}
        </Button>
      </Form>
    </div>
  );
}

export default LoginForm;
