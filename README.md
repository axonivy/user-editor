# User Editor

[![translation-status](https://hosted.weblate.org/widget/axonivy/user-editor/svg-badge.svg)](https://hosted.weblate.org/engage/axonivy/)

This repo contains the web-based next gen user editor.

## Client

This client is build with React.

### Available Scripts

`pnpm run dev`: Start the dev server

### VsCode dev environment

#### Debug

Debug and breakpoint support is available in the provided launch configs:

- Launch `Standalone Mock` config to interact with a mocked backend.
- Launch `Standalone` config to work with an ivyEngine backend.
  1. Start your dev-engine in Eclipse RCP IDE
  2. Open the test project in a ivy VsCode workspace or run the playwright global setup script.
  3. Launch the config in this repo

#### Run tests

To run tests you can ether start a script above or start Playwright or Vitest with the recommended workspace extensions.
