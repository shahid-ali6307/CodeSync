import { useState, useEffect, useCallback } from "react";
import Editor from "../components/Editor/Editor";
import LanguagesSelector from "../components/LanguageSelector/LanguageSelector";
import { DEFAULT_CODE } from "../utils/constants";
import UserSidebar from "../components/UserSidebar/UserSidebar";
import Toast from "../components/Toast/Toast";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import socket from "../utils/socket"

function EditorPage() {
    const { roomId } = useParams()
    const location = useLocation()
    const navigate = useNavigate()
    const { user, logout } = useAuth()

    const [language, setLanguage]= useState('javascript')
    const [code, setCode]= useState(DEFAULT_CODE['javascript'])
    const [users, setUsers] = useState([])
    const [toast, setToast] = useState('')

    // Get username — from auth context (preferred) or location state
    const username = user?.username || location.state?.username

    useEffect(() => {
        if(!username) {
            navigate('/')
            return
        }

        //connect socket and join room
    socket.connect()
    socket.emit('join_room', {roomId, username})

    //Listen for updated users list
    socket.on('room_users', (roomUsers) => {
        setUsers(roomUsers)
    })

    // Someone joined
    socket.on('user_joined', ({ username: joinedUser }) => {
        setToast(`${joinedUser} joined the room`)
    })

    // Someone left 
    socket.on('user_left', ({ username: leftUser}) => {
        setToast(`${leftUser} left the room`)
    })

    // Cleanup onunmount
    return () => {
        socket.off('room_users')
        socket.off('user_joined')
        socket.off('user_left')
        socket.disconnect()
    }
    }, [roomId, username, navigate] )


    function handleLanguageChange(newLang){
        setLanguage(newLang)
        setCode(DEFAULT_CODE[newLang])
    }

    function handleCodeChange(newCode){
        setCode(newCode)
    }

    function handleLogout(){
        logout()
        setTimeout(() => navigate('/auth'), 100)
    }

    function copyRoomId() {
    navigator.clipboard.writeText(roomId)
    setToast('Room ID copied to clipboard!')
  }

  const closeToast = useCallback(() => setToast(''), [])

    return (
        <div style={styles.page}>

                   {/* Navbar */}

        <div style={styles.navbar}>
            <span style={styles.logo}>
                ⚡ CodeSync
            </span>

        <div style={styles.navCenter}>
            <span style={styles.roomLabel}>Room:</span>
            <span style={styles.roomId}>{roomId.slice(0, 8)}...</span>
            <button style={styles.copyBtn} onClick={copyRoomId}>
                  Copy ID
            </button>
        </div>

      <div style={styles.navRight}>
          <LanguagesSelector
            language={language}
            onLanguageChange={handleLanguageChange}
          />
          <button style={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>

      </div>

                 {/* Main Area */}
                 <div style={styles.main}>
                    {/* Editor */}
                   <div style={styles.editorArea}>
                   <Editor
                     language={language}
                     code={code}
                     onChange={setCode}
                   />
                  </div>

                  {/* Users sidebar */}
                <UserSidebar users={users} currentUser={username} />
      </div>

      {/* Toast */}
      {toast && <Toast message={toast} onClose={closeToast} />}

 </div>
    )
}

const styles = {
    page: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: '#1e1e1e',
    overflow: 'hidden',
  },
  navbar: {
    height: '48px',
    background: '#252526',
    borderBottom: '1px solid #3c3c3c',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 16px',
    flexShrink: 0,
  },
  logo: {
    color: '#fff',
    fontWeight: '700',
    fontSize: '15px',
  },
  navCenter: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  roomLabel: {
    color: '#888',
    fontSize: '12px',
  },
  roomId: {
    color: '#4ec9b0',
    fontSize: '12px',
    fontFamily: 'monospace',
  },
  copyBtn: {
    background: 'transparent',
    border: '1px solid #3c3c3c',
    color: '#888',
    padding: '4px 10px',
    borderRadius: '4px',
    fontSize: '11px',
    cursor: 'pointer',
  },
  navRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  logoutBtn: {
    background: 'transparent',
    border: '1px solid #3c3c3c',
    color: '#888',
    padding: '5px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    cursor: 'pointer',
  },
   main: {
    flex: 1,
    display: 'flex',
    overflow: 'hidden',
  },
  editorArea: {
    flex: 1,
    overflow: 'hidden',
  },
}

export default EditorPage