# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## API Configuration

This frontend uses `VITE_API_BASE_URL` to decide which backend to call.

- Local development: [`.env.development`](/Users/manishkumar/Desktop/App/INT-1/dental-clinic-frontend/.env.development) keeps requests on `/api`, and `src/api/client.js` falls back to `http://localhost:8080/api` when running on localhost.
- Production build: [`.env.production`](/Users/manishkumar/Desktop/App/INT-1/dental-clinic-frontend/.env.production) points to `https://api.gayatridental.com/api`.

Deploy flow:

1. Run `npm run build`.
2. Deploy the generated `dist/` folder to the frontend host.
3. Make sure the backend CORS config includes the deployed frontend origin, for example `https://gayatridental.com` and `https://www.gayatridental.com`.
