export type User = {
  id: number;
  email: string;
  name: string;
};

export type UserData = {
  token: string;
  user: User;
};

export type UserStore = {
  userData: UserData | null;
  setUserData: (data: UserData) => void;
  clearUserData: () => void;
};
