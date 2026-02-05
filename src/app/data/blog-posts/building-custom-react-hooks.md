---
slug: building-custom-react-hooks
title: "Building Custom React Hooks for Better Code Reuse"
date: 2026-01-05
---

One of the most powerful features in React is the ability to create custom hooks. They let you extract component logic into reusable functions.

Here is a simple example of a custom hook that tracks window size:

```typescript
import { useState, useEffect } from 'react';

function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}
```

You can then use this hook in any component:

```typescript
function MyComponent() {
  const { width, height } = useWindowSize();

  return (
    <div>
      Window size: {width} x {height}
    </div>
  );
}
```

Custom hooks follow the same rules as regular hooks - they must start with "use" and can call other hooks inside them.
