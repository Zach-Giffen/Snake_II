import { useState } from 'react';
import SnakeGameII from './snakeII/snakeIIGame';
import RegistrationForm from './registrationForm';
import SignInForm from './signInForm';

type PageType = 'snake' | 'register' | 'sign-in';

export default function App() {
  // const [serverData, setServerData] = useState('');

  const [page, setPage] = useState<PageType>('register');
  // useEffect(() => {
  //   async function readServerData() {
  //     const resp = await fetch('/api/hello');
  //     const data = await resp.json();

  //     console.log('Data from server:', data);

  //     setServerData(data.message);
  //   }

  //   readServerData();
  // }, []);

  const handleRegistrationSuccess = () => {
    setPage('sign-in');
  };

  const handleSignInSuccess = () => {
    setPage('snake');
  };

  return (
    <>
      {page === 'register' && (
        <RegistrationForm onRegistrationSuccess={handleRegistrationSuccess} />
      )}
      {page === 'sign-in' && <SignInForm onSignIn={handleSignInSuccess} />}
      {page === 'snake' && <SnakeGameII />}
    </>
  );
}
