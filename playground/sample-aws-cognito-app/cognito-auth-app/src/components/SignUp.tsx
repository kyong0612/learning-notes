import React, { useState } from 'react';
import { signUp, confirmSignUp, signIn } from 'aws-amplify/auth';
import { useNavigate } from 'react-router-dom';

const SignUp: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('パスワードが一致しません');
      return;
    }

    if (password.length < 8) {
      setError('パスワードは8文字以上である必要があります');
      return;
    }

    setLoading(true);

    try {
      const { isSignUpComplete, nextStep } = await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
          },
        },
      });

      if (nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
        setShowVerification(true);
      }
    } catch (err: any) {
      setError(err.message || 'サインアップに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { isSignUpComplete } = await confirmSignUp({
        username: email,
        confirmationCode: verificationCode,
      });

      if (isSignUpComplete) {
        // 自動的にログイン
        const { isSignedIn } = await signIn({ username: email, password });
        if (isSignedIn) {
          navigate('/home');
        }
      }
    } catch (err: any) {
      setError(err.message || '確認コードの検証に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {!showVerification ? (
        <form onSubmit={handleSignUp} style={styles.form}>
          <h2>サインアップ</h2>
          {error && <div style={styles.error}>{error}</div>}
          <input
            type="email"
            placeholder="メールアドレス"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="password"
            placeholder="パスワード（8文字以上）"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="password"
            placeholder="パスワード（確認）"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={styles.input}
          />
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? '処理中...' : 'サインアップ'}
          </button>
          <p style={styles.link}>
            既にアカウントをお持ちの方は{' '}
            <a href="/login" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>
              ログイン
            </a>
          </p>
        </form>
      ) : (
        <form onSubmit={handleVerification} style={styles.form}>
          <h2>メールアドレスの確認</h2>
          <p style={styles.info}>
            {email} に送信された確認コードを入力してください
          </p>
          {error && <div style={styles.error}>{error}</div>}
          <input
            type="text"
            placeholder="確認コード"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            required
            style={styles.input}
          />
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? '確認中...' : '確認'}
          </button>
        </form>
      )}
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
  form: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    margin: '0.5rem 0',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    boxSizing: 'border-box' as const,
  },
  button: {
    width: '100%',
    padding: '0.75rem',
    margin: '1rem 0',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    padding: '0.5rem',
    backgroundColor: '#ffebee',
    borderRadius: '4px',
    marginBottom: '1rem',
  },
  info: {
    color: '#666',
    marginBottom: '1rem',
    textAlign: 'center' as const,
  },
  link: {
    textAlign: 'center' as const,
    marginTop: '1rem',
  },
};

export default SignUp;