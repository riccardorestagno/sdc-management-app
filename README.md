# SDC Management App

A React application built with TypeScript, Vite, and Yarn.

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Yarn** - Package manager
- **React Router** - Routing
- **Axios** - HTTP client

## Prerequisites

- Node.js (v18 or higher recommended)
- Yarn (v1.22 or higher)

## Getting Started

### Installation

Navigate to the client directory and install dependencies:

```bash
cd client
yarn install
```

## Available Scripts

In the `client` directory, you can run:

### `yarn dev`

Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You will also see any lint errors in the console.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

### `yarn preview`

Preview the production build locally before deploying.\
This serves the built files from the `build` folder.

### `yarn test`

Launches the test runner with Vitest.\
See the [Vitest documentation](https://vitest.dev/) for more information.

## Environment Variables

Vite uses environment variables with the `VITE_` prefix.

Create a `.env` file in the `client` directory:

```env
VITE_API_URL=your_api_url_here
```

Access them in your code:
```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

## Learn More

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Yarn Documentation](https://yarnpkg.com/)
