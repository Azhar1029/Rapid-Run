// Using Judge0 CE — free public instance, no API key needed
const JUDGE0_URL = 'https://judge0-ce.p.rapidapi.com'

// Alternative free instances (fallback)
const JUDGE0_EXTRA_CE = 'https://judge0-extra-ce.p.rapidapi.com'

const LANG_IDS = {
  java:   62,
  c:      50,
  cpp:    54,
  python: 71,
}

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms))
}

export async function runCode(code, language, stdin = '') {
  const langId = LANG_IDS[language]
  if (!langId) throw new Error('Unsupported language: ' + language)

  // Use Judge0 open instance (no auth needed)
  const BASE = 'https://ce.judge0.com'

  // Step 1: Submit code
  const submitRes = await fetch(`${BASE}/submissions?base64_encoded=false&wait=false`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      source_code:  code,
      language_id:  langId,
      stdin:        stdin || '',
    }),
  })

  if (!submitRes.ok) {
    const err = await submitRes.text()
    throw new Error(`Submission failed: ${submitRes.status} — ${err}`)
  }

  const { token } = await submitRes.json()
  if (!token) throw new Error('No token received from Judge0')

  // Step 2: Poll for result
  for (let i = 0; i < 20; i++) {
    await sleep(1000)
    const pollRes = await fetch(`${BASE}/submissions/${token}?base64_encoded=false`)

    if (!pollRes.ok) continue

    const result = await pollRes.json()
    const statusId = result?.status?.id

    if (!statusId || statusId <= 2) continue // In Queue (1) or Processing (2)

    // Got a result
    const stdout  = result.stdout  || ''
    const stderr  = (result.stderr || '') + (result.compile_output || '')
    const exitCode = statusId === 3 ? 0 : 1 // 3 = Accepted

    return { stdout, stderr, exitCode }
  }

  throw new Error('Execution timed out — please try again')
}

export default { run: runCode }