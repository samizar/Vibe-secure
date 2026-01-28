Vibe Secure
===========

> The security scanner for AI-generated applications.

Vibe Secure is a lightweight, CLI-based security scanner designed for the "vibe coding" era. It catches common mistakes that AI coding assistants (like ChatGPT, Claude, or Cursor) might accidentally leave behind in your React, Node.js, and Next.js applications.

![License](https://img.shields.io/badge/license-MIT-blue.svg)

Features
--------

- Zero Config: Just run it. No complex setup files.
- Security Checks: Scans for common errors:
    - Hardcoded Secrets: API keys (Stripe, AWS, OpenAI, etc.).
    - Exposed Databases: Postgres, MongoDB, Redis connection strings.
    - Unsafe Endpoints: Risky API routes (POST/DELETE) lacking authentication middleware.
    - SQL Injection: Detects unsafe string concatenation in SQL queries.
    - XSS Vulnerabilities: Detects dangerous React patterns.
- Clean Output: Readable CLI reports with clickable file links.

How it Works
------------

Vibe Secure is a static analysis tool, not an AI model.

1.  Fast and Privacy-First: It runs entirely on your machine. No code leaves your computer.
2.  Pattern Matching: It uses Regular Expressions (Regex) and heuristic rules to find patterns that look dangerous.
3.  Deterministic: Unlike AI models which can hallucinate, this tool uses rigid pattern matching to identify specific security violations.

Usage
-----

You can run Vibe Secure directly in your project using npx:

```bash
npx vibe-secure
```

Or install it globally:

```bash
npm install -g vibe-secure
vibe-secure
```

Run on a specific folder:

```bash
vibe-secure ./src/api
```

What it Checks
--------------

| Check Type | Description |
| :--- | :--- |
| Secrets | Scans for sk_live_, AWS_ACCESS_KEY, and other credential patterns. |
| Databases | Detects hardcoded connection strings like postgres:// or mongodb+srv://. |
| Auth | Flags API routes like app.delete('/user/:id') that appear to have no middleware. |
| SQL Injection | Flags SELECT statements using string concatenation or template literals. |
| XSS | Flags dangerouslySetInnerHTML, javascript: links, and eval(). |

Development
-----------

1.  Clone the repo
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the scanner on itself:
    ```bash
    node index.js
    ```

License
-------

MIT.
