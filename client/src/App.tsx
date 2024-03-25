import { useState } from 'react';
import SnakeGameII from './snakeII/snakeIIGame';
import RegistrationForm from './registrationForm';
import SignInForm from './signInForm';

type PageType = 'snake' | 'register' | 'sign-in';

export default function App() {
  const [page, setPage] = useState<PageType>('sign-in');

  const goToSiginIn = () => {
    setPage('sign-in');
  };

  const goToSnake = () => {
    setPage('snake');
  };

  return (
    <>
      {page === 'register' && (
        <RegistrationForm
          onRegistrationSuccess={goToSiginIn}
          setPage={setPage}
        />
      )}
      {page === 'sign-in' && (
        <SignInForm onSignIn={goToSnake} setPage={setPage} />
      )}
      {page === 'snake' && (
        <SnakeGameII OnSignOut={goToSiginIn} setPage={setPage} />
      )}
    </>
  );
}
