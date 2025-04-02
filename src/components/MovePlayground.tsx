import { useState } from 'react';
import Editor from '@monaco-editor/react';
import styles from './MovePlayground.module.css';

const defaultMoveCode = `
module playground::hello {
    use std::string;
    use std::debug;

    public fun hello_world() {
        let message = string::utf8(b"Hello, World!");
        debug::print(&message);
    }
}
`.trim();

export default function MovePlayground() {
  const [code, setCode] = useState(defaultMoveCode);
  const [compileResult, setCompileResult] = useState<{
    success: boolean;
    output?: string;
    error?: string | null;
  } | null>(null);
  const [isCompiling, setIsCompiling] = useState(false);

  const handleCompile = async () => {
    setIsCompiling(true);
    try {
      const response = await fetch('/api/move/compile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });
      const result = await response.json();
      setCompileResult(result);
    } catch (error) {
      setCompileResult({
        success: false,
        error: error instanceof Error ? error.message : '编译过程中发生错误',
      });
    } finally {
      setIsCompiling(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Move 代码操场</h2>
        <button
          onClick={handleCompile}
          disabled={isCompiling}
          className={styles.button}
        >
          {isCompiling ? '编译中...' : '编译'}
        </button>
      </div>

      <div className={styles.editorContainer}>
        <Editor
          height="100%"
          defaultLanguage="rust"
          value={code}
          onChange={(value) => setCode(value || '')}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </div>

      {compileResult && (
        <div className={styles.resultContainer}>
          <h3 className={styles.resultTitle}>
            编译{compileResult.success ? '成功' : '失败'}
          </h3>
          {compileResult.output && (
            <pre className={styles.output}>
              {compileResult.output}
            </pre>
          )}
          {compileResult.error && (
            <pre className={styles.error}>
              {compileResult.error}
            </pre>
          )}
        </div>
      )}
    </div>
  );
} 