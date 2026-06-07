import { useEffect, useCallback, useRef } from "react";
import { debounce } from 'lodash'
import socket from "../utils/socket";

function useSocket ({ roomId, username, onCodeUpdate, onLanguageChange, onUserUpdate, onUserJoined, onUserLeft }) {
    //Traack if current code change come from remote (not local tpying )
    const isRemoteChange = useRef(false)

    useEffect(() => {
        if(!roomId || !username) return 

        socket.connect()
        socket.emit('join_room', { roomId, username })

        socket.on('room_users', (users) => {
            onUserUpdate(users)
        })

        socket.on('user_joined', ({ username: u}) =>{
            onUserJoined(u)
        })

        socket.on('user_left' ,({ username: u}) =>{
            onUserLeft(u)
        })

        socket.on('code_change', ({ code }) =>{
            isRemoteChange.current = true
            onCodeUpdate(code)
        })

        socket.on('language_change', ({ language }) =>{
            onLanguageChange(language)
        })

        return () => {
        socket.off('room_users')
        socket.off('user_joined')
        socket.off('user_left')
        socket.off('code_change')
        socket.off('language_change')
        socket.disconnect()
        }
    }, [roomId, username])
    
    //Debounced emit - waits 100ms after user stops typying
    const emitCodeChange = useCallback(
        debounce((roomId, code) =>{
            socket.emit('code_change', { roomId, code })
        }, 100),
        []
    )

    function emitLanguageChange(roomId, language) {
        socket.emit('language_change', { roomId, language })
    }

    return { emitCodeChange, emitLanguageChange, isRemoteChange }
}

export default useSocket