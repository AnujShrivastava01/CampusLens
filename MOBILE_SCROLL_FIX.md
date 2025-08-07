# Mobile Pull-to-Refresh Fix

This document explains the changes made to fix the mobile pull-to-refresh functionality that was being blocked by the Lenis smooth scroll library.

## Problem
The Lenis smooth scroll library was preventing the native pull-to-refresh behavior on mobile devices by overriding the default scroll behavior and overscroll settings.

## Solutions Implemented

### 1. Updated Lenis Configuration (`frontend/src/hooks/useSmoothScroll.ts`)
- Added mobile detection to differentiate between desktop and mobile behavior
- Enabled `overscroll` option for mobile devices
- Added mobile-specific touch multiplier for better touch responsiveness  
- Implemented a custom `prevent` function that doesn't interfere with pull-to-refresh when at the top of the page
- Reduced scroll duration on mobile for better performance (0.8s vs 1.2s on desktop)

### 2. Updated CSS for Mobile Support (`frontend/src/index.css`)
- Added mobile-specific overscroll behavior settings
- Enabled `-webkit-overflow-scrolling: touch` for iOS momentum scrolling
- Set `overscroll-behavior-y: auto` on mobile to allow pull-to-refresh
- Kept `overscroll-behavior: none` on desktop to preserve smooth scroll behavior
- Added mobile scroll container classes for better touch handling

### 3. App-Level Mobile Detection (`frontend/src/App.tsx`)
- Added mobile detection on app mount
- Automatically applies mobile-friendly classes to document body
- Ensures proper cleanup on unmount

### 4. Layout Updates (`frontend/src/components/Layout/Layout.tsx`)
- Added `mobile-scroll-container` and `allow-overscroll` classes to main layout
- Ensures consistent mobile scroll behavior across all pages

### 5. Custom Pull-to-Refresh Hook (`frontend/src/hooks/usePullToRefresh.ts`)
- Created a reusable hook for implementing custom pull-to-refresh functionality
- Provides visual feedback during pull gesture
- Configurable threshold and refresh callback
- Optional fallback for when native pull-to-refresh isn't sufficient

## Key Technical Details

### Mobile Detection
```typescript
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
```

### Overscroll Behavior
- **Mobile**: `overscroll-behavior-y: auto` (allows pull-to-refresh)
- **Desktop**: `overscroll-behavior: none` (preserves smooth scroll)

### Touch Optimization
- Enhanced touch multiplier on mobile devices
- iOS momentum scrolling enabled
- Hardware acceleration via `translate3d(0, 0, 0)`

## Browser Support
- ✅ iOS Safari (pull-to-refresh enabled)
- ✅ Chrome Mobile (pull-to-refresh enabled)  
- ✅ Firefox Mobile (pull-to-refresh enabled)
- ✅ Desktop browsers (smooth scroll preserved)

## Testing
To test the fix:
1. Open the app on a mobile device
2. Navigate to any page
3. Pull down from the top of the page
4. The browser's native pull-to-refresh should trigger
5. Verify smooth scrolling still works when scrolling within the page

## Usage of Custom Hook (Optional)
```typescript
import { usePullToRefresh } from '@/hooks/usePullToRefresh';

// In your component
const { handleRefresh } = usePullToRefresh({
  onRefresh: async () => {
    // Your refresh logic here
    await refetchData();
  },
  threshold: 80, // Minimum pull distance
  enabled: true  // Enable/disable the functionality
});
```

## Notes
- The fix maintains backward compatibility with desktop smooth scrolling
- Mobile devices get optimized scroll behavior without losing functionality
- No breaking changes to existing components or APIs
- Progressive enhancement approach - works even if JavaScript fails
