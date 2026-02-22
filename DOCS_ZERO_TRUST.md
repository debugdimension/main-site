# Cloudflare Zero Trust Configuration Guide

To fulfill the security requirements for the "Command Center", follow these steps in the Cloudflare Dashboard:

## 1. Access Application Setup
1. Go to **Zero Trust** > **Access** > **Applications**.
2. Click **Add an Application** and select **Self-hosted**.
3. Application Name: `Debug Dimension V2 Admin`
4. Domain: `yourdomain.com/admin` and `yourdomain.com/login`
5. Identity Providers: Enable **One-time PIN (OTP)**.

## 2. Access Policy
1. Create a policy named `Allow Architect`.
2. Action: **Allow**.
3. Session Duration: **24 hours**.
4. Selector: **Emails**.
5. Value: Enter the architect's verified email address.

## 3. Worker Security
The backend functions in `/functions` should also verify the Cloudflare Access JWT if extra security is needed. For now, the `/admin` and `/login` routes are protected at the edge by Cloudflare Access.

## 4. D1 Database
Ensure the `DB` binding is correctly set in the Cloudflare Pages project settings to point to your D1 database instance.
