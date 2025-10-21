# Deployment Guide for Vercel

## Prerequisites
- Vercel account
- Backend deployed at: `https://ie104-be.onrender.com`

## Step 1: Install Vercel CLI (Optional)
```bash
npm install -g vercel
```

## Step 2: Configure Environment Variables on Vercel

Go to your Vercel project dashboard and add these environment variables:

### Required Variables:
```env
NEXT_PUBLIC_API_HOST=https://ie104-be.onrender.com
GOOGLE_SECRET=your_actual_google_secret
GOOGLE_CLIENT_ID=your_actual_google_client_id
FACEBOOK_SECRET=your_actual_facebook_secret
FACEBOOK_CLIENT_ID=your_actual_facebook_client_id
NEXT_AUTH_SECRET=your_actual_nextauth_secret
FIREBASE_KEY_PAIR=your_actual_firebase_key_pair
```

### How to add Environment Variables on Vercel:
1. Go to your project on Vercel Dashboard
2. Click on "Settings" tab
3. Click on "Environment Variables" in the left sidebar
4. Add each variable with its value
5. Select environments: Production, Preview, Development

## Step 3: Update Backend CORS Settings

Make sure your backend (`https://ie104-be.onrender.com`) allows requests from your Vercel domain:

```javascript
// In your backend CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'https://your-app.vercel.app',
  'https://your-custom-domain.com'
];
```

## Step 4: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js
5. Add environment variables (Step 2)
6. Click "Deploy"

### Option B: Deploy via CLI
```bash
# Login to Vercel
vercel login

# Deploy
vercel --prod
```

## Step 5: Update OAuth Redirect URIs

### Google OAuth:
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Edit your OAuth 2.0 Client ID
3. Add Authorized redirect URIs:
   - `https://your-app.vercel.app/api/auth/callback/google`

### Facebook OAuth:
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Edit your App Settings
3. Add Valid OAuth Redirect URIs:
   - `https://your-app.vercel.app/api/auth/callback/facebook`

## Step 6: Test Your Deployment

1. Visit your Vercel URL: `https://your-app.vercel.app`
2. Test API connections
3. Test authentication flows
4. Test all features

## Troubleshooting

### Issue: API calls failing
- Check `NEXT_PUBLIC_API_HOST` is set correctly on Vercel
- Verify backend CORS settings allow your Vercel domain

### Issue: Authentication not working
- Verify OAuth redirect URIs are updated
- Check all auth-related environment variables are set on Vercel

### Issue: Build failing
- Check build logs on Vercel
- Ensure `npm install --legacy-peer-deps` is used (configured in vercel.json)

## Custom Domain (Optional)

1. Go to Vercel Project Settings > Domains
2. Add your custom domain
3. Update DNS records as instructed by Vercel
4. Update OAuth redirect URIs with new domain

## Monitoring

- Check Vercel Analytics for performance metrics
- Monitor error logs in Vercel Dashboard
- Set up alerts for deployment failures

## Important Notes

- Never commit `.env` file to Git
- Always use environment variables on Vercel Dashboard
- Keep your secrets secure
- Rotate secrets regularly
