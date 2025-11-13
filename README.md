# DNS - Learning Management System

A comprehensive learning management system built with Next.js, TypeScript, and LMDB database.

## Features

- 🔐 **Authentication System** - Secure login and registration with JWT
- 👥 **Multi-Role Support** - Four user roles: Admin, Coach, Parents, Students
- 💾 **LMDB Database** - Fast, lightweight embedded database
- 🎨 **Modern UI** - Built with shadcn/ui and Tailwind CSS
- 🔒 **Password Security** - Bcrypt password hashing
- ✅ **Data Validation** - Zod schema validation

## User Roles

1. **Admin** - Manage users, view reports, configure system settings
2. **Coach** - Track student progress, assign tasks, manage schedules
3. **Parents** - Monitor children's learning, communicate with coaches
4. **Students** - Access assignments, track progress, view achievements

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

Edit `.env.local` and update the `JWT_SECRET` with a secure random string.

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
DNS/
├── src/
│   ├── app/
│   │   ├── api/auth/          # Authentication API routes
│   │   ├── login/             # Login page
│   │   ├── register/          # Registration page
│   │   ├── dashboard/         # Main dashboard
│   │   └── page.tsx           # Home page
│   ├── components/ui/         # shadcn/ui components
│   └── lib/
│       ├── auth.ts            # Authentication utilities
│       └── db/                # Database layer
│           ├── lmdb.ts        # LMDB configuration
│           ├── schema.ts      # Data schemas
│           └── user.model.ts  # User model
├── data/                      # LMDB database files (auto-generated)
└── public/                    # Static assets
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/session` - Get current session

## Database

The application uses LMDB (Lightning Memory-Mapped Database), a high-performance embedded database. Data is stored in the `data/` directory (excluded from git).

## Technologies

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Database**: LMDB
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Authentication**: JWT with jose
- **Password Hashing**: bcryptjs
- **Validation**: Zod

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

