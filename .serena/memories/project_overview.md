# Gobbldygook Project Overview

## Purpose
Gobbldygook is a course scheduler web application for students at St. Olaf College. Students provide their areas of study (majors, concentrations, degrees) and courses they have taken/plan to take, and the app tells them if they can graduate.

## Tech Stack
- **Frontend**: React 18.3.1 with React Router (Reach Router)
- **Build System**: Currently webpack 5.94.0 (to be migrated to Vite)
- **Styling**: SCSS with styled-components
- **Type System**: Flow (not TypeScript)
- **Language**: JavaScript (ES6+) with Babel transpilation
- **Testing**: Jest with React Testing Library
- **State Management**: Redux with redux-thunk and redux-promise
- **Database**: IndexedDB (browser-based storage)
- **Package Manager**: Yarn with workspaces
- **Node Version**: 22+ (managed with mise tool)

## Project Structure
- Monorepo structure with multiple packages in `modules/` directory
- Main web app is in `modules/gob-web/`
- Each module has its own package.json
- Flow type definitions in `config/decls/`
- Static assets served from `modules/gob-web/static/`

## Key Features
- Drag-and-drop course scheduling
- SIS data import
- Graduation requirement checking
- Multi-semester planning
- Web Workers for heavy computations
- Offline-capable (IndexedDB)