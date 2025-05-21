import { Button, Form, Input, type FormProps } from 'antd';
import { useState } from 'react';
import { Typography } from 'antd';
import userStore from '../stores/userStore';
import { tasksService } from '../services/tasks';
import tasksStore from '../stores/tasksStore';
import { useNotifications } from '../hooks/useNotifications';

const { Title } = Typography;

type FieldType = {
  title?: string;
  description?: string;
};

function TaskForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { userData } = userStore();
  const { addTask } = tasksStore();
  const { openNotificationWithIcon, contextHolder } = useNotifications();

  const [form] = Form.useForm();

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    console.log('Success:', values);

    try {
      setIsLoading(true);
      const { title, description } = values;

      if (!userData?.token) {
        console.error('Token not found');
        openNotificationWithIcon(
          'error',
          'Erro de Autenticação',
          'Você precisa estar logado para criar tarefas.'
        );
        return;
      }

      const data = await tasksService.createTask(userData?.token, {
        title: title || '',
        description: description || '',
      });

      addTask(data);
      openNotificationWithIcon(
        'success',
        'Tarefa Criada',
        'Sua tarefa foi criada com sucesso!'
      );
      form.resetFields();
    } catch (error) {
      console.error('Error creating task:', error);
      openNotificationWithIcon(
        'error',
        'Erro ao Criar Tarefa',
        'Não foi possível criar a tarefa. Tente novamente.'
      );
    } finally {
      setIsLoading(false);
    }
  };
  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (
    errorInfo
  ) => {
    console.log('Failed:', errorInfo);
    openNotificationWithIcon(
      'warning',
      'Formulário Inválido',
      'Por favor, preencha corretamente todos os campos obrigatórios.'
    );
  };

  return (
    <div>
      {contextHolder}
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
