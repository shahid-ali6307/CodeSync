import { useState, useEffect, useCallback } from "react";
import Editor from "../components/Editor/Editor";
import LanguagesSelector from "../components/LanguageSelector/LanguageSelector";
import { DEFAULT_CODE } from "../utils/constants";
import UserSidebar from "../components/UserSidebar/UserSidebar";
import Toast from "../components/Toast/Toast";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useSocket from "../hooks/useSocket"
import OutputPanel from "../components/OutputPanel/OutputPanel"
import { runCode } from '../utils/api'

function EditorPage() {
    const { roomId } = useParams()
    const location = useLocation()
    const navigate = useNavigate()
    const { user,token, logout } = useAuth()

    const [language, setLanguage]= useState('javascript')
    const [code, setCode]= useState(DEFAULT_CODE['javascript'])
    const [users, setUsers] = useState([])
    const [toast, setToast] = useState('')
    const [output,setOutput] = useState(null)
    const [isRunning, setIsRunning] =useState(false)

    // Get username — from auth context (preferred) or location state
    const username = user?.username || location.state?.username

    //Callbacks for socket events
    const handleCodeUpdate = useCallback((newCode) => {
      setCode(newCode)
    }, [])

    const handleLanguageUpdate = useCallback((newLanguage) => {
      setLanguage(newLanguage)
      setCode(DEFAULT_CODE[newLanguage])
    }, [])

    const handleUsersUpdate = useCallback((users) => {
      setUsers(users)
    }, [])
    
    const handleUserJoined = useCallback((username) => {
      setToast(`${username} joined the room`)
    }, [])

    const handleUserLeft = useCallback((username) => {
      setToast(`${username} left the room`)
    }, [])

    //Custom hookhandles all socket logic

    const { emitCodeChange, emitLanguageChange, isRemoteChange} = useSocket({
      roomId,
      username,
      onCodeUpdate: handleCodeUpdate,
      onLanguageChange: handleLanguageUpdate,
      onUserUpdate: handleUsersUpdate,
      onUserJoined: handleUserJoined,
      onUserLeft: handleUserLeft,
    })

      //Handlers-----------------------------
    function handleLanguageChange(newLang){
        setLanguage(newLang)
        setCode(DEFAULT_CODE[newLang])
        emitLanguageChange(roomId, newLang) //instant emit
    }

    function handleCodeChange(newCode){
        setCode(newCode)
        emitCodeChange(roomId, newCode) //debounced emit
    }

    async function handleRun() {
      if(isRunning) return
      setIsRunning(true)
      setOutput(null)

      try {
        const result = await runCode(code, language, token)
        if(result.message) {
          setOutput({ error: result.message})
        } else {
          setOutput(result)
        }

      } catch (err) {
        setOutput({ error: 'Failed to reach the execution server' })
      }

      setIsRunning(false)
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

  if(!username) {
    navigate('/')
    return null
  }

  // Render----------------------


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

          <button style={{ ...styles.runBtn,
             opacity: isRunning?0.6: 1,
             cursor: isRunning?'not-allowed':'pointer',
             }}
             onClick={handleRun}
             disabled={isRunning}
             >

              {isRunning ? '⏳ Running...' : '▶ Run' }

          </button>
          <button style={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>

      </div>

                 {/* Main Area */}
                 <div style={styles.main}>
                    {/* Editor + output atcked */}
                   <div style={styles.editorArea}>
                    <div style={styles.editorStack}>
                      <div style={{ flex: 1, overflow: 'hidden' }}>
                      <Editor
                     language={language}
                     code={code}
                     onChange={handleCodeChange}
                     isRemoteChange={isRemoteChange}
                   />
                    </div>

                    {/*Output panel here */}
                     <OutputPanel output={output} isRunning={isRunning} />
                    </div>
                    
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
  runBtn: {
    background: '#0e7a5f',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    padding: '6px 16px',
    fontSize: '13px',
    fontWeight: '600',
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
  editorStack: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
}

export default EditorPage