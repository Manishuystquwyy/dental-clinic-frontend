# Frontend deployment — 2026-10-02

Server: ubuntu@130.210.42.17. Public URLs: https://gayatridental.com and
https://www.gayatridental.com. Source commit: 0cdf32c (clean at build time).

Built using Node 22.22.2, explicitly selected because the project shell resolved
Node 20 despite the parent shell using Node 22. Lint and all 21 Node tests passed.
Production API: https://api.gayatridental.com/api.
Archive SHA-256: ab8e61e28f9c24999f6fe7a34be58943cd509c5657030a3a43f8438821f2999b.

Nginx serves /var/www/dental-current, a symlink to
/var/www/dental-releases/20261002. The complete dist, including PDF.js assets,
was deployed. Previous hashed assets are also available for already-open clients.
The previous site remains at /var/www/html for rollback.

Nginx site: /etc/nginx/sites-available/dental-clinic-frontend.
Original configuration: /var/backups/dental-frontend/20261002/nginx.conf.
HTML uses Cache-Control: no-store; hashed assets cache for one year with immutable;
other unversioned files revalidate. JS/CSS/JSON/WASM/SVG compression is enabled.
Cloudflare's existing HTTPS-to-HTTP origin routing is preserved.

Verification: nginx -t passed, service active and enabled. Public root HTML matched
local build byte-for-byte. Both domains and the main JS returned HTTP 200. API
/api/dentists returned HTTP 200 with the expected frontend CORS origin. Browser
homepage rendered with no captured console warnings/errors. Authentication,
booking, payments and document uploads were not exercised.

Cleanup: apt-get clean; removed obsolete /home/ubuntu/dist staging files; rotated
journals and vacuumed 224 MiB of archives. Journals now occupy 56 MiB. Persistent
journal cap 64 MiB and runtime cap 32 MiB are set in
/etc/systemd/journald.conf.d/60-dental-log-limits.conf. Final root disk: 3.4 GiB
used, 42 GiB available (8%); available memory about 430 MiB. Firmware and Oracle
services remain running. No external CDN-wide purge was performed; public HTML
was verified fresh and current hashed assets were served successfully.

Rollback: copy /var/backups/dental-frontend/20261002/nginx.conf over
/etc/nginx/sites-available/dental-clinic-frontend, run sudo nginx -t, and then
sudo systemctl reload nginx. The restored configuration serves /var/www/html.
