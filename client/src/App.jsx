import Editor from "@monaco-editor/react";

function App() {
  return (
    <div style={{ height: '100vh', display:'flex', flexDirection:'column' }}>
      <div style={{ background:'#1e1e1e', padding: '10px 16px' }}>
        <span style={{ color: '#cccccc', fontSize: '14px' }}>CodeSync Editor</span>
      </div>
      <Editor
        height="calc(100vh - 40px)"
        defaultLanguage="javascript"
        defaultValue="// Start code here..."
        theme="vs-dark"
        options={{
          fontSize: 15,
          minimap: { enabled: false },
          wordWrap: 'on',
        }}
      />
    </div>
  )
}

export default App
