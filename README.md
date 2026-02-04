# SleepyLeo Portfolio

A modern portfolio website built with Next.js, featuring project management, AI intern assistant, and server health monitoring.

## Features

- 🎨 **Modern UI** - Glassmorphism design with smooth animations
- 📁 **Project Management** - Import and manage GitHub projects
- 🤖 **AI Intern** - AI-powered assistant for server commands
- 📊 **Server Health** - Real-time VM monitoring via Cloudflare Access
- 🔐 **Admin Dashboard** - Secure admin area with authentication

## Getting Started

### Prerequisites

- Node.js 20+
- Bun or npm
- PostgreSQL database
- Cloudflared (for VM remote access)

### Environment Setup

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Configure your environment variables in `.env`:
   - **Database**: Set your PostgreSQL connection string
   - **GitHub**: Add your username and optional token
   - **Admin Auth**: Set secure admin credentials
   - **VM SSH**: Configure Cloudflare Access for remote VM

### Development

```bash
# Install dependencies
bun install

# Generate Prisma client
bunx prisma generate

# Run database migrations
bunx prisma db push

# Start development server
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## VM Remote Access Setup

The AI Intern and Server Health features require SSH access to a remote VM through Cloudflare Access.

### Requirements

1. **Cloudflared** installed on both your local machine and production server
2. A Cloudflare Access application configured for SSH
3. VM credentials configured in environment variables

### Configuration

Set these environment variables:

```env
VM_SSH_HOST="ssh.your-domain.com"  # Cloudflare Access hostname
VM_SSH_USER="root"                  # SSH username
VM_SSH_PASSWORD="your-password"     # SSH password
```

## Docker Deployment

```bash
# Build the image
docker build -t sleepyleo .

# Run the container
docker run -p 3000:3000 --env-file .env sleepyleo
```

The Docker image includes cloudflared for SSH tunneling support.

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **AI**: OpenRouter API
- **SSH Tunneling**: Cloudflare Access + cloudflared

## License

MIT
