# Unduit Case Study - Setup Instructions

## File Location
The standalone case study file is located at: `unduit-case-study-standalone.tsx`

## Required Dependencies

Install the following packages:

```bash
npm install framer-motion next react react-dom
npm install @tsparticles/react @tsparticles/slim @tsparticles/engine
npm install lucide-react
npm install tailwindcss
```

## Required Utility Function

Create `lib/utils.ts` (or update your existing one) with:

```typescript
export function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
```

## File Structure

### For Next.js App Router:
- Place the file at: `app/case-studies/unduit/page.tsx`

### For Next.js Pages Router:
- Place the file at: `pages/case-studies/unduit.tsx`
- Update imports: Change `next/image` to `next/image` (same)
- Update Link imports: Change `next/link` to `next/link` (same)

### For Other React Projects:
- Extract the component and adapt routing
- Replace Next.js `Image` with regular `img` tags if needed
- Replace Next.js `Link` with your routing solution

## Customization

### Update Import Paths:
1. Change `@/components/ui/...` to your component paths
2. Change `@/lib/utils` to your utils path
3. Update `Link href="/dark-portfolio"` to your portfolio route

### Update Assets:
1. Add video file: `/public/Animated_Spotlight_on_Laptop.mp4`
2. Or update video `src` path in the hero section (line ~XXX)

### Update Content:
- Modify text content, images, and links as needed
- Update navigation links to match your project structure

## Components Included

The standalone file includes:
- ✅ `UnduitCaseStudy` - Main page component
- ✅ `ContainerScroll` - Hero scroll animation component
- ✅ `Compare` - Before/After comparison slider
- ✅ `SparklesCore` - Particle effects component
- ✅ All helper components (Header, Card)

## Tailwind CSS Configuration

Ensure your `tailwind.config.js` includes:
- Dark mode support
- All Tailwind utilities used in the component

## Notes

- The component uses Next.js `Image` component - adapt if using different framework
- The component uses Next.js `Link` component - adapt for your routing
- All animations use Framer Motion
- Particle effects require @tsparticles packages



