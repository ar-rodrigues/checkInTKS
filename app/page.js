"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Form from './components/form.js';
import Image from 'next/image.js';

const MainPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [name, setName] = useState('');
  const [data, setData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const userName = localStorage.getItem('name');
    if (userName) {
      setIsLoggedIn(true);
      setName(userName);
    }

    const fetchData = async () => {
      const response = await fetch('/api/data');
      const result = await response.json();
      setData(result);
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full max-w-md gap-5 p-4 mx-auto bg-black">
      <Image src={"/logoTKSdark.png"} alt='logo' width={100} height={100}/>
      
      {isLoggedIn ? (
        <Form user={name} data={data} />
      ) : (
        <button
          onClick={() => router.push('/login')}
          className="px-4 py-2 text-white bg-blue-500 rounded-md"
        >
          Ir para acceso
        </button>
      )}
    </div>
  );
};

export default MainPage;
