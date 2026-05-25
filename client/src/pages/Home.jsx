import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';

function Home() {
    const navigate = useNavigate()
    const [roomId, setRoomId] = useState('')
    const [username, setUsername] = useState('')
    const [error, setError] = useState('')

    function createRoom() {
        if(!username.trim()) {
            setError('Please enter a username first')
            return
        }

        const newRoomId = uuidv4()
        navigate(`/editor/${newRoomId}`,{
            state: {username}
        })
    }

    function joinRoom() {
        if(!username.trim()) {
            setError('Please enter username')
            return
        }
        if(!roomId.trim()) {
            setError('Please enter a room ID')
            return
        }
        navigate(`/editor/${roomId}`,{
            state: {username}
        })
    }

    function handleKeyDown(e) {
        if(e.key === 'Enter') joinRoom()
    }



    return (
        <div style= {styles.page}>
            <div style= {styles.card}>


                {/* Logo */}
                <div style= {styles.logo}>
                    ⚡CodeSync
                </div>
                <p style= {styles.subtitle}>
                    Real-time collaborative code edtitor
                </p>

                {/* Error */}
                {error && (
                    <div styles= {styles.error}>{error}</div>
                )}

                {/* Username */}
                <input type="text"
                       style={styles.input}
                       placeholder="Your Username"
                       value={username}
                       onChange={(e) => {
                        setUsername(e.target.value)
                        setError('')
                       }}
                />

                {/* Room ID input for joining */}
                <input type="text"
                       style= {styles.input}
                       placeholder="Paste room ID to join"
                       value={roomId}
                       onChange={(e) => {
                        setRoomId(e.target.value)
                        setError('')
                       }}
                       onKeyDown={handleKeyDown}
                />

                {/* Buttons */}
                <button style={styles.joinBtn} onClick={joinRoom}>
                    Join Room
                </button>

                <div style={styles.divider}>
                    <span style={styles.dividerText}>or</span>
                </div>

                <button style={styles.createBtn} onClick={createRoom}>
                    + Create New Room
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
        alignItems: 'cetner',
        justifyContent: 'center',
    },
    card: {
        background: '#252526',
        border: '1px solid #3c3c3c',
        borderRadius: '12px',
        padding: '40px 36px',
        width: '100%',
        maxWidth: '420px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
    },
    logo: {
        color: '#ffffff',
        fontSize: '26px',
        fontWeight: '700px',
        textAlign: 'center',
        letterSpacind: '0.5px',
    },
    subtitle: {
        color: '#888',
        fontSize: '26px',
        textAlign: 'center',
        margin: '0 0 8px 0',
    },
    input: {
        background: '#1e1e1e',
        color: '#cccccc',
        border: '1px solid #3c3c3c',
        borderRadius: '8px',
        padding: '12px 14px',
        fontSize: '14px',
        outline: 'none',
        width: '100%',
        boxSizing: 'border-box',
    },
    joinBtn: {
        background: '#0e7a5f',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        padding: '13px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        width: '100%',
    },
    createBtn: {
        background: 'transparent',
        color: '#4ec9b0',
        border: '1px solid #4ec9b0',
        borderRadius: '8px',
        padding: '13px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        width: '100%',
    },
    divider: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    },
    dividerText: {
        color: '#555',
        fontSize: '12px',
        margin: '0 auto',
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

export default Home