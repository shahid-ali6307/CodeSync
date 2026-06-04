import { useState } from "react";
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {signupUser, loginUser } from '../utils/api'

function AuthPage() {

    const [isLogin, setIsLogin] = useState(true)
    const [form, setForm] = useState({username: '', email: '', password: ''})
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)


    const { login } = useAuth()
    const navigate = useNavigate()

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value})
        setError('')
    }

    async function handleSubmit() {
        setLoading(true)
        try{
            let data 
            if(isLogin) {
                data = await loginUser(form.email, form.password)
            } else {
                data = await signupUser(form.username, form.email, form.password)
            }

            console.log('SERVER RESPONSE:', data) 

            if(data.token) {
                login(data.user, data.token)
                setTimeout(() => navigate('/'), 100)
            } else {
                setError(data.message || 'Something went wrong')
            }
        } catch (err) {
            setError('Server error. Is your backend running ?')
        }
        setLoading(false)
    }

    async function handleKeyDown(e) {
        if(e.key === 'Enter') handleSubmit()
    }

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <div style={styles.logo}>
                    ⚡ CodeSync
                </div>
                <div style={styles.toggle}>
                    <button style={isLogin ? styles.toggleActive : styles.toggleInactive} onClick={() => setIsLogin(true)}>
                        Login
                    </button>
                    <button style={isLogin ? styles.toggleActive : styles.toggleInactive} onClick={() => setIsLogin(false)}>
                        Sign Up
                    </button>
                </div>

                {error && <div style={styles.error}>{error}</div> }

                {!isLogin && (
                    <input style={styles.input}
                    name="username"
                    placeholder="Username"
                    value={form.username}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    />
                )}
                 <input
          style={styles.input}
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        <input
          style={styles.input}
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        
        <button style={styles.submitBtn}
        onClick={handleSubmit}
        disabled={loading}>
            {loading ? 'Please wait.....' : isLogin ? 'Login' : 'Create Account' }
        </button>

            </div>
        </div>
    )
}

const styles = {
    page: {
        height: '100vh',
        background: '#1e1e1e',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    card: {
        background: '#252526',
    border: '1px solid #3c3c3c',
    borderRadius: '12px',
    padding: '40px 36px',
    width: '100%',
    maxWidth: '400px',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    },
    logo: {
    color: '#fff',
    fontSize: '24px',
    fontWeight: '700',
    textAlign: 'center',
  },
  toggle: {
    display: 'flex',
    borderRadius: '8px',
    overflow: 'hidden',
    border: '1px solid #3c3c3c',
  },
  toggleActive: {
    flex: 1,
    padding: '10px',
    background: '#0e7a5f',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '13px',
  },
  toggleInactive: {
    flex: 1,
    padding: '10px',
    background: 'transparent',
    color: '#888',
    border: 'none',
    cursor: 'pointer',
    fontSize: '13px',
  },
  input: {
    background: '#1e1e1e',
    border: '1px solid #3c3c3c',
    borderRadius: '8px',
    padding: '12px 14px',
    color: '#cccccc',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
  },
  submitBtn: {
    background: '#0e7a5f',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '13px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  error: {
    background: '#3a1a1a',
    border: '1px solid #7a2020',
    color: '#f48771',
    borderRadius: '6px',
    padding: '10px 12px',
    fontSize: '13px',
  },
   
}

export default AuthPage