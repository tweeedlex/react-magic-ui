# Contributing

Thanks for your interest in contributing to react-magic-ui!

## Structure

All components are located in the `src/components` directory.

Each component has its own directory with the following structure:
```
src/components/
  └── component-name/
      ├── __docs__/                     
          ├── <Component>.mdx           # Docs page
          ├── <Component>.stories.tsx   # Storybook stories
          └── Example.tsx               # Usage example for docs
      ├── __test__/                     # Test files
      ├── style/                        # SCSS Styles
      ├── <Component>.tsx               # Main component file
      └── index.ts                      # Export file
```

## Development
### Clone the repository
```bash
git clone https://github.com/tweeedlex/react-magic-ui.git
```

### Install dependencies
```bash
cd react-magic-ui
yarn
```

### Run the Storybook
```bash
npm run storybook
```

---

> ⚠️ NOTE 1: Safari and Firefox only partially support the effect (displacement will not be visible).
> The contributions to improve cross-browser compatibility are welcome.

>  ⚠️ NOTE 2: There is and issue with Tailwind inline classes as the styles are not being applied when using the library in the project.
> While the issues is not resolved, you should use Tailwind classes through @apply directive.

## Commit Convention
Before you create a Pull Request, please check that your commit messages follow the Conventional Commits specification. This helps maintain a clear and consistent commit history.

https://www.conventionalcommits.org/

### Commit Examples
- `feat: add Dropdown component`
- `fix: resolve Button hover effect in Safari`
- `docs: update Card component examples`

## Requests for new components

If you have a request for a new component, please open a discussion on GitHub. We'll be happy to help you out.

## Testing

Tests are written using [Vitest](https://vitest.dev). You can run all the tests from the root of the repository.

```bash
npm run test
```

Please ensure that the tests are passing when submitting a pull request. If you're adding new features, please include tests.