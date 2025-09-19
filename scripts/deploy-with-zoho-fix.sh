#!/bin/bash
# Auto-generated deployment script
echo "🚀 Deploying with updated Zoho configuration..."

# Build and deploy
npm run build
vercel --prod

echo "✅ Deployment complete!"
echo "🔍 Test the deployment:"
echo "curl -H 'Authorization: Bearer YOUR_ADMIN_PASSWORD' 'https://ideinstein.com/api/debug/zoho-tokens?service=crm'"
