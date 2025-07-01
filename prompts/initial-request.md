# Cloudflare KV Explorer - Initial Request

## Project Overview
Create a Cloudflare KV explorer application using React.js, Vite, and SHADCN.

## Key Requirements

### Technology Stack
- React.js
- Vite
- SHADCN UI components

### Core Features
1. **API Key Input**: User inputs Cloudflare API keys to interact with KV databases
2. **Tree Explorer**: Left sidebar showing different key-value databases
3. **Intelligent Key Scanning**: Scan all prefixes with minimum lookup algorithm
4. **Pattern Detection**: Detect patterns like:
   - `account:1235` → `account: {id}`
   - `client:123` → `client: {id}`
   - `link:123:1235` → `link: {id} : {id}`
5. **JSON Editor**: Edit formatted JSON content when clicking prefixes
6. **Table View**: List data in table format when needed

### Technical Requirements
- Use Wrangler for local KV environment simulation
- Implement Puppeteer testing for integration tests
- Create separate integration testing folder
- All tests must pass
- Self-validation of functionality

### Documentation
- Store all prompts in `prompts/` folder
- Create final report with screenshots
- Include test results showing everything works

### Deliverables
- Full working application
- Integration tests
- Final report with screenshots
- All tests passing