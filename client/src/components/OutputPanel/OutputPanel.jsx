function OutputPanel({ output, isRunning }) {

    function getOutputColor() {
        if(!output) return '#888'
        if(output.error) return '#f48771'
        if(output.status === 'Error') return '#f48771'
        return '#4ec9b0'
    }

    function getDisplayText() {
        if(isRunning) return 'Running your code...'
        if(!output) return 'Click ▶ Run to execute your code'
        if(output.error) return output.error
        if(output.stdout) return output.stdout
        if(output.stderr) return output.stderr
        if(output.output) return output.output
        return 'No output'
        }

    return(
        <div style={styles.panel}>

           {/* Header bar */}
            <div style={styles.header}>
            <span style={styles.title}>▶ Output</span>

            {output && !isRunning && (
                 <div style={styles.meta}>

                 {/* Status badge */}
                 {output.status && (
                 <span style={{
                    ...styles.badge,
                    background: output.status === 'Accepted' ? '#0e3d2f' : '#3d1515',
                    color:      output.status === 'Accepted' ? '#4ec9b0' : '#f48771',
                 }}>
                    {output.status}
              </span>
            )}

            {/* CPU time */}
            {output.time && (
              <span style={styles.metaText}>⏱ {output.time}s</span>
            )}

            {/* Memory */}
            {output.memory && (
              <span style={styles.metaText}>🗂 {output.memory} KB</span>
            )}

          </div>
        )}
      </div>

      {/* Output content */}
      <pre style={{ ...styles.content, color: getOutputColor() }}>
        {getDisplayText()}
      </pre>
        </div>
    )

}

const styles = {
  panel: {
    height: '200px',
    background: '#1a1a1a',
    borderTop: '1px solid #3c3c3c',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
  },
  header: {
    height: '36px',
    background: '#252526',
    borderBottom: '1px solid #3c3c3c',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 16px',
    flexShrink: 0,
  },
  title: {
    color: '#888',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
  },
  meta: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  badge: {
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: '600',
  },
  metaText: {
    color: '#888',
    fontSize: '11px',
    fontFamily: 'monospace',
  },
  content: {
    flex: 1,
    padding: '12px 16px',
    margin: 0,
    fontSize: '13px',
    fontFamily: 'monospace',
    overflowY: 'auto',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
}

export default OutputPanel