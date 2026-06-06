import { useEffect } from "react";

function Toast({ message, onClose }) {
    useEffect(() => {
        const timer =setTimeout(onClose, 3000)
        return () => clearTimeout(timer)
    }, [onClose])

    if (!message) return null

    return (
        <div style={styles.toast}>
            {message}
        </div>
    )
}

const styles = {
    toast: {
    position: 'fixed',
    bottom: '24px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: '#2d2d2d',
    border: '1px solid #4ec9b0',
    color: '#4ec9b0',
    padding: '10px 20px',
    borderRadius: '8px',
    fontSize: '13px',
    zIndex: 1000,
    boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
  },
}

export default Toast