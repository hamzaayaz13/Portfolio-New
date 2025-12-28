# Portfolio - Scroll Expansion Hero Component

A modern, interactive portfolio showcasing the Scroll Expansion Hero component built with Next.js, TypeScript, Tailwind CSS, and Framer Motion.

## 🚀 Features

- **Interactive Scroll Effect**: Media expands smoothly as you scroll
- **Video & Image Support**: Works with both video and image content
- **YouTube Support**: Embed YouTube videos seamlessly
- **Mobile Optimized**: Touch-friendly with responsive design
- **Text Blend Mode**: Optional text blending effects
- **TypeScript**: Full type safety
- **Tailwind CSS**: Modern, utility-first styling
- **shadcn/ui**: Component architecture following shadcn conventions

## 📋 Prerequisites

- Node.js 18.x or higher
- pnpm (recommended) or npm

## 🛠️ Installation

### Step 1: Install Dependencies

```bash
pnpm install
```

Or with npm:

```bash
npm install
```

### Step 2: Run Development Server

```bash
pnpm dev
```

Or with npm:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
Portfolio/
├── app/
│   ├── demos/                    # Demo pages
│   │   ├── video-text-blend/     # Video with text blend
│   │   ├── image-text-blend/     # Image with text blend
│   │   ├── video-expansion/      # Video expansion demo
│   │   └── image-expansion/      # Image expansion demo
│   ├── globals.css               # Global styles with Tailwind
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main demo page
├── components/
│   └── ui/
│       └── scroll-expansion-hero.tsx  # Main component
├── lib/
│   └── utils.ts                  # Utility functions (cn helper)
├── components.json               # shadcn/ui configuration
├── tailwind.config.ts            # Tailwind configuration
├── tsconfig.json                 # TypeScript configuration
└── next.config.mjs               # Next.js configuration
```

## 🎨 Component Usage

### Basic Usage

```tsx
import ScrollExpandMedia from '@/components/ui/scroll-expansion-hero';

export default function MyPage() {
  return (
    <ScrollExpandMedia
      mediaType='video'
      mediaSrc='/path/to/video.mp4'
      bgImageSrc='/path/to/background.jpg'
      title='My Amazing Project'
      date='2025'
      scrollToExpand='Scroll to Expand'
    >
      <div>Your content here</div>
    </ScrollExpandMedia>
  );
}
```

### Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `mediaType` | `'video' \| 'image'` | `'video'` | Type of media to display |
| `mediaSrc` | `string` | Required | Path or URL to the media file |
| `posterSrc` | `string` | Optional | Poster image for videos |
| `bgImageSrc` | `string` | Required | Background image URL |
| `title` | `string` | Optional | Title text (splits into two lines) |
| `date` | `string` | Optional | Date or subtitle text |
| `scrollToExpand` | `string` | Optional | Scroll instruction text |
| `textBlend` | `boolean` | `false` | Enable text blend mode |
| `children` | `ReactNode` | Optional | Content below the hero |

### YouTube Videos

You can use YouTube videos by passing a YouTube URL:

```tsx
<ScrollExpandMedia
  mediaType='video'
  mediaSrc='https://www.youtube.com/watch?v=YOUR_VIDEO_ID'
  // ... other props
/>
```

## 🎭 Demo Pages

Visit these routes to see different variations:

- `/` - Interactive demo with video/image toggle
- `/demos/video-text-blend` - Video with text blend effect
- `/demos/image-text-blend` - Image with text blend effect
- `/demos/video-expansion` - Basic video expansion
- `/demos/image-expansion` - Basic image expansion

## 🔧 Customization

### Changing Colors

Edit the color values in `tailwind.config.ts` or use Tailwind's color classes in the component.

### Modifying Scroll Speed

In `scroll-expansion-hero.tsx`, adjust these values:

```tsx
const scrollDelta = e.deltaY * 0.0009; // Desktop scroll speed
const scrollFactor = deltaY < 0 ? 0.008 : 0.005; // Mobile scroll speed
```

### Animation Timing

Modify Framer Motion transitions in the component:

```tsx
transition={{ duration: 0.7 }} // Adjust duration
```

## 📦 Dependencies

### Production Dependencies
- `next` - React framework
- `react` & `react-dom` - React library
- `framer-motion` - Animation library
- `tailwindcss` - CSS framework
- `class-variance-authority` - Variant management
- `clsx` & `tailwind-merge` - Class name utilities
- `lucide-react` - Icon library

### Dev Dependencies
- `typescript` - Type safety
- `@types/node`, `@types/react`, `@types/react-dom` - Type definitions
- `eslint` - Code linting
- `postcss` & `autoprefixer` - CSS processing

## 🎯 Why `/components/ui`?

The `/components/ui` folder structure is important because:

1. **shadcn/ui Convention**: This is the standard path for shadcn components
2. **Organization**: Separates base UI components from feature components
3. **Consistency**: Makes it easier to add more shadcn components later
4. **Import Clarity**: Clear distinction between UI primitives and app-specific components

## 🚀 Production Build

```bash
pnpm build
pnpm start
```

Or with npm:

```bash
npm run build
npm start
```

## 📝 TypeScript Configuration

The project uses strict TypeScript settings for maximum type safety. The `tsconfig.json` includes:

- Path aliases (`@/*` points to root)
- Strict type checking
- Next.js plugin support

## 🎨 Tailwind CSS

The project uses a customized Tailwind configuration with:

- CSS variables for theming
- Dark mode support
- shadcn/ui color scheme
- Custom border radius values

## 🤝 Contributing

Feel free to customize and extend this component for your needs!

## 📄 License

This project is open source and available under the MIT License.





