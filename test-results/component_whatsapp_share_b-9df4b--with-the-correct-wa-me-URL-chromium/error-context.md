# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: component_whatsapp_share_button.e2e.test.ts >> WhatsAppShareButton >> R3: click calls window.open with the correct wa.me URL
- Location: tests/e2e/component_whatsapp_share_button.e2e.test.ts:30:7

# Error details

```
Error: page.evaluate: RangeError: Maximum call stack size exceeded
    at window.open (eval at evaluate (:302:30), <anonymous>:4:23)
    at window.open (eval at evaluate (:302:30), <anonymous>:8:23)
    at window.open (eval at evaluate (:302:30), <anonymous>:8:23)
    at window.open (eval at evaluate (:302:30), <anonymous>:8:23)
    at window.open (eval at evaluate (:302:30), <anonymous>:8:23)
    at window.open (eval at evaluate (:302:30), <anonymous>:8:23)
    at window.open (eval at evaluate (:302:30), <anonymous>:8:23)
    at window.open (eval at evaluate (:302:30), <anonymous>:8:23)
    at window.open (eval at evaluate (:302:30), <anonymous>:8:23)
    at window.open (eval at evaluate (:302:30), <anonymous>:8:23)
```

# Page snapshot

```yaml
- generic [ref=e2]: placeholder
```