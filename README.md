# react-magic-ui

A React component library for creating stunning liquid glass effect UI components.

## Installation

```bash
npm install react-magic-ui
```

## Usage

Import the components you need:

```tsx
import { Button, Card, Input, Switch, Toast } from 'react-magic-ui';

function App() {
  return (
    <div>
      <Button variant="primary" size="medium">
        Click me
      </Button>
      <Card>
        <h2>Beautiful Card</h2>
        <p>With liquid glass effect</p>
      </Card>
    </div>
  );
}
```

> **Note:** Styles are automatically imported when you use the library. No need to manually import CSS files.

## Available Components

- **Button** - Customizable button with liquid glass effect
- **Card** - Container with glassmorphism styling
- **Input** - Styled input field
- **Switch** - Toggle switch component
- **Toast** - Notification toast messages
- **Modal** - Modal dialog component
- **Tabs** - Tabbed interface component
- **Badge** - Label and badge component
- **Sidebar** - Navigation sidebar
- **Topbar** - Top navigation bar
- **Glass** - Base glass effect wrapper

## Features

- 🎨 Beautiful liquid glass effect
- 🌈 Gradient backgrounds and animations
- 📱 Fully responsive
- ♿ Accessible components
- 🎭 TypeScript support
- 🔧 Customizable with props

## Development

```bash
# Install dependencies
npm install

# Run Storybook
npm run storybook

# Build library
npm run build

# Run tests
npm test
```

## License

MIT © [@tweeedlex](https://github.com/tweeedlex)