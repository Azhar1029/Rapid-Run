// ── Language detection ────────────────────────────────
export const getLanguage = (filename = '') => {
  const ext = filename.split('.').pop()?.toLowerCase();
  const map = {
    java: { id: 'java',   label: 'Java',   monacoLang: 'java',   color: 'var(--java-color)' },
    py:   { id: 'python', label: 'Python', monacoLang: 'python', color: 'var(--py-color)'   },
    c:    { id: 'c',      label: 'C',      monacoLang: 'c',      color: 'var(--c-color)'    },
    cpp:  { id: 'cpp',    label: 'C++',    monacoLang: 'cpp',    color: 'var(--cpp-color)'  },
  };
  return map[ext] || { id: 'text', label: 'Text', monacoLang: 'plaintext', color: 'var(--text-secondary)' };
};

export const SUPPORTED_EXTENSIONS = [
  { ext: 'java',  label: 'Java',   example: 'Main.java'  },
  { ext: 'py',    label: 'Python', example: 'main.py'    },
  { ext: 'c',     label: 'C',      example: 'main.c'     },
  { ext: 'cpp',   label: 'C++',    example: 'main.cpp'   },
];

// ── File icon emoji ───────────────────────────────────
export const getFileIcon = (filename = '') => {
  const ext = filename.split('.').pop()?.toLowerCase();
  const icons = { java: '☕', py: '🐍', c: '⚙️', cpp: '🔩' };
  return icons[ext] || '📄';
};

// ── Time formatter ────────────────────────────────────
export const timeAgo = (ts) => {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1)   return 'just now';
  if (mins < 60)  return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)   return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
};

// ── Mock code execution (replace with Judge0 later) ──
export const mockExecute = async (code, language, stdin = '') => {
  await new Promise(r => setTimeout(r, 800 + Math.random() * 600));

  if (!code.trim()) {
    return { success: false, output: '', error: 'No code to execute.' };
  }

  // Simple mock responses per language
  if (language === 'python') {
    if (code.includes('print(')) {
      const match = code.match(/print\(["'](.+?)["']\)/);
      const out = match ? match[1] : 'Hello from Python!';
      return { success: true, output: out, error: '' };
    }
    if (code.includes('input(')) {
      return { success: true, output: stdin || '(waiting for input)', error: '' };
    }
    return { success: true, output: '(program exited with code 0)', error: '' };
  }

  if (language === 'java') {
    if (code.includes('System.out.println')) {
      const match = code.match(/System\.out\.println\("(.+?)"\)/);
      const out = match ? match[1] : 'Hello from Java!';
      return { success: true, output: out, error: '' };
    }
    if (!code.includes('public class')) {
      return { success: false, output: '', error: 'error: class declaration expected' };
    }
    return { success: true, output: '(program exited with code 0)', error: '' };
  }

  if (language === 'c' || language === 'cpp') {
    if (code.includes('printf(') || code.includes('cout')) {
      const match = code.match(/printf\("(.+?)"/);
      const out = match ? match[1].replace(/\\n/g, '\n') : 'Hello from C!';
      return { success: true, output: out, error: '' };
    }
    return { success: true, output: '(program exited with code 0)', error: '' };
  }

  return { success: true, output: '(program exited with code 0)', error: '' };
};

// ── Validate filename ────────────────────────────────
export const validateFilename = (name) => {
  if (!name.trim()) return 'Filename cannot be empty';
  const validExt = SUPPORTED_EXTENSIONS.map(e => e.ext);
  const ext = name.split('.').pop()?.toLowerCase();
  if (!validExt.includes(ext)) return `Use a supported extension: .java .py .c .cpp`;
  if (!/^[a-zA-Z][a-zA-Z0-9_]*\.[a-z]+$/.test(name)) return 'Use letters, numbers, underscores. Must start with a letter.';
  return null;
};
