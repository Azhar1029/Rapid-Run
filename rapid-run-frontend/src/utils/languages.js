export const LANGUAGE_CONFIG = {
  java:   { label:'Java',   extension:'.java', monacoLang:'java',   judge0Id:62, color:'#ff9f43', icon:'☕' },
  c:      { label:'C',      extension:'.c',    monacoLang:'c',      judge0Id:50, color:'#5b8dee', icon:'⚙' },
  cpp:    { label:'C++',    extension:'.cpp',  monacoLang:'cpp',    judge0Id:54, color:'#b06cff', icon:'⚡' },
  python: { label:'Python', extension:'.py',   monacoLang:'python', judge0Id:71, color:'#ffd166', icon:'🐍' },
}

export const EXTENSIONS_MAP = {
  '.java':'java', '.c':'c', '.cpp':'cpp', '.cc':'cpp', '.py':'python',
}

export function detectLanguage(filename) {
  if (!filename) return 'plaintext'
  const ext = '.' + filename.split('.').pop().toLowerCase()
  return EXTENSIONS_MAP[ext] || 'plaintext'
}

export function getLanguageConfig(lang) {
  return LANGUAGE_CONFIG[lang] || null
}
