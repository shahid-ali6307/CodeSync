function UserSidebar({ users, currentUser}) {
    return(
        <div style={styles.sidebar}>
            <div style={StyleSheet.title}>
                👥 In this room
            </div>
            {users.map((user, index) => (
                <div key={index} style={styles.userRow}>
                    <div style={{
                        ...styles.avatar,
                        background: getColor(user.username),
                    }}>
                        {user.username[0].toUpperCase()}
                    </div>

                    <span style={styles.username}>
                        {user.username}
                        {user.username === currentUser && (<span style={styles.youTag}> (You)</span>
                    )}
                    </span>
                </div>

            ))}
        </div>
    )
}

function getColor(username) {
    const colors = ['#e74c3c','#3498db','#2ecc71','#f39c12','#9b59b6','#1abc9c']
    const index = username.charCodeAt(0) % colors.length
    return colors[index]
}

const styles = {
    sidebar: {
    width: '200px',
    background: '#252526',
    borderLeft: '1px solid #3c3c3c',
    padding: '16px 12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    overflowY: 'auto',
  },

  title: {
    color: '#888',
    fontSize: '11px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    marginBottom: '6px',
  },

   userRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },

  avatar: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: '12px',
    fontWeight: '700',
    flexShrink: 0,
  },

   username: {
    color: '#cccccc',
    fontSize: '13px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },


  youTag: {
    color: '#888',
    fontSize: '11px',
  },
}

export default UserSidebar