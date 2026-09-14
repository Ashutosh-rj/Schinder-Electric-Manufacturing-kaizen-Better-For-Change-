const fs = require('fs');
const path = require('path');

const baseDir = "d:\\Hackthaon\\Scnider\\Kaizen Changer for Better\\kaizen\\frontend";

const dirs = [
    "public",
    "src/lib",
    "src/types",
    "src/stores",
    "src/hooks",
    "src/components/layout",
    "src/components/ui",
    "src/components/charts",
    "src/components/kpi",
    "src/components/plant",
    "src/components/alarms",
    "src/components/kaizen",
    "src/components/recommendations",
    "src/components/demo",
    "src/pages"
];

for (const d of dirs) {
    fs.mkdirSync(path.join(baseDir, d.split('/').join(path.sep)), { recursive: true });
}

const files = {};
files["package.json"] = `{
  "name": "kaizen-frontend",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-label": "^2.0.2",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-slider": "^1.1.2",
    "@radix-ui/react-slot": "^1.0.2",
    "@radix-ui/react-tabs": "^1.0.4",
    "@radix-ui/react-toast": "^1.1.5",
    "@radix-ui/react-tooltip": "^1.0.7",
    "@tanstack/react-query": "^5.28.9",
    "axios": "^1.6.8",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "date-fns": "^3.6.0",
    "echarts": "^5.5.0",
    "echarts-for-react": "^3.0.2",
    "lucide-react": "^0.363.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.22.3",
    "tailwind-merge": "^2.2.2",
    "tailwindcss-animate": "^1.0.7",
    "zustand": "^4.5.2"
  },
  "devDependencies": {
    "@types/node": "^20.11.30",
    "@types/react": "^18.2.66",
    "@types/react-dom": "^18.2.22",
    "@typescript-eslint/eslint-plugin": "^7.2.0",
    "@typescript-eslint/parser": "^7.2.0",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.19",
    "eslint": "^8.57.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.6",
    "postcss": "^8.4.38",
    "tailwindcss": "^3.4.3",
    "typescript": "^5.2.2",
    "vite": "^5.2.0"
  }
}`;

files["tsconfig.json"] = `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}`;

files["tsconfig.node.json"] = `{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}`;

files["vite.config.ts"] = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: process.env.VITE_API_BASE_URL || 'http://localhost:8000',
        changeOrigin: true,
      },
      '/ws': {
        target: process.env.VITE_WS_BASE_URL || 'ws://localhost:8000',
        ws: true,
      }
    }
  }
});`;

files["tailwind.config.ts"] = `/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "#2a3a5c",
        input: "#2a3a5c",
        ring: "#00d4ff",
        background: "#0a0e1a",
        foreground: "#e8eaf6",
        primary: {
          DEFAULT: "#00d4ff",
          foreground: "#0a0e1a",
        },
        secondary: {
          DEFAULT: "#8899aa",
          foreground: "#0a0e1a",
        },
        destructive: {
          DEFAULT: "#ef5350",
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "#141e35",
          foreground: "#8899aa",
        },
        accent: {
          DEFAULT: "#00d4ff",
          foreground: "#0a0e1a",
        },
        popover: {
          DEFAULT: "#1a2540",
          foreground: "#e8eaf6",
        },
        card: {
          DEFAULT: "#1a2540",
          foreground: "#e8eaf6",
        },
        success: "#00e676",
        warning: "#ffa726",
        danger: "#ef5350",
      },
      borderRadius: {
        lg: "0.5rem",
        md: "calc(0.5rem - 2px)",
        sm: "calc(0.5rem - 4px)",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}`;

files["postcss.config.js"] = `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`;

files["index.html"] = `<!DOCTYPE html>
<html lang="en" class="dark">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>KAIZEN - Cement Plant Intelligence</title>
    <style>
      body { background-color: #0a0e1a; color: #e8eaf6; margin: 0; }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;

files["src/main.tsx"] = `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`;

files["src/index.css"] = `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 226 44% 7%;
    --foreground: 231 48% 94%;
    --card: 222 42% 18%;
    --card-foreground: 231 48% 94%;
    --popover: 222 42% 18%;
    --popover-foreground: 231 48% 94%;
    --primary: 190 100% 50%;
    --primary-foreground: 226 44% 7%;
    --secondary: 210 20% 60%;
    --secondary-foreground: 226 44% 7%;
    --muted: 222 46% 14%;
    --muted-foreground: 210 20% 60%;
    --accent: 190 100% 50%;
    --accent-foreground: 226 44% 7%;
    --destructive: 0 84% 63%;
    --destructive-foreground: 0 0% 100%;
    --border: 221 37% 26%;
    --input: 221 37% 26%;
    --ring: 190 100% 50%;
    --radius: 0.5rem;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}`;

files["src/App.tsx"] = `import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<div>Hello World</div>} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}`;

for (const [f, content] of Object.entries(files)) {
    const p = path.join(baseDir, f.split('/').join(path.sep));
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, content, 'utf8');
}
console.log("Generated config files.");
