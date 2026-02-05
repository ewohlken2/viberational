---
slug: typescript-utility-types
title: "Useful TypeScript Utility Types You Should Know"
date: 2025-12-28
---

TypeScript comes with several built-in utility types that can make your code more expressive and type-safe.

**Partial<T>**

Makes all properties optional:

```typescript
interface User {
  name: string;
  email: string;
  age: number;
}

function updateUser(id: string, updates: Partial<User>) {
  // updates can have any subset of User properties
}

updateUser("123", { name: "John" }); // Valid!
```

**Pick<T, K>**

Creates a type with only selected properties:

```typescript
type UserPreview = Pick<User, "name" | "email">;
// { name: string; email: string; }
```

**Omit<T, K>**

Creates a type without specified properties:

```typescript
type UserWithoutAge = Omit<User, "age">;
// { name: string; email: string; }
```

**Record<K, V>**

Creates an object type with specified key and value types:

```typescript
type UserRoles = Record<string, "admin" | "user" | "guest">;

const roles: UserRoles = {
  john: "admin",
  jane: "user",
};
```

These utility types help you avoid repetition and keep your types DRY.
