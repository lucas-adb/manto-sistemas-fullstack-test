import { Button, Form, Input, type FormProps } from 'antd';
import { api } from '../lib/api';
import { useState } from 'react';
import { Typography } from 'antd';

const { Title, Text } = Typography;

type FieldType = {
  name?: string;
  email: string;
  password: string;
};

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

  const signIn = async (values: FieldType) => {
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

      console.log('data', data);
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  const signUp = async (values: FieldType) => {
    const { email, password, name } = values;
    const data = await api('/auth/register', {
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
    console.log('data', data);
  };

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    console.log('Success:', values);

    try {
      setIsLoading(true);
      await mockLoading(2000, 'Loading...');
      if (isRegistering) {
        await signUp(values);
      } else {
        await signIn(values);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (
    errorInfo
  ) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className="mx-auto max-w-md h-min p-8 rounded-lg bg-white shadow-md flex flex-col">
      <Title level={3} className="text-center mb-4">
        Hello 👋
      </Title>

      <Text className="mx-auto mb-6">
        Let's finish what you started.
      </Text>
      <Form onFinish={onFinish} onFinishFailed={onFinishFailed} layout='vertical'>  
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
          rules={[{ required: isRegistering ? true : false, message: 'Please input your username!' }]}
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
