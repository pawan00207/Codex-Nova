import { ExecutionResult } from '../types/compiler';

export async function executeCode(
  language: string,
  code: string,
  stdin: string = ''
): Promise<ExecutionResult> {
  const startTime = Date.now();

  try {
    // Primary: Call our backend /api/execute endpoint
    const response = await fetch('/api/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ language, code, stdin }),
    });

    if (response.ok) {
      const data = await response.json();
      return {
        stdout: data.stdout || '',
        stderr: data.stderr || '',
        exitCode: data.exitCode ?? 0,
        executionTimeMs: data.executionTimeMs ?? (Date.now() - startTime),
        memoryKb: data.memoryKb ?? 16384,
        language: data.language || language,
        version: data.version || 'latest',
        success: data.success ?? (data.exitCode === 0 && !data.stderr),
      };
    }
  } catch (backendError) {
    console.warn('Backend proxy unreachable, attempting direct fallback engine...', backendError);
  }

  // Fallback 1: Direct Piston public API call from client if backend proxy fails
  try {
    const PISTON_MAP: Record<string, { lang: string; ver: string; file: string }> = {
      python: { lang: 'python', ver: '3.10.0', file: 'main.py' },
      javascript: { lang: 'javascript', ver: '18.15.0', file: 'index.js' },
      typescript: { lang: 'typescript', ver: '5.0.3', file: 'index.ts' },
      cpp: { lang: 'c++', ver: '10.2.0', file: 'main.cpp' },
      c: { lang: 'c', ver: '10.2.0', file: 'main.c' },
      java: { lang: 'java', ver: '15.0.2', file: 'Main.java' },
      go: { lang: 'go', ver: '1.16.2', file: 'main.go' },
      rust: { lang: 'rust', ver: '1.68.2', file: 'main.rs' },
      php: { lang: 'php', ver: '8.2.3', file: 'index.php' },
      ruby: { lang: 'ruby', ver: '3.0.1', file: 'main.rb' },
      bash: { lang: 'bash', ver: '5.2.0', file: 'script.sh' },
      sql: { lang: 'sqlite3', ver: '3.36.0', file: 'query.sql' },
    };

    const target = PISTON_MAP[language.toLowerCase()] || {
      lang: language.toLowerCase(),
      ver: '*',
      file: 'main.txt',
    };

    const directRes = await fetch('https://emkc.org/api/v2/piston/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language: target.lang,
        version: target.ver,
        files: [{ name: target.file, content: code }],
        stdin: stdin || '',
      }),
    });

    if (directRes.ok) {
      const data = await directRes.json();
      const stdout = (data.compile?.stdout || '') + (data.run?.stdout || '');
      const stderr = (data.compile?.stderr || '') + (data.run?.stderr || '');
      const exitCode = data.compile?.code ?? data.run?.code ?? 0;

      return {
        stdout,
        stderr,
        exitCode,
        executionTimeMs: Date.now() - startTime,
        memoryKb: 15400,
        language: data.language || target.lang,
        version: data.version || target.ver,
        success: exitCode === 0 && !stderr.includes('Error'),
      };
    }
  } catch (pistonErr: any) {
    console.error('Direct execution error:', pistonErr);
  }

  // Fallback 2: Client-side JS evaluation if JavaScript is selected
  if (language === 'javascript') {
    try {
      const logs: string[] = [];
      const originalLog = console.log;
      console.log = (...args) => {
        logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' '));
      };

      const fn = new Function(code);
      fn();
      console.log = originalLog;

      return {
        stdout: logs.join('\n') || '[Process completed with empty output]',
        stderr: '',
        exitCode: 0,
        executionTimeMs: Date.now() - startTime,
        memoryKb: 8192,
        language: 'javascript',
        version: 'Browser JS VM',
        success: true,
      };
    } catch (evalErr: any) {
      return {
        stdout: '',
        stderr: String(evalErr),
        exitCode: 1,
        executionTimeMs: Date.now() - startTime,
        memoryKb: 8192,
        language: 'javascript',
        version: 'Browser JS VM',
        success: false,
      };
    }
  }

  return {
    stdout: '',
    stderr: 'Connection error: Unable to connect to execution sandbox cluster.\nPlease verify your network or try again in a few moments.',
    exitCode: 1,
    executionTimeMs: Date.now() - startTime,
    memoryKb: 0,
    language,
    version: 'unknown',
    success: false,
  };
}
