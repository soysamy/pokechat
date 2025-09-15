# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Project Structure & Atomic Design

When building this project, I wanted the UI to be easy to scale, maintain, and reason about. That's why I chose to organize the components using the Atomic Design methodology. If you haven't heard of it, Atomic Design is a way of structuring UI components by breaking them down into five levels: atoms, molecules, organisms, templates, and pages. This approach helps keep things modular and reusable, which is especially useful as the app grows.

Here's how the structure looks in this project:

```
src/
   components/
      atoms/        # Smallest, reusable pieces (e.g., Button, Avatar, Text)
      molecules/    # Simple combinations of atoms (e.g., ChatBubble, InputBox)
      organisms/    # More complex UI sections (e.g., ChatWindow)
      templates/    # Page-level layouts (e.g., ChatTemplate)
      index.ts      # Exports for components
   core/
      api/          # API clients and tools (client.ts, pokeApiTool.ts)
      config/       # App-wide constants (constants.ts)
   features/
      chat/
         components/ # Chat-specific UI pieces
         hooks/      # Chat-related hooks
         services/   # Chat-related services (anthropic, pokemonApi)
         store/      # State management (pokeChatStore)
         index.ts    # Feature exports
   screens/        # App screens (ChatScreen, LoginScreen)
   styles/         # Shared style definitions (colors, spacing, typography)
   theme/          # Theme configuration (index.ts)

app/              # Expo app entry and routing
assets/           # Images and static assets
constants/        # Theme constants
hooks/            # Shared hooks
scripts/          # Utility scripts (reset-project.js)
```

### Why Atomic Design?

I picked Atomic Design because it makes the codebase more predictable and easier to navigate. For example, if I need to tweak a button style, I know exactly where to look—in the `atoms` folder. If I want to update a chat bubble, it's in `molecules`. This separation also encourages reusability, so I don't end up duplicating code for similar UI elements.

As the app grows, this structure helps keep things organized and makes onboarding new contributors much smoother. Each component has a clear place and purpose, which reduces confusion and technical debt over time.

---
