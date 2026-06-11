import MonacoEditor from "@monaco-editor/react"

import { useRef } from "react"


function Editor( { language, code, onChange, isRemoteChange }) {

  const editorRef = useRef(null)

  function handleMount(editor) {
    editorRef.current = editor
  }

  function handleChange(newCode) {
    //if this come from remote socket update, don't emit it back...
    if(isRemoteChange?.current) {
      isRemoteChange.current = false
      return

    }

    onChange(newCode)
  }




  return (
      <MonacoEditor
        height="100%"
        language={language}
        value={code}
        onChange={handleChange}
        onMount={handleMount}
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