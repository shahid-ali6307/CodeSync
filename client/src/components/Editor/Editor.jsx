import MonacoEditor from "@monaco-editor/react";

function Editor( { language, code, onChange} ) {
  return (
      <MonacoEditor
        height="100%"
        language={language}
        value={code}
        onChange={onChange}
        theme="vs-dark"
        options={{
          fontSize: 15,
          minimap: { enabled: false },
          wordWrap: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
  )
}

export default Editor