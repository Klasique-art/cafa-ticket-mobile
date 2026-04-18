# Frontend Deep-Linking Integration Guide

This guide explains how to integrate the updated backend payment callback + verification flow.

## 1) What Changed

Backend now enforces a strict callback policy and returns mobile-ready fields from `POST /api/v1/payments/initiate/`.

Implemented behavior:
- Callback allowlist enforcement (`400` for invalid callback URLs)
- Persisted callback metadata in payment record
- Canonical verification statuses: `pending | success | failed | cancelled | expired`
- Callback endpoint supports both `reference` and `trxref`
- Callback deep-link redirect now includes `status` consistently
- Missing reference returns controlled cancelled deep-link error
- Expiry is explicit and surfaced by verify endpoint
- Structured payment-flow logs per stage

## 2) Allowed callback_url values

You can pass one of:
- `cafatickets://payment-result`
- Backend callback URL on same host: `/api/v1/payments/mobile-callback/` (absolute URL)
- HTTPS callback URL on approved domains only (if backend env allowlist is configured)

If invalid, backend returns `400`:

```json
{
  "error": "invalid_callback_url",
  "message": "Invalid callback_url...",
  "allowed": {
    "deep_link": "cafatickets://payment-result",
    "backend_callback": "http://<host>/api/v1/payments/mobile-callback/",
    "https_domains": ["..."]
  }
}
```

## 3) Initiate Payment Contract

Endpoint:
- `POST /api/v1/payments/initiate/`

Required response fields (always):
- `authorization_url`
- `payment_reference`
- `effective_callback_url`
- `mobile_redirect_url_template`

Example success response:

```json
{
  "success": true,
  "purchase_id": "PUR-8F7AEB711D",
  "payment_reference": "CAFA-PUR-8F7AEB711D-A1B2C3",
  "authorization_url": "https://checkout.paystack.com/...",
  "effective_callback_url": "http://10.223.110.23:8000/api/v1/payments/mobile-callback/",
  "mobile_redirect_url_template": "cafatickets://payment-result?reference={reference}&status={status}",
  "amount": 63.0,
  "currency": "GHS",
  "expires_at": "2026-04-18T18:02:31.005848+00:00"
}
```

## 4) Recommended Frontend Flow

1. Call `POST /payments/initiate/`.
2. Persist locally before opening checkout:
- `payment_reference`
- `purchase_id`
- `effective_callback_url`
- `expires_at`
3. Open `authorization_url` in browser/webview.
4. Listen for app deep-link return (`cafatickets://payment-result?...`).
5. Extract:
- `reference` (or fallback to stored `payment_reference`)
- `status`
- optional `error`
6. Always call verify endpoint:
- `GET /api/v1/payments/verify/{reference}/`
7. Render UI from canonical backend status (not callback alone).

## 5) Deep-Link Callback Semantics

Backend callback endpoint:
- `GET /api/v1/payments/mobile-callback/`

Input accepted:
- `reference` or `trxref`
- `status` (optional)

Redirects emitted:
- Success:
  - `cafatickets://payment-result?status=success&reference=<ref>`
- Failed:
  - `...status=failed&reference=<ref>`
- Missing reference / cancelled:
  - `cafatickets://payment-result?status=cancelled&error=no_reference`

Note: Query ordering can vary. Always parse by key, not position.

## 6) Verify Endpoint Contract (Idempotent)

Endpoint:
- `GET /api/v1/payments/verify/{reference}/`

Canonical `status` values:
- `pending`
- `success`
- `failed`
- `cancelled`
- `expired`

Example response shape:

```json
{
  "success": false,
  "status": "cancelled",
  "payment_reference": "CAFA-PUR-...",
  "purchase_id": "PUR-...",
  "amount": 63.0,
  "currency": "GHS",
  "reason_code": "payment_cancelled",
  "message": "Payment status resolved."
}
```

`reason_code` examples:
- `invalid_reference_format`
- `verification_unavailable`
- `payment_failed`
- `payment_cancelled`
- `reservation_expired`

Idempotency guarantee:
- Repeated verify calls return consistent terminal status once resolved.

## 7) UI State Mapping

Recommended mapping:
- `pending`: show processing + retry verify
- `success`: show ticket success state
- `failed`: show retry purchase option
- `cancelled`: show "payment cancelled" state
- `expired`: show "session expired" and restart purchase

## 8) Retry + Timeout Strategy

On app return from checkout:
1. Call verify immediately.
2. If `pending`, poll every 2-3s for up to 30-60s.
3. Stop polling on terminal status.
4. If still `pending` and near/after `expires_at`, verify once more; handle `expired`.

If app never receives callback:
- Use stored `payment_reference` and call verify directly.

## 9) Security Notes for Frontend

- Do not construct your own open redirect callback targets.
- Always use backend-returned `effective_callback_url` for diagnostics.
- Treat callback params as hints; backend verify is source of truth.
- Never trust callback `status` without `/verify` confirmation.

## 10) Minimal Frontend Pseudocode

```ts
// 1) initiate
const init = await api.post('/payments/initiate/', payload);
storePendingPayment({
  ref: init.payment_reference,
  purchaseId: init.purchase_id,
  expiresAt: init.expires_at,
  effectiveCallbackUrl: init.effective_callback_url,
});
openBrowser(init.authorization_url);

// 2) on deep link
const params = parseDeepLink(url);
const ref = params.reference ?? getStoredRef();
if (!ref) {
  showCancelled('no_reference');
  return;
}

// 3) verify (idempotent)
const result = await api.get(`/payments/verify/${ref}/`);
switch (result.status) {
  case 'success':
    showSuccess(result);
    clearPending();
    break;
  case 'pending':
    startPollingVerify(ref);
    break;
  case 'failed':
  case 'cancelled':
  case 'expired':
    showFailureState(result.status, result.reason_code);
    clearPending();
    break;
}
```

## 11) Backend Acceptance Coverage

Backend acceptance scenarios are implemented and passing in:
- `tickets/tests.py` (`PaymentDeepLinkFlowTests`)

Covered cases:
- deep-link callback with `reference`
- callback with `trxref` only
- missing reference -> controlled cancelled error
- invalid callback URL rejected
- verify idempotency for cancelled and expired paths
- invalid reference format rejected
