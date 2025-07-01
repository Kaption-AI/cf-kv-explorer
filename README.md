# Cloudflare KV Explorer

A modern, intuitive web application for exploring and managing Cloudflare KV (Key-Value) stores. Built with React, Vite, and SHADCN UI components.

## Features

### 🔍 **Intelligent Pattern Detection**
- Automatically detects key patterns like `account:{id}`, `client:{id}`, `link:{id}:{id}`
- Builds hierarchical tree structure for easy navigation
- Minimum lookup algorithm for efficient scanning

### 🌳 **Tree Explorer**
- Left sidebar with namespace and pattern navigation
- Expandable/collapsible tree structure
- Visual indicators for different data types

### ✏️ **JSON Editor**
- Syntax-highlighted JSON editing
- Real-time validation
- Save/reset functionality

### 📊 **Table View**
- Tabular display of multiple key-value pairs
- Edit and delete actions for each row
- Type indicators and value previews

### 🔐 **Secure API Integration**
- Support for Cloudflare API tokens
- Local testing mode for development
- Secure credential handling

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Cloudflare account (for production use)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cloudflare-kv-explorer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

### Local Testing

For testing without a real Cloudflare account:

1. **Use test credentials**
   - Account ID: `test` or `local`
   - API Token: any value
   - Email: any valid email

2. **The app will automatically use mock data** with sample patterns:
   - `account:{id}` - User accounts
   - `client:{id}` - Client companies
   - `link:{id}:{id}` - Account-client relationships
   - `config:global` - Configuration data
   - `session:user{id}:{sessionId}` - User sessions
   - `cache:page:{path}` - Page cache

## Usage

### 1. Authentication
- Enter your Cloudflare API credentials
- For testing, use `test` as Account ID

### 2. Namespace Selection
- Choose a KV namespace from the left sidebar
- The app will automatically scan for key patterns

### 3. Pattern Exploration
- Expand pattern groups in the tree
- Click on patterns to view data in table format
- Click on specific keys to edit in JSON format

### 4. Data Management
- **Edit**: Click edit button or select key for JSON editing
- **Delete**: Click delete button with confirmation
- **Save**: Use the save button in JSON editor

### 5. View Modes
- **Table View**: Best for browsing multiple records
- **JSON View**: Best for editing individual records

## Architecture

### Frontend Stack
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **SHADCN UI** - Component library
- **Lucide React** - Icons
- **TanStack Query** - Data fetching and caching

### Key Components

```
src/
├── components/
│   ├── ui/              # SHADCN UI components
│   ├── APIKeyInput.tsx  # Authentication form
│   ├── TreeExplorer.tsx # Sidebar navigation
│   ├── JSONEditor.tsx   # JSON editing interface
│   └── TableView.tsx    # Tabular data display
├── lib/
│   ├── cloudflare-api.ts # Cloudflare API client
│   ├── local-api.ts     # Local testing API
│   ├── pattern-detector.ts # Pattern detection algorithm
│   └── utils.ts         # Utility functions
├── hooks/
│   └── useCloudflareAPI.ts # React Query hooks
└── types/
    └── index.ts         # TypeScript definitions
```

### Pattern Detection Algorithm

The app uses an intelligent algorithm to detect key patterns:

1. **Key Scanning**: Scans all keys in a namespace
2. **Segment Analysis**: Splits keys by separator (`:`)
3. **ID Detection**: Identifies segments that look like IDs:
   - Numeric IDs (`123`, `4567`)
   - UUIDs (`550e8400-e29b-41d4-a716-446655440000`)
   - Hex IDs (`abc123def`)
   - Alphanumeric IDs (length > 8)
4. **Pattern Generation**: Replaces ID segments with `{id}` placeholder
5. **Tree Building**: Creates hierarchical structure for navigation

## Testing

### End-to-End Tests

Run comprehensive E2E tests with Puppeteer:

```bash
npm run test:e2e
```

Tests include:
- Application loading
- Authentication flow
- Namespace loading
- Pattern detection
- View mode switching
- Screenshot capture

### Manual Testing

1. **Start development server**
   ```bash
   npm run dev
   ```

2. **Use test credentials**
   - Account ID: `test`
   - API Token: `test-token`

3. **Verify functionality**
   - ✅ Namespaces load
   - ✅ Patterns are detected
   - ✅ Table view shows data
   - ✅ JSON editor works
   - ✅ Edit/delete operations work

## Development

### Project Structure

```
cloudflare-kv-explorer/
├── src/                 # Source code
├── tests/               # Test files
├── prompts/             # Documentation prompts
├── public/              # Static assets
├── tailwind.config.js   # Tailwind configuration
├── vite.config.ts       # Vite configuration
├── wrangler.toml        # Wrangler configuration
└── worker.js            # Test worker script
```

### Adding New Features

1. **Create components** in `src/components/`
2. **Add types** in `src/types/index.ts`
3. **Update API hooks** in `src/hooks/useCloudflareAPI.ts`
4. **Add tests** in `tests/`

### Local Development with Wrangler

For testing with real Cloudflare Workers:

1. **Start Wrangler dev server**
   ```bash
   npm run wrangler:dev
   ```

2. **Populate test data**
   ```bash
   npm run wrangler:populate
   ```

## Configuration

### Environment Variables

Create `.env.local` for development:

```env
VITE_API_BASE_URL=https://api.cloudflare.com/client/v4
VITE_LOCAL_MODE=true
```

### Tailwind Configuration

The project uses a custom Tailwind configuration with:
- SHADCN UI color system
- Custom animations
- Responsive breakpoints

## Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Cloudflare Pages

1. Connect your repository to Cloudflare Pages
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Check the [Issues](../../issues) page
- Review the documentation in `prompts/` folder
- Test with local mode first

---

**Built with ❤️ for the Cloudflare community**
