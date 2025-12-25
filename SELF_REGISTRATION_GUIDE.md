# 🎉 Employee Self-Registration Guide

## ✅ What's New

Your TrimTrack app now supports **employee self-registration**! Employees can create their own accounts without needing the owner to add them manually.

---

## 🚀 How Employees Can Sign Up

### Option 1: Email & Password Registration (READY NOW!)

1. **Visit the registration page**:
   ```
   https://trim-tracktrimtrack-app-v2.vercel.app/register
   ```

2. **Fill in the form**:
   - Full Name
   - Email address
   - Password (minimum 6 characters)
   - Confirm Password

3. **Click "Create Account"**

4. **Automatic Login**: After successful registration, employees are automatically logged in!

---

### Option 2: Google Sign-In (Coming Soon)

Google OAuth integration is prepared but requires additional setup:

#### To Enable Google Sign-In:

1. **Create Google Cloud Project**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one

2. **Enable Google OAuth 2.0**:
   - Navigate to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client ID"
   - Application type: "Web application"
   - Authorized redirect URIs: `https://trim-tracktrimtrack-app-v2.vercel.app/api/auth/google/callback`

3. **Add Environment Variables to Vercel**:
   ```
   GOOGLE_CLIENT_ID=your_client_id_here
   GOOGLE_CLIENT_SECRET=your_client_secret_here
   GOOGLE_REDIRECT_URI=https://trim-tracktrimtrack-app-v2.vercel.app/api/auth/google/callback
   ```

4. **Install Dependencies** (if implementing full OAuth):
   ```bash
   npm install googleapis
   ```

---

## 📋 Features

### ✅ Currently Working:
- ✅ Employee self-registration with email/password
- ✅ Automatic validation (email format, password strength)
- ✅ Duplicate email detection
- ✅ Auto-login after registration
- ✅ Default 40% share percentage for new employees
- ✅ "Sign Up" link on login page
- ✅ Google sign-in button (placeholder - redirects to login)

### 🔜 Coming Soon:
- Google OAuth integration (requires API keys)
- Email verification
- Password reset functionality

---

## 🔐 Security Features

1. **Email Validation**: Ensures valid email format
2. **Password Requirements**: Minimum 6 characters
3. **Duplicate Prevention**: Checks if email already exists
4. **Role Assignment**: All self-registered users are employees (not owners)
5. **Default Settings**: New employees get 40% share by default

---

## 👥 User Flow

### For New Employees:

```
1. Visit /register
   ↓
2. Fill registration form
   ↓
3. Submit
   ↓
4. Account created automatically
   ↓
5. Auto-login to dashboard
   ↓
6. Start tracking transactions!
```

### For Existing Employees:

```
1. Visit /login
   ↓
2. Enter email & password
   ↓
3. Sign in
   ↓
4. Access dashboard
```

---

## 📱 Access Links

### Registration Page:
**https://trim-tracktrimtrack-app-v2.vercel.app/register**

### Login Page:
**https://trim-tracktrimtrack-app-v2.vercel.app/login**

### Dashboard:
**https://trim-tracktrimtrack-app-v2.vercel.app/dashboard**

---

## 🎯 Benefits

### For Employees:
- ✅ Create accounts instantly
- ✅ No waiting for admin approval
- ✅ Choose their own secure password
- ✅ Immediate access to track earnings

### For Owners:
- ✅ No manual employee setup needed
- ✅ Employees can onboard themselves
- ✅ Automatic role assignment (employees only)
- ✅ Still have full control via dashboard

---

## 🔧 Technical Details

### New Files Created:
1. `/src/app/register/page.tsx` - Registration page UI
2. `/src/app/api/auth/register/route.ts` - Registration API endpoint
3. `/src/app/api/auth/google/route.ts` - Google OAuth placeholder

### Modified Files:
1. `/src/app/login/page.tsx` - Added "Sign Up" link and Google button
2. `/src/app/login/page.module.css` - Added styles for new elements
3. `/src/lib/db.ts` - Added `createUser` method
4. `/src/app/api/users/route.ts` - Added POST endpoint for user creation

---

## 📝 Example Usage

### Employee Registration:
```
Name: Sarah Johnson
Email: sarah@example.com
Password: secure123
Confirm: secure123

→ Account created!
→ Logged in automatically
→ Redirected to dashboard
```

### Employee Login:
```
Email: sarah@example.com
Password: secure123

→ Logged in
→ Dashboard access
```

---

## 🎊 You're All Set!

Employees can now register themselves at:
**https://trim-tracktrimtrack-app-v2.vercel.app/register**

Share this link with your team and they can start using TrimTrack immediately!

---

## 💡 Tips

1. **Share the registration link** with your employees
2. **Employees choose their own passwords** - secure and private
3. **No admin approval needed** - instant access
4. **All self-registered users are employees** - owners must be created by you
5. **Adjust share percentages** later in the owner dashboard if needed

---

## 🔒 Owner Account (Unchanged)

The owner account remains the same:
- **Email**: `admin@trimtrack.com`
- **Password**: `admin123`
- **PIN**: `2568`

Only the owner can:
- View all employees
- Modify share percentages
- Access full reports
- Manage settings

---

**Enjoy the new self-registration feature! 🚀**
