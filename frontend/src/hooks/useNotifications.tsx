import { notification } from 'antd';

export type NotificationType = 'success' | 'info' | 'warning' | 'error';

export const notificationInfos = {
  success: {
    message: 'Sucesso',
    description: 'Operação realizada com sucesso.',
  },
  info: {
    message: 'Informação',
    description: 'Esta é uma notificação informativa.',
  },
  warning: {
    message: 'Aviso',
    description: 'Este é um aviso importante.',
  },
  error: {
    message: 'Erro',
    description: 'Algo deu errado. Por favor, tente novamente.',
  },
};

export const useNotifications = () => {
  const [notificationApi, contextHolder] = notification.useNotification();

  const openNotificationWithIcon = (
    type: NotificationType, 
    message: string = notificationInfos[type].message, 
    description: string = notificationInfos[type].description
  ) => {
    notificationApi[type]({
      message,
      description,
      className: `custom-notification-${type}`,
    });
  };

  return {
    openNotificationWithIcon,
    contextHolder,
  };
};
