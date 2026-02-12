# Environment Variables Configuration

This file lists all required environment variables for the ChauffeurTop application.

## Required Environment Variables

### Supabase Configuration
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Email Service (Resend)
```env
# For Edge Functions - set via Supabase CLI
RESEND_API_KEY=re_xxxxxxxxxxxxx
```

### Application Configuration
```env
# Your website URL (used in confirmation emails)
SITE_URL=https://yourdomain.com
# For local development: http://localhost:3000
```

## Setting Up Environment Variables

### 1. Local Development (.env.local)

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
SITE_URL=http://localhost:3000
```

### 2. Supabase Edge Functions

Set secrets for Edge Functions:

```bash
supabase secrets set RESEND_API_KEY=your_resend_api_key
supabase secrets set SITE_URL=https://yourdomain.com
```

### 3. Production Deployment

Add environment variables to your hosting platform (Vercel, Netlify, etc.):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SITE_URL`

## Getting API Keys

### Supabase Keys
1. Go to your Supabase project dashboard
2. Navigate to Settings → API
3. Copy the Project URL and API keys

### Resend API Key
1. Sign up at https://resend.com
2. Go to API Keys section
3. Create a new API key
4. Copy the key (starts with `re_`)

## Security Notes

⚠️ **IMPORTANT**:
- Never commit `.env.local` to version control
- Keep `SUPABASE_SERVICE_ROLE_KEY` secret (server-side only)
- Use `NEXT_PUBLIC_*` prefix only for client-safe variables
- Rotate API keys regularly
- Use different keys for development and production
