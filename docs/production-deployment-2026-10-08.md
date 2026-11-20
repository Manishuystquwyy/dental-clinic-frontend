# Frontend deployment — 2026-10-08

Server: ubuntu@130.210.42.17. Public URLs: https://gayatridental.com and
https://www.gayatridental.com. Source: `feature/locking` at
`95c713fbfe125220a51191cf47eb805b5e31e524`, with a clean working tree at build time.
Deployed at 2026-10-08T10:48:21Z (16:18:21 IST).

Built with Node 22.22.2. Lint, all 41 Node tests, and the Vite production build
passed. Production API: https://api.gayatridental.com/api.

Archive SHA-256: `4d5a86c6ab695c394f0e03331097aeb0a6fa7857b4c350718a1ef8037449cd88`.
Index SHA-256: `696623b608baabe06bc286212a5fef26a053fc6c3153136f92d969cd9669c8ee`.

Release: `/var/www/dental-releases/20261008T104633Z-95c713f`. All 279 files from
`dist/` were checksum-verified on the server, including PDF.js assets. Forty-five
hashed assets from the previous release were retained for already-open clients.
The `/var/www/dental-current` symlink was atomically switched from
`/var/www/dental-releases/20261002` to the new release.

The existing Nginx configuration was retained. `nginx -t` passed and the service
remained active. Origin root and login HTML matched the build byte-for-byte; the
new JavaScript returned HTTP 200. Public API schema includes the compatible
appointment policy and refund fields. The dentists API returned HTTP 200 with
the production frontend CORS origin. An unauthenticated policy request returns
HTTP 403 as expected for its role-protected route.

All 53 public HTTPS checks passed across both domains: root HTML, routed pages
(`/login`, `/book`, `/doctors`), all JavaScript/CSS/worker chunks and representative
PDF.js character map, font, ICC and OpenJPEG WASM assets returned HTTP 200 with
body hashes matching the local build. HTML uses `no-store`; hashed JavaScript
and CSS use `immutable`. The existing `.mjs` worker `no-cache` revalidation policy
was retained. Worker JavaScript and WASM content types were correct.
The final server check confirmed the current release target, valid Nginx
configuration and active service; the previous main bundle still returned
HTTP 200 at the origin.

Browser homepage verification loaded `index-DSGC2Ha1.js`. The homepage and login
form rendered, including the Google sign-in button, with no captured console
warnings or errors. Login, signup, booking, refunds, payments and document uploads
have not been exercised by this rollout.

Backup: `/var/backups/dental-frontend/20261008T104633Z-95c713f/`, containing the
previous symlink target, Nginx configuration, checksums, manifest and deployment
timestamp. The deployment script was saved as `deploy.sh` with mode `0600`.
The temporary staging directory
`/home/ubuntu/dental-frontend-20261008T104633Z-95c713f` was removed after verification.

Rollback:

```sh
sudo bash /var/backups/dental-frontend/20261008T104633Z-95c713f/rollback.sh
```
