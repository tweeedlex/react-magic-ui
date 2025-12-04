# react-magic-ui
[![npm version](https://img.shields.io/npm/v/react-magic-ui.svg)](https://www.npmjs.com/package/react-magic-ui)
[![npm downloads](https://img.shields.io/npm/dm/react-magic-ui.svg)](https://www.npmjs.com/package/react-magic-ui)
[![license](https://img.shields.io/npm/l/react-magic-ui.svg)](https://github.com/tweeedlex/react-magic-ui/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/tweeedlex/react-magic-ui.svg)](https://github.com/tweeedlex/react-magic-ui/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/tweeedlex/react-magic-ui.svg)](https://github.com/tweeedlex/react-magic-ui/issues)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/tweeedlex/react-magic-ui/blob/main/CONTRIBUTING.md)

A React component library for creating stunning liquid glass effect UI components.

![Screenshot](https://raw.githubusercontent.com/tweeedlex/react-magic-ui/main/public/assets/demo.png)

## Installation
### [🚀 Live demo](https://magic-ui-demo.tappers.tech)
Here you can mess with the components. Enjoy!

## Installation

1. Install the library using npm: 
```bash
npm install react-magic-ui
```

2. Import styles in your main application file (e.g., `index.tsx` or `App.tsx`):

```
import 'react-magic-ui/dist/react-magic-ui.css'
```

## Documentation

### [📚 Live Component Examples in Storybook](https://magic-ui-storybook.tappers.tech/)

Explore all components with interactive examples, props documentation, and live code previews in our Storybook.

## Usage

Import the components you need:

```tsx
import { Button, Card } from 'react-magic-ui';

function App() {
  return (
    <section>
      <Button>
        Click me
      </Button>
      <Card>
        <h2>Beautiful Card</h2>
        <p>With liquid glass effect</p>
      </Card>
    </section>
  );
}
```

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
- **Checkbox** - Checkbox component
- **Select** - Select component
- **Slider** - Slider component
- **Glass** - Base glass effect wrapper (used for creating custom components)

## Features

- 📱 14 components for your basic needs
- 🎨 Beautiful liquid glass effect
- 🌈 Liquid-like glassmorphism animations
- 🔧 Customizable with props
- 📦 Create your own custom components with Glass component

>  ⚠️ NOTE: Safari and Firefox only partially support the effect (displacement will not be visible)

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

## Contributing
Please read the [contributing guide](/CONTRIBUTING.md).


## License

MIT © [@tweeedlex](https://github.com/tweeedlex)