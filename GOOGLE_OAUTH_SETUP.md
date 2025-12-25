# 🔐 Google OAuth Setup Guide

## ✅ What's Been Implemented

I've set up the complete Google OAuth infrastructure for your TrimTrack app using NextAuth.js. Here's what's ready:

### ✅ Code Implementation:
- ✅ NextAuth.js installed and configured
- ✅ Google OAuth provider integrated
- ✅ Automatic employee account creation on first Google sign-in
- ✅ Session management with JWT
- ✅ Database integration for user storage
- ✅ Redirect flows configured

---

## 🚀 **Step-by-Step Setup Instructions**

### **Step 1: Create Google Cloud Project**

1. **Go to Google Cloud Console:**
   - Visit: https://console.cloud.google.com/

2. **Create a New Project:**
   - Click "Select a project" → "New Project"
   - Project name: `TrimTrack`
   - Click "Create"

3. **Wait for project creation** (takes a few seconds)

---

### **Step 2: Enable Google OAuth**

1. **Navigate to APIs & Services:**
   - In the left sidebar, click "APIs & Services" → "Credentials"

2. **Configure OAuth Consent Screen:**
   - Click "OAuth consent screen" tab
   - Select "External" (for public access)
   - Click "Create"

3. **Fill in App Information:**
   - **App name:** `TrimTrack`
   - **User support email:** Your email
   - **Developer contact email:** Your email
   - Click "Save and Continue"

4. **Scopes (Step 2):**
   - Click "Add or Remove Scopes"
   - Select:
     - `.../auth/userinfo.email`
     - `.../auth/userinfo.profile`
   - Click "Update" → "Save and Continue"

5. **Test users (Step 3):**
   - Click "Save and Continue" (skip for now)

6. **Summary (Step 4):**
   - Click "Back to Dashboard"

---

### **Step 3: Create OAuth 2.0 Credentials**

1. **Go to Credentials Tab:**
   - Click "Credentials" in the left sidebar
   - Click "+ Create Credentials" → "OAuth 2.0 Client ID"

2. **Configure OAuth Client:**
   - **Application type:** Web application
   - **Name:** `TrimTrack Web App`

3. **Authorized JavaScript origins:**
   ```
   https://trim-tracktrimtrack-app-v2.vercel.app
   ```

4. **Authorized redirect URIs:**
   ```
   https://trim-tracktrimtrack-app-v2.vercel.app/api/auth/callback/google
   ```

5. **Click "Create"**

6. **Copy Your Credentials:**
   - You'll see a popup with:
     - **Client ID** (looks like: `123456789-abc...apps.googleusercontent.com`)
     - **Client Secret** (looks like: `GOCSPX-...`)
   - **IMPORTANT:** Copy both and save them securely!

---

### **Step 4: Add Environment Variables to Vercel**

1. **Go to Vercel Dashboard:**
   - Visit: https://vercel.com/maruthi-ls-projects/trim-tracktrimtrack-app-v2/settings/environment-variables

2. **Add the following environment variables:**

   **Variable 1:**
   - **Name:** `GOOGLE_CLIENT_ID`
   - **Value:** (paste your Client ID from Step 3)
   - **Environment:** Production, Preview, Development
   - Click "Save"

   **Variable 2:**
   - **Name:** `GOOGLE_CLIENT_SECRET`
   - **Value:** (paste your Client Secret from Step 3)
   - **Environment:** Production, Preview, Development
   - Click "Save"

   **Variable 3:**
   - **Name:** `NEXTAUTH_SECRET`
   - **Value:** Generate a random secret (see below)
   - **Environment:** Production, Preview, Development
   - Click "Save"

   **Variable 4:**
   - **Name:** `NEXTAUTH_URL`
   - **Value:** `https://trim-tracktrimtrack-app-v2.vercel.app`
   - **Environment:** Production, Preview, Development
   - Click "Save"

---

### **Step 5: Generate NEXTAUTH_SECRET**

**Option A: Using OpenSSL (if you have it):**
```bash
openssl rand -base64 32
```

**Option B: Using Node.js:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Option C: Online Generator:**
- Visit: https://generate-secret.vercel.app/32
- Copy the generated secret

---

### **Step 6: Redeploy Your App**

After adding the environment variables to Vercel:

1. **Trigger a new deployment:**
   - Go to: https://vercel.com/maruthi-ls-projects/trim-tracktrimtrack-app-v2/deployments
   - Click "Redeploy" on the latest deployment
   - Or push a new commit to GitHub

2. **Wait for deployment to complete** (usually 1-2 minutes)

---

## ✅ **Testing Google Sign-In**

Once deployed with the environment variables:

1. **Visit:** https://trim-tracktrimtrack-app-v2.vercel.app/login

2. **Click "Continue with Google"**

3. **Select your Google account**

4. **Grant permissions**

5. **You'll be redirected to the dashboard!**

---

## 🎯 **How It Works**

### **For New Users:**
1. Employee clicks "Continue with Google"
2. Google authentication popup appears
3. Employee signs in with Google
4. **Account automatically created** in your database:
   - Name: From Google profile
   - Email: From Google account
   - Role: EMPLOYEE (automatic)
   - Share: 40% (default)
   - Status: Active
5. Employee is logged in and redirected to dashboard

### **For Existing Users:**
1. Employee clicks "Continue with Google"
2. Google authentication popup appears
3. System recognizes existing email
4. Employee is logged in immediately

---

## 🔒 **Security Features**

✅ **Secure OAuth 2.0 flow**  
✅ **JWT session tokens**  
✅ **No password storage for OAuth users**  
✅ **Automatic account creation**  
✅ **Email verification by Google**  
✅ **HTTPS only**  

---

## 📋 **Quick Checklist**

- [ ] Created Google Cloud project
- [ ] Configured OAuth consent screen
- [ ] Created OAuth 2.0 credentials
- [ ] Copied Client ID and Client Secret
- [ ] Added GOOGLE_CLIENT_ID to Vercel
- [ ] Added GOOGLE_CLIENT_SECRET to Vercel
- [ ] Generated and added NEXTAUTH_SECRET to Vercel
- [ ] Added NEXTAUTH_URL to Vercel
- [ ] Redeployed the app
- [ ] Tested Google sign-in

---

## 🎊 **You're Done!**

Once you complete these steps, employees can sign in with Google instantly!

**No more manual account creation needed!**

---

## 🆘 **Troubleshooting**

### **Error: "redirect_uri_mismatch"**
- Make sure the redirect URI in Google Cloud Console is exactly:
  ```
  https://trim-tracktrimtrack-app-v2.vercel.app/api/auth/callback/google
  ```

### **Error: "Access blocked"**
- Make sure OAuth consent screen is configured
- Add your email as a test user if app is in "Testing" mode

### **Error: "Configuration error"**
- Verify all environment variables are set in Vercel
- Redeploy after adding environment variables

---

## 📞 **Need Help?**

If you encounter any issues:
1. Check the Vercel deployment logs
2. Verify all environment variables are set
3. Ensure redirect URIs match exactly
4. Make sure the app has been redeployed after adding env vars

---

**Happy OAuth-ing! 🚀**
