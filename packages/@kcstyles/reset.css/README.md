# @kcstyles/reset.css

A CSS reset for consistent styling across browsers.

- [Installation](#installation)
- [Usage](#usage)
  - [Via CSS](#via-css)
  - [Via JavaScript/TypeScript bundler](#via-javascripttypescript-bundler)
  - [Via HTML](#via-html)
- [References](#references)

## Installation

```bash
pnpm add @kcstyles/reset.css
```

## Usage

Import the reset style sheet at the entry point of your project, before any other styles:

### Via CSS

```css
@import "@kcstyles/reset.css";
```

### Via JavaScript/TypeScript bundler

```ts
import "@kcstyles/reset.css";
```

### Via HTML

```html
<link rel="stylesheet" href="node_modules/@kcstyles/reset.css/dist/index.css" />
```

## References

- [CSS Reset — MDN](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Cascade_and_inheritance)
- [A Modern CSS Reset](https://www.joshwcomeau.com/css/custom-css-reset/)
