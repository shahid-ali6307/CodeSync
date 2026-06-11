import { useEffect, useState, useRef } from "react"

function ChatPanel({ messages, currentUser, onSendMessage }) {
    const [input, setInput] = useState('')
    const bottomRef = useRef(null)

    // auto scroll to bottom whenever message update...
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth'}, [messages])
    })

    function handleSend() {
        if(!input.trim()) return
        onSendMessage(input.trim())
        setInput('')
    }

    function handleKeyDown(e) {
        if(e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    function formatTime(isoString) {
        const date = new Date(isoString)
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    return (
        <div style={styles.panel}>
             {/* Header */}
             <div style={styles.header}>
                <span style={styles.title}> 💬 Chat </span>
                <span style={styles.count}> {messages.length} messages </span>
             </div>

             {/* Messages */}
             <div style={styles.messageList}>
                {messages.length && (
                    <div style={styles.emptyText}>
                        No messages yet. Say hello !
                    </div>
                )}

                {messages.map((msg, index) => {
                    const isOwn =msg.username === currentUser

                    return (
                        <div 
                            key={index}
                            style={{
                                ...styles.messageRow,
                                flexDirection: isOwn? 'row-reverse' : 'row'
                            }}
                        >
                            {/* Avatar */}
 
                              <div style={{
                                  ...styles.avatar,
                                  background: getColor(msg.username),
                                  }}>
                                 {msg.username[0].toUpperCase()}
                              </div>

                              {/* Bubble */}

                            <div style={{
                                ...styles.bubble,
                                background: isOwn ? '#0e4d3a' : '#2d2d2d',
                                borderRadius: isOwn
                                ? '12px 4px 12px 4px'
                                : '4px 12px 4px 12px',
                            }}>

                                {!isOwn && (
                                    <div style={styles.msgUsername}> {msg.username} </div>
                                )}

                                <div style={styles.msgText}> {msg.message} </div>
                                <div style={styles.msgTime}> { formatTime(msg.timestamp) }</div>
                            
                            </div>
                        </div>
                    )
                })}

                {/* Invisible div to scroll to */}
                 <div ref={bottomRef} />
                 </div>

                 {/* Input Area */}
                 <div style={styles.inputArea}>
                    <input type="text"
                    placeholder="Type a message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value) }
                    onKeyDown={handleKeyDown}
                    maxLength={500}
                    />

                    <button 
                    style={{
                        ...styles.sendBtn,
                        opacity: input.trim() ? 1 : 0.4,
                        cursor: input.trim() ? 'pointer' : 'default',
                        }}
                        onClick={handleSend}
                        > ➤ 
                        </button>
                 </div>
             </div>
    )
}

function getColor(username) {
  const colors = ['#e74c3c','#3498db','#2ecc71','#f39c12','#9b59b6','#1abc9c']
  const index = username.charCodeAt(0) % colors.length
  return colors[index]
}

const styles = {
  panel: {
    width: '260px',
    background: '#252526',
    borderLeft: '1px solid #3c3c3c',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
  },
  header: {
    height: '40px',
    borderBottom: '1px solid #3c3c3c',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 14px',
    flexShrink: 0,
  },
  title: {
    color: '#cccccc',
    fontSize: '13px',
    fontWeight: '600',
  },
  count: {
    color: '#555',
    fontSize: '11px',
  },
  messageList: {
    flex: 1,
    overflowY: 'auto',
    padding: '12px 10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  emptyText: {
    color: '#555',
    fontSize: '12px',
    textAlign: 'center',
    marginTop: '20px',
  },
  messageRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
  },
  avatar: {
    width: '26px',
    height: '26px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: '11px',
    fontWeight: '700',
    flexShrink: 0,
    marginTop: '2px',
  },
  bubble: {
    maxWidth: '170px',
    padding: '8px 10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '3px',
  },
  msgUsername: {
    color: '#4ec9b0',
    fontSize: '11px',
    fontWeight: '600',
  },
  msgText: {
    color: '#cccccc',
    fontSize: '13px',
    lineHeight: '1.4',
    wordBreak: 'break-word',
  },
  msgTime: {
    color: '#555',
    fontSize: '10px',
    alignSelf: 'flex-end',
  },
  inputArea: {
    display: 'flex',
    gap: '6px',
    padding: '10px',
    borderTop: '1px solid #3c3c3c',
    flexShrink: 0,
  },
  input: {
    flex: 1,
    background: '#1e1e1e',
    border: '1px solid #3c3c3c',
    borderRadius: '6px',
    padding: '8px 10px',
    color: '#cccccc',
    fontSize: '13px',
    outline: 'none',
  },
  sendBtn: {
    background: '#0e7a5f',
    border: 'none',
    borderRadius: '6px',
    padding: '8px 12px',
    color: '#fff',
    fontSize: '14px',
    flexShrink: 0,
  },
}

export default ChatPanel