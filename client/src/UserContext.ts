import { createContext } from 'react';

interface User {
  // Define your user interface here
}

interface UserContextType {
  userData: User | null;
  setUserData: (user: User | null) => void;
}

const UserContext = createContext<UserContextType>({
  userData: null,
  setUserData: () => {},
});

export default UserContext;
