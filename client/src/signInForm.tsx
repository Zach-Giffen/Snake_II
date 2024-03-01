import { FormEvent, useState } from 'react';

type Props = {
  onSignIn: () => void;
  setPage: (page: 'register' | 'snake' | 'sign-in') => void;
};

export default function SignInForm({ onSignIn, setPage }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setIsLoading(true);
      const formData = new FormData(event.currentTarget);
      const userData = Object.fromEntries(formData.entries());
      const req = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      };
      const res = await fetch('/api/auth/sign-in', req);
      if (!res.ok) {
        throw new Error(`fetch Error ${res.status}`);
      }
      const { user, token } = await res.json();
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('userId', user.userId.toString());
      sessionStorage.setItem('username', user.username);
      onSignIn();
    } catch (err) {
      alert(`Error signing in: ${err}`);
    } finally {
      setIsLoading(false);
    }
  }

  const pageSwap = () => {
    setPage('register');
  };

  return (
    <div className="signIn">
      <div className="row">
        <div className="column-full d-flex justify-between">
          <h1>Sign In</h1>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="row margin-bottom-1">
          <div className="column-half">
            <label className="margin-bottom-1 d-block">
              Username:
              <input
                required
                name="username"
                type="text"
                className="input-b-color text-padding input-b-radius purple-outline input-height margin-bottom-2 d-block width-100"
              />
              <br></br>
            </label>
            <label className="margin-bottom-1 d-block">
              Password:
              <input
                required
                name="password"
                type="password"
                className="input-b-color text-padding input-b-radius purple-outline input-height margin-bottom-2 d-block width-100"
              />
            </label>
          </div>
        </div>
        <div className="row">
          <div className="column-full d-flex justify-between">
            <button disabled={isLoading} className="signInButton">
              Sign In
            </button>
            <button className="signInSwap" onClick={pageSwap}>
              Register
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
