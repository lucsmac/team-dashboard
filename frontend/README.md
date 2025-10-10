# Frontend - Team Report Dashboard

Modern React-based team dashboard with tabbed navigation system.

## Stack

- **React 18** + **Vite 6**
- **React Router v7** (client-side routing)
- **Tailwind CSS 3** (styling)
- **shadcn/ui** (component library)
- **Lucide React** (icons)

## Structure

```
frontend/
├── src/
│   ├── components/      # React components
│   │   ├── ui/         # shadcn/ui primitives
│   │   ├── dashboard/  # Main tab components
│   │   ├── overview/   # Metrics & summary
│   │   ├── team/       # Team management
│   │   ├── demands/    # Demands CRUD
│   │   ├── timeline/   # Timeline tasks
│   │   ├── deliveries/ # Deliveries
│   │   ├── highlights/ # Highlights panel
│   │   ├── devs/       # Developer cards/tables
│   │   ├── layout/     # Layout components
│   │   └── common/     # Shared components
│   ├── context/        # React Context (state)
│   ├── hooks/          # Custom React hooks
│   ├── services/       # API integration
│   ├── utils/          # Helper functions
│   ├── data/           # Initial data
│   ├── lib/            # Third-party config
│   ├── App.jsx         # Main app component
│   ├── index.jsx       # Entry point
│   └── index.css       # Global styles
├── Dockerfile          # Production build
├── Dockerfile.dev      # Development with hot reload
├── nginx.conf          # Nginx config for production
├── vite.config.js      # Vite bundler config
├── tailwind.config.js  # Tailwind CSS config
├── postcss.config.js   # PostCSS config
├── jsconfig.json       # JavaScript config
├── components.json     # shadcn/ui config
└── package.json        # Dependencies
```

## Development

```bash
# Local development (requires Node.js 18+)
cd frontend
npm install
npm run dev
# → http://localhost:5173

# Docker development (hot reload)
cd ..
docker-compose -f docker-compose.dev.yml up -d
# → http://localhost:5173
```

## Production

```bash
# Build locally
npm run build
# Output: dist/

# Docker production
cd ..
docker-compose up -d
# → http://localhost:3000
```

## Environment Variables

Create `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

## Key Features

- **Tabbed Navigation**: Overview, Team, Demands, Highlights
- **URL-based routing**: `/overview`, `/team`, `/demands`, `/highlights`
- **CRUD Operations**: Full create/update/delete for all entities
- **API Integration**: PostgreSQL via Express backend
- **Responsive Design**: Mobile-friendly
- **Dark Mode Ready**: CSS variables support

## Adding Components

```bash
# Add shadcn/ui component
npx shadcn@latest add <component-name>
```

## API Endpoints

Frontend communicates with backend at `VITE_API_URL`:

- `GET /api/dashboard` - Full dashboard data
- `GET/POST/PUT/DELETE /api/devs` - Developer CRUD
- `GET/POST/PUT/DELETE /api/demands` - Demands CRUD
- `GET/POST/PUT/DELETE /api/timeline` - Timeline tasks CRUD
- And more...

See backend documentation for complete API reference.
