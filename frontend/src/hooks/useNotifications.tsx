import { notification } from 'antd';

export type NotificationType = 'success' | 'info' | 'warning' | 'error';

export const notificationInfos = {
  success: {
    message: 'Success',
    description: 'This is a success notification.',
  },
  info: {
    message: 'Info',
    description: 'This is an info notification.',
  },
  warning: {
    message: 'Warning',
    description: 'Warning: This is a warning notification.',
  },
  error: {
    message: 'Error',
    description: 'Something went wrong.',
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
