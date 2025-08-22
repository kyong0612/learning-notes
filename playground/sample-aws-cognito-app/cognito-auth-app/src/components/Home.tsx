import React, { useEffect, useState } from 'react';
import { getCurrentUser, signOut } from 'aws-amplify/auth';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (err) {
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (err) {
      console.error('サインアウトエラー:', err);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>読み込み中...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1>ようこそ！</h1>
        <div style={styles.userInfo}>
          <p>ログイン中のユーザー:</p>
          <p style={styles.email}>{user?.username}</p>
          <p style={styles.userId}>ユーザーID: {user?.userId}</p>
        </div>
        <div style={styles.content}>
          <p>認証に成功しました。これは保護されたページです。</p>
          <p>ログインしているユーザーのみがこのコンテンツを表示できます。</p>
        </div>
        <button onClick={handleSignOut} style={styles.button}>
          サインアウト
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '600px',
    textAlign: 'center' as const,
  },
  userInfo: {
    backgroundColor: '#f0f8ff',
    padding: '1rem',
    borderRadius: '8px',
    margin: '1.5rem 0',
  },
  email: {
    fontSize: '1.2rem',
    fontWeight: 'bold' as const,
    color: '#007bff',
    margin: '0.5rem 0',
  },
  userId: {
    fontSize: '0.9rem',
    color: '#666',
    fontFamily: 'monospace',
  },
  content: {
    margin: '2rem 0',
    padding: '1.5rem',
    backgroundColor: '#e8f5e9',
    borderRadius: '8px',
    lineHeight: 1.6,
  },
  button: {
    padding: '0.75rem 2rem',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
    marginTop: '1rem',
  },
  loading: {
    fontSize: '1.2rem',
    color: '#666',
  },
};

export default Home;