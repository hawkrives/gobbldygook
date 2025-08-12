# Webpack to Vite Migration

This project has been migrated from Webpack to Vite for improved development experience and faster builds.

## What Changed

### Build System

- **Webpack 5** → **Vite 5**
- **webpack-dev-server** → **Vite dev server**
- Custom HTML plugin → Native Vite HTML handling

### Configuration Files

- `webpack.config.js` → `vite.config.js`
- Added `index.html` as the main entry point
- Updated package.json scripts

### Dependencies Updated

- Removed webpack-related dependencies
- Added Vite and related plugins
- Kept all existing functionality

### Worker Imports

Workers now use Vite's native worker support:

```js
// Old (webpack)
import Worker from "./worker.js"

// New (Vite)
const worker = new Worker(new URL('./worker.js', import.meta.url), { type: 'module' })
```

### Environment Variables

- `NODE_ENV` is handled automatically by Vite
- Custom variables like `TRAVIS_COMMIT` are still available via `define` config
- All existing environment variable usage remains unchanged

## Development Commands

All commands remain the same:

- `mise run start` - Start development server
- `mise run build` - Production build
- `mise run build-dev` - Development build

## What Works the Same

- All React components and functionality
- SCSS preprocessing
- Flow type checking
- Jest testing
- Static asset handling
- Web workers
- Hot module replacement (now even faster!)
- Production builds and deployment

## Benefits

- **Faster cold start**: ~10x faster than webpack
- **Faster HMR**: Near-instant hot module replacement
- **Better dev experience**: More responsive development server
- **Smaller bundle size**: Better tree-shaking and optimization
- **Modern defaults**: ES modules, modern browser targets

## Troubleshooting

If you encounter any issues:

1. Clear any existing build artifacts: `rm -rf modules/gob-web/build`
2. Clear node_modules and reinstall: `rm -rf node_modules && yarn install`
3. Ensure you're using Node.js 22+ as specified in mise.toml

## Migration Notes

- The build output structure remains the same for deployment compatibility
- All existing functionality has been preserved
- Source maps are available in both development and production
- Static files are served from the `static/` directory as before
