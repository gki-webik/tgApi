// pages/auth/data.tsx
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const AuthDataPage = () => {
  const router = useRouter();
  const [userData, setUserData] = useState({
    name: '',
    telegramId: '',
    provider: ''
  });

  useEffect(() => {
    if (router.isReady) {
      const { name, telegramId, provider } = router.query;
      setUserData({
        name: name as string || '',
        telegramId: telegramId as string || '',
        provider: provider as string || ''
      });
    }
  }, [router.isReady, router.query]);

  return (
    <div>
      <h1>Данные пользователя</h1>
      <p><strong>Имя:</strong> {userData.name}</p>
      <p><strong>Telegram ID:</strong> {userData.telegramId}</p>
      <p><strong>Провайдер:</strong> {userData.provider}</p>
    </div>
  );
};

export default AuthDataPage;