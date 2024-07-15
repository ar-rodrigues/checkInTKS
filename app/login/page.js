"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, password })
    });

      const responseData = await response.json();
    if (response.ok) {
        localStorage.setItem('name', responseData.user);  
        const daysToExpire = 1; // Number of days until the cookie expires
    const date = new Date();
    date.setTime(date.getTime() + (daysToExpire * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
        document.cookie = `currentUser=${responseData.user}; path=/; ${expires}`;
        
      router.push('/');
    } else {
        setError(responseData.error);
    }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center max-w-md p-4 mx-auto text-black bg-slate-900 ">
      <h1 className="mb-4 text-xl font-bold text-white">Acceder</h1>
      {error && <div className="mb-4 text-red-500">{error}</div>}
      <div className="mb-4">
        <label className="block text-white">Usuario</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
        />
      </div>
      <div className="mb-4">
        <label className="block text-white">Contraseña</label>
        <input
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
        />
        <div className="mt-2">
          <label className="text-white">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
              className="mr-2"
            />
            Mostrar contraseña
          </label>
      </div>
      </div>
      <button
        onClick={handleLogin}
        className="w-full px-4 py-2 text-white bg-blue-500 rounded-md"
      >
        Acceder
      </button>
    </div>
  );
};

export default LoginPage;
