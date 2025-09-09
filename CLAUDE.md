# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

- **Development**: `npm run dev` - Start the development server with Turbopack
- **Build**: `npm run build` - Build the Next.js application for production with Turbopack
- **Start**: `npm start` - Start the production server
- **Lint**: `npm run lint` or `eslint` - Run ESLint on the codebase

## Project Architecture

This is a Next.js 15 application that integrates Syncfusion's DocumentEditor component to create a customizable word processor with live toolbar configuration and theme switching.

### Core Structure

- **Next.js App Router**: Uses the `/src/app` directory structure
- **Main Components**:
  - `src/app/page.tsx` - Main page with toolbar configurator UI and WordProcessor integration
  - `src/app/components/WordProcessor.tsx` - Core Syncfusion DocumentEditor wrapper component
  - `src/app/layout.tsx` - Root layout with theme CSS link management

### Syncfusion Integration

The application uses Syncfusion v31.1.17 with these key packages:
- `@syncfusion/ej2-react-documenteditor` - Main document editor component
- `@syncfusion/ej2-react-buttons`, `@syncfusion/ej2-react-grids` - Additional UI components
- `@syncfusion/ej2-base`, `@syncfusion/ej2-data` - Core Syncfusion dependencies

### Key Features

1. **Dynamic Toolbar Configuration**: 
   - Built-in toolbar items can be enabled/disabled through UI controls
   - Custom toolbar buttons can be added with configurable icons and actions
   - Toolbar items are normalized from strings to CustomToolbarItemModel objects

2. **Theme System**:
   - Dynamic theme switching via CSS link href updates
   - Supports Fluent 2, Material 3, Bootstrap 5.3, Tailwind, and High Contrast themes
   - Theme selection persists in localStorage

3. **Document Editor Features**:
   - Built-in support for common operations: Undo/Redo, Find, Print, Export (DOCX/PDF)
   - Custom toolbar actions (e.g., "Hello" button that inserts text)
   - Configurable zoom controls and read-only mode

### Development Notes

- Uses TypeScript with strict mode enabled
- Path alias `@/*` maps to project root
- Tailwind CSS configured with PostCSS
- ESLint configured with Next.js and TypeScript rules
- Turbopack enabled for faster development and builds

### Important Implementation Details

- The WordProcessor component normalizes mixed toolbar configurations (strings + objects) into consistent CustomToolbarItemModel format
- Toolbar click handlers are centrally managed in the onToolbarClick method
- Theme CSS is loaded dynamically via a link element with id="sf-theme"
- Built-in toolbar items have a mapping system in SUPPORTED_BUILTINS for custom implementations