#!/bin/bash
# SciFi ISP — Vercel Build Script
# Injects environment variables as window.__ENV__ before </head>
set -e
mkdir -p dist

cp scifi-isp-system.html dist/index.html

# Build the env injection script tag
VARS="<script>window.__ENV__={"
VARS+="SUPABASE_URL:'${SUPABASE_URL:-}',"
VARS+="SUPABASE_ANON_KEY:'${SUPABASE_ANON_KEY:-}',"
VARS+="META_TOKEN:'${META_TOKEN:-}',"
VARS+="META_PHONE_ID:'${META_PHONE_ID:-}',"
VARS+="WA_NUMBER:'${WA_NUMBER:-254111923477}',"
VARS+="SUPPORT_CONTACT:'${SUPPORT_CONTACT:-+254 111 923 477}'"
VARS+="};</script>"

# Inject before </head>
sed -i "s|</head>|${VARS}</head>|" dist/index.html

echo "✅ Build complete → dist/index.html"
