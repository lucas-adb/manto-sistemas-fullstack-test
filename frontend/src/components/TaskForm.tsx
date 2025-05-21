import { Button, Form, Input, notification, type FormProps } from 'antd';
import { useState } from 'react';
import { Typography } from 'antd';
import userStore from '../stores/userStore';
import { tasksService } from '../services/tasks';
import tasksStore from '../stores/tasksStore';

const { Title } = Typography;

type FieldType = {
  title?: string;
  description?: string;
};

function TaskForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { userData } = userStore();
  const { addTask } = tasksStore();

  const [form] = Form.useForm();

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    console.log('Success:', values);

    try {
      setIsLoading(true);
      const { title, description } = values;

      if (!userData?.token) {
        console.error('Token not found');
        return;
      }

      const data = await tasksService.createTask(userData?.token, {
        title: title || '',
        description: description || '',
      });

      addTask(data);

      form.resetFields();
    } catch (error) {
      console.error('Error creating task:', error);
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
    <div>
      <Title level={3} className="text-center mb-4">
        What do you want to do next?
      </Title>

      <Form
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        layout="vertical"
        form={form}
      >
        <Form.Item<FieldType>
          name="title"
          label="Title"
          rules={[
            { required: true, message: 'Please input the title of the task' },
          ]}
        >
          <Input placeholder="Title" />
        </Form.Item>

        <Form.Item<FieldType> name="description" label="Description">
          <Input placeholder="Description" />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={isLoading}
            disabled={isLoading}
          >
            Add New Task
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default TaskForm;
