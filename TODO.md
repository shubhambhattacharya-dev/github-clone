# TODO: Fix GitHub Clone Errors and Warnings

## Backend Fixes
- [x] Update server.js: Add env validation, MongoDB connection with error handling, global error middleware
- [x] Update saved.controller.js: Add atomic operations and pagination support
- [x] Update passport/github.auth.js: Use env vars for callback URL
- [ ] Update user.controller.js: Improve error handling and checks
- [ ] Update explore.controller.js: Fix env var name (GITHUB_API_KEY -> GITHUB_ACCESS_TOKEN)
- [ ] Update analytics.controller.js: Ensure env var usage
- [ ] Update routes/auth.route.js: Use correct env var
- [ ] Update middleware/ensureAuthenticated.js: Use correct env var
- [ ] Update db/connectMongoDB.js: Add error handling if needed

## Frontend Fixes
- [ ] Create ErrorBoundary component
- [x] Update App.jsx: Add ErrorBoundary, React Router future flags, conditional Sidebar
- [x] Update lib/function.js: Add pagination params, better error handling with toast
- [x] Update HomePage.jsx: Prevent redundant state updates
- [x] Update AnalyticsDashboard.jsx: Remove token auth, use session
- [x] Update SavedPage.jsx: Handle pagination response
- [x] Update Sidebar.jsx: Add analytics icon
- [x] Update ProfileInfo.jsx: Add lazy loading to images

## Testing
- [ ] Test backend endpoints: users, likes, saved, auth, analytics
- [ ] Test frontend pages: Home, Saved, Likes, Analytics
- [ ] Verify hot-toast shows errors
- [ ] Check sidebar icons and workflow
