import { useEffect, useRef } from 'react';
import * as monaco from 'monaco-editor';
import { loader } from '@monaco-editor/react';
import { moveLanguageConfiguration, moveTokensProvider } from '../config/monaco-move';

// 预先配置 Monaco
loader.config({ monaco });

// 确保只注册一次
let isRegistered = false;

interface MonacoEditorImplProps {
  value: string;
  onChange?: (value: string) => void;
  height?: string;
  theme?: string;
  options?: monaco.editor.IStandaloneEditorConstructionOptions;
}

export default function MonacoEditorImpl({
  value,
  onChange,
  height = '100%',
  theme = 'vs-dark',
  options = {}
}: MonacoEditorImplProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const editor = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    if (!isRegistered) {
      // 注册 Move 语言
      monaco.languages.register({ id: 'move' });
      monaco.languages.setLanguageConfiguration('move', moveLanguageConfiguration);
      monaco.languages.setMonarchTokensProvider('move', moveTokensProvider);
      isRegistered = true;
    }

    if (editorRef.current) {
      editor.current = monaco.editor.create(editorRef.current, {
        value,
        language: 'move',
        theme,
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: 'on',
        scrollBeyondLastLine: false,
        automaticLayout: true,
        ...options
      });

      editor.current.onDidChangeModelContent(() => {
        if (onChange) {
          onChange(editor.current?.getValue() || '');
        }
      });

      return () => {
        editor.current?.dispose();
      };
    }
  }, []);

  useEffect(() => {
    if (editor.current) {
      const currentValue = editor.current.getValue();
      if (currentValue !== value) {
        editor.current.setValue(value);
      }
    }
  }, [value]);

  return <div ref={editorRef} style={{ height, width: '100%' }} />;
} 