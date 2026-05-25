import { useState } from "react";
import Editor from "../components/Editor/Editor";
import LanguagesSelector from "../components/LanguageSelector/LanguageSelector";
import { DEFAULT_CODE } from "../utils/constants";
import { useParams, useLocation, useNavigate } from "react-router-dom";

function EditorPage() {
    const { roomId } = useParams()
    const location = useLocation()
    const navigate = useNavigate()

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

            <LanguagesSelector 
               language={language}
               onLanguageChange={handleLanguageChange}
            />
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