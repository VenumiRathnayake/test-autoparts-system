# Navigation System Documentation

## Overview
This application now has two separate navigation components that are conditionally rendered based on user role:

1. **Header** - For regular users and vendors
2. **AdminNavbar** - For admin users

## How It Works

### Automatic Role Detection
The app automatically detects the user's role from localStorage and renders the appropriate navigation:
- If `role === 'admin'` → AdminNavbar is shown
- Otherwise → Regular Header is shown

### Admin Login
To access the admin navigation:
- Email: `admin@admin.com`
- Password: `admin`

### Navigation Components

#### Regular Header (Header.js)
- Home, Parts, Educational, Contact Us
- Search functionality
- Shopping cart
- User authentication (login/logout)

#### Admin Navigation (AdminNavbar.js)
- Home
- **Parts Management**
  - Add Parts
  - Manage Parts
- **Articles Management**
  - Add Articles
  - Manage Articles
- **Categories Management**
  - Add Categories
- Search functionality
- Shopping cart
- User authentication (login/logout)

## Features

### Desktop Navigation
- Responsive design with dropdown menus
- Hover effects and smooth transitions
- Icon-based navigation for better UX

### Mobile Navigation
- Mobile-first responsive design
- Collapsible menu with hamburger button
- Organized sections for admin functions
- Touch-friendly interface

### Styling
- Consistent with existing design system
- Admin-specific color scheme (red gradient)
- Smooth animations and hover effects
- Professional appearance

## Technical Implementation

### Conditional Rendering
```javascript
const NavigationComponent = userRole === 'admin' ? AdminNavbar : Header;
```

### Role Detection
- Uses `authHelper.getRole()` from localStorage
- Automatically updates when login/logout occurs
- Listens for storage changes

### CSS Classes
- `.admin-nav` - Admin-specific styling
- `.nav-dropdown` - Dropdown menu functionality
- `.mobile-section` - Mobile admin navigation sections

## Usage

1. **Regular Users**: Navigate normally with the standard header
2. **Admin Users**: Login with admin credentials to access admin navigation
3. **Vendors**: Use regular header (vendor-specific routes available)

## File Structure
```
frontend/src/components/header/
├── Header.js          # Regular user navigation
├── AdminNavbar.js     # Admin navigation
└── VendorNavbar.js    # Vendor navigation (if needed)
```

## Dependencies
- `react-icons` - For navigation icons
- `react-router-dom` - For routing
- `authHelper` - For authentication and role management
