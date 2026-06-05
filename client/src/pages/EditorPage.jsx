import { useState } from "react";
import Editor from "../components/Editor/Editor";
import LanguagesSelector from "../components/LanguageSelector/LanguageSelector";
import { DEFAULT_CODE } from "../utils/constants";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function EditorPage() {
    const { roomId } = useParams()
    const location = useLocation()
    const navigate = useNavigate()
    const { logout } = useAuth()

    const username = location.state?.username
    if(!username){
        navigate('/')
        return null
    }

    const [language, setLanguage]= useState('javascript')
    const [code, setCode]= useState(DEFAULT_CODE['javascript'])

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

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#1e1e1e'}}>

                   {/* Navbar */}

        <div style={{
            height: '48px',
            background: '#252526',
            borderBottom: '1px solid #3c3c3c',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 16px',
        }}>
            <span style={{ color: '#cccccc', fontWeight: '600', fontSize: '15px' }}>
                ⚡ CodeSync
            </span>

            <span style={{ color: '#888', fontSize: '12px' }}>
                Room: {roomId.slice(0, 8)}...  |  👤 {username}
            </span>

            <div style={{ display: 'flex' ,flexDirection: 'row',padding: '10px',gap: '15px', margin: '10px'}}>
                <LanguagesSelector 
               language={language}
               onLanguageChange={handleLanguageChange}
            />
            <button type="logout" onClick={handleLogout} style={{ background: '#0e7a5f',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        padding: '13px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer'}}>
                Logout
            </button>
            </div>
        </div>


                 {/* Editor */}

        
        <div style={{ flex: 1}}>
            <Editor
              language={language}
              code={code}
              onChange={handleCodeChange}
            />    
        </div>  

    </div>
    )
}

export default EditorPage