# Complete Role-Based Access Control Testing Guide

## Overview
This guide provides step-by-step testing instructions for each user role to verify the complete security implementation.

## Test Credentials

### Admin Role
- Email: `admin@lush.com`
- Password: `admin123`
- Expected Redirect: `/dashboard`

### Builder Role
- Email: `builder@lush.com`
- Password: `builder123`
- Expected Redirect: `/builder`

### Client Role
- Email: `client@lush.com`
- Password: `client123`
- Expected Redirect: `/client`

### Accountant Role
- Email: `accountant@lush.com`
- Password: `accountant123`
- Expected Redirect: `/finance`

### Investor Role
- Email: `investor@lush.com`
- Password: `investor123`
- Expected Redirect: `/investor`

## Testing Flow for Each Role

### 1. Admin User Journey

#### Login Test
1. Navigate to `/login`
2. Enter admin credentials
3. ✅ Should redirect to `/dashboard`
4. ✅ Should see welcome message for admin

#### Navigation Test
1. ✅ Should see all navigation items:
   - Admin Dashboard
   - Builder Portal
   - Client Portal
   - Finance Portal
   - Investor Portal
   - Team Manager
   - Security

#### Route Access Test
1. ✅ Can access: `/dashboard`, `/builder`, `/client`, `/finance`, `/investor`, `/security`, `/users`
2. ✅ Can access admin-only routes: `/ai-workflows`, `/contracts`, `/profits`, `/role-dashboard`
3. ✅ Should have full system access

### 2. Builder User Journey

#### Login Test
1. Navigate to `/login`
2. Enter builder credentials
3. ✅ Should redirect to `/builder`
4. ✅ Should see welcome message for builder

#### Navigation Test
1. ✅ Should see limited navigation:
   - My Dashboard (/builder)
   - Upload Progress (/uploads)
   - Project Timeline (/timeline)

#### Route Access Test
1. ✅ Can access: `/builder`, `/uploads`, `/timeline`
2. ❌ Cannot access: `/dashboard`, `/finance`, `/investor`, `/security`
3. ❌ Should show "Access Restricted" page for unauthorized routes

### 3. Client User Journey

#### Login Test
1. Navigate to `/login`
2. Enter client credentials
3. ✅ Should redirect to `/client`
4. ✅ Should see welcome message for client

#### Navigation Test
1. ✅ Should see client-specific navigation:
   - My Project (/client)
   - Project Progress (/uploads)
   - My Documents (/documents)

#### Route Access Test
1. ✅ Can access: `/client`, `/uploads`, `/documents`
2. ❌ Cannot access: `/dashboard`, `/builder`, `/finance`, `/investor`, `/security`
3. ❌ Should show "Access Restricted" page for unauthorized routes

### 4. Accountant User Journey

#### Login Test
1. Navigate to `/login`
2. Enter accountant credentials
3. ✅ Should redirect to `/finance`
4. ✅ Should see welcome message for accountant

#### Navigation Test
1. ✅ Should see finance-focused navigation:
   - Finance Dashboard (/finance)
   - Receipt Management (/receipts)
   - Payment Claims (/claims)

#### Route Access Test
1. ✅ Can access: `/finance`, `/receipts`, `/claims`, `/xero`
2. ❌ Cannot access: `/dashboard`, `/builder`, `/client`, `/investor`, `/security`
3. ❌ Should show "Access Restricted" page for unauthorized routes

### 5. Investor User Journey

#### Login Test
1. Navigate to `/login`
2. Enter investor credentials
3. ✅ Should redirect to `/investor`
4. ✅ Should see welcome message for investor

#### Navigation Test
1. ✅ Should see investment-focused navigation:
   - My Investments (/investor)
   - Investment Docs (/documents)

#### Route Access Test
1. ✅ Can access: `/investor`, `/documents`, `/heatmap`
2. ❌ Cannot access: `/dashboard`, `/builder`, `/client`, `/finance`, `/security`
3. ❌ Should show "Access Restricted" page for unauthorized routes

## Security Features to Verify

### Route Protection
- [ ] All protected routes check user authentication
- [ ] Unauthorized users redirected to login
- [ ] Users with wrong roles see "Access Restricted" page
- [ ] Route guards properly implemented throughout

### Navigation Security
- [ ] Each role sees only authorized menu items
- [ ] No menu items for restricted routes visible
- [ ] Navigation adapts immediately after role change
- [ ] Clean, uncluttered menus for each role

### Login Flow Security
- [ ] Role-based redirects after successful login
- [ ] Proper error handling for invalid credentials
- [ ] User data stored securely in localStorage
- [ ] Session management working correctly

### Unauthorized Access Handling
- [ ] Professional "Access Restricted" page shown
- [ ] Clear messaging about required permissions
- [ ] Options to return to authorized areas
- [ ] No error stack traces or technical details exposed

## Manual Testing Checklist

### Pre-Test Setup
- [ ] Clear localStorage
- [ ] Navigate to `/login`
- [ ] Verify application is running

### For Each Role:
1. **Login Process**
   - [ ] Enter correct credentials
   - [ ] Verify redirect to correct dashboard
   - [ ] Check welcome message shows correct role

2. **Navigation Audit**
   - [ ] Count visible menu items
   - [ ] Verify no unauthorized options shown
   - [ ] Test menu item clicks

3. **Authorized Route Access**
   - [ ] Test each expected route
   - [ ] Verify content loads properly
   - [ ] Check role-specific functionality

4. **Unauthorized Route Blocking**
   - [ ] Manually navigate to restricted routes
   - [ ] Verify "Access Restricted" page shows
   - [ ] Test redirect functionality

5. **Cross-Role Testing**
   - [ ] Switch between roles
   - [ ] Verify navigation updates
   - [ ] Test route access changes

### Post-Test Verification
- [ ] No console errors during testing
- [ ] All redirects working properly
- [ ] Security messages appropriate
- [ ] User experience smooth and professional

## Expected Test Results

| Role | Login Redirect | Menu Items | Can Access | Cannot Access |
|------|---------------|------------|------------|---------------|
| Admin | /dashboard | 7 items | All routes | None |
| Builder | /builder | 3 items | builder, uploads, timeline | dashboard, finance, investor |
| Client | /client | 3 items | client, uploads, documents | dashboard, builder, finance |
| Accountant | /finance | 3 items | finance, receipts, claims | dashboard, builder, investor |
| Investor | /investor | 2 items | investor, documents | dashboard, builder, finance |

## Automated Testing

Access the automated role flow tester at `/role-flow-tester` (admin only) to run comprehensive tests for all roles automatically.

## Troubleshooting

### Common Issues
1. **Login Redirect Not Working**: Check user role in localStorage
2. **Menu Items Wrong**: Verify RoleBasedNavigation component
3. **Route Access Issues**: Check RouteGuard implementation
4. **Navigation Not Updating**: Clear localStorage and re-login

### Debug Steps
1. Open browser console
2. Check localStorage for user data
3. Verify no JavaScript errors
4. Test in incognito mode
5. Clear cache and retry