# CAFA Ticket Mobile

Mobile version of CAFA Tickets - an event ticketing platform.

**Web Version Reference**: `D:\KLASIQUE STUFF\D-klasique-projects\cafa-tickets`

## Tech Stack

- **Framework**: Expo SDK 54 with Expo Router v6 (file-based routing)
- **Language**: TypeScript (strict mode)
- **Styling**: NativeWind v4 (Tailwind CSS for React Native)
- **State/Forms**: Formik + Yup for form validation
- **HTTP Client**: Axios
- **UI Components**:
  - @gorhom/bottom-sheet
  - @shopify/flash-list (optimized lists)
  - expo-image
- **Navigation**: Expo Router with React Navigation

## Project Structure

```
app/                    # Expo Router file-based routes
  (auth)/              # Auth group (login, signup)
  (tabs)/              # Tab navigation group
  dashboard/           # Dashboard screens
  _layout.tsx          # Root layout
  index.tsx            # Entry/splash screen
components/            # Reusable components
  ui/                  # UI components (AppButton, Screen, etc.)
  form/                # Form components (AppForm, AppFormField, etc.)
  cards/               # Card components (EventCard, TicketCard, etc.)
  layout/              # Layout components (TabBar)
config/                # App configuration (colors, etc.)
constants/             # Constants and icons
context/               # React contexts (TabBarContext)
hooks/                 # Custom hooks (useModal, useDebounce, etc.)
types/                 # TypeScript type definitions
utils/                 # Utility functions
data/                  # Constants and validation schemas
lib/                   # API services and auth utilities
assets/                # Static assets (images, fonts)
```

## Commands

```bash
npx expo start         # Start Expo dev server - try this 1st 
npm start              # Start Expo dev server
npm run android        # Run on Android
npm run ios            # Run on iOS
npm run web            # Run on web
npm run lint           # Run ESLint
```

## Path Aliases

- `@/*` → project root (e.g., `@/components`, `@/context`)

## Naming Conventions (from web version)

**Files:**
- Components: PascalCase (`LoginForm.tsx`, `AppButton.tsx`)
- Utilities: camelCase (`validationUtils.ts`, `formatDate.ts`)
- Types: PascalCase with `.types.ts` suffix (`events.types.ts`)

**Components:**
- UI components prefixed with `App` (`AppButton`, `AppForm`, `AppErrorMessage`)
- Feature components use descriptive names (`LoginForm`, `EventCard`)
- Hooks prefixed with `use` (`useModal`, `useDebounce`)

**Variables:**
- camelCase for variables and functions
- `is`, `has`, `can` prefix for booleans (`isLoading`, `hasError`)

## Color Scheme

```
Primary: #050E3C (dark blue)
Primary-100: #002455
Primary-200: #134686
Accent: #DC0000 (red)
Accent-50: #FF5555
Accent-100: #FF3838
```

## Form Pattern (Formik + Yup)

```tsx
<AppForm
  initialValues={{ email: "", password: "" }}
  validationSchema={LoginValidationSchema}
  onSubmit={handleSubmit}
>
  <AppFormField name="email" label="Email" />
  <AppFormField name="password" label="Password" secureTextEntry />
  <SubmitButton title="Login" />
</AppForm>
```

## API & Auth Pattern (from PicknRyde mobile)

**Mobile Reference**: `C:\Users\DELL\Desktop\klasique-projects\1MOBILE\PicknRyde-Mobile`

### Storage Strategy
- **Tokens**: `expo-secure-store` (encrypted, platform-native)
- **User data/cache**: `AsyncStorage`

### Axios Client (`lib/client.ts`)
```typescript
const client = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// Request interceptor - auto-attach token
client.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

### Auth Context (`context/AuthContext.tsx`)
```typescript
interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => Promise<void>;
}

// Usage: const { user, login, logout } = useAuth();
```

### Protected Routes (`components/RequireAuth.tsx`)
```tsx
const RequireAuth = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <LoginPromptScreen />;
  return children;
};
```

### Provider Nesting (in `_layout.tsx`)
```
AuthProvider (outermost)
  → UserProvider
    → NotificationProvider
      → ...other providers (innermost)
```

### API Service Functions (`lib/auth.ts`, `lib/events.ts`, etc.)
```typescript
export const login = (credentials: LoginCredentials) =>
  client.post('/auth/login', credentials);

export const getEvents = (filters?: EventFilters) =>
  client.get('/events', { params: filters });
```

## Conventions

- Use NativeWind/Tailwind classes for styling via `className` prop
- Use `expo-router` for navigation (`Link`, `router.push()`, etc.)
- Wrap screens with `Screen` or `AltScreen` components from `@/components`
- Forms use Formik with Yup validation schemas
- Use `expo-image` for optimized image rendering
- Use `FlashList` instead of `FlatList` for better performance
- Match web version patterns for consistency across platforms
