#!/bin/bash

# CRM Application Setup Verification Script
# This script verifies all configurations are correctly set up

echo "================================"
echo "CRM Setup Verification"
echo "================================"
echo ""

echo "✓ Checking Node.js version..."
node --version
echo ""

echo "✓ Checking npm version..."
npm --version
echo ""

echo "✓ Checking environment files..."
if [ -f ".env" ]; then echo "  .env exists"; else echo "  ✗ .env NOT found"; fi
if [ -f ".env.example" ]; then echo "  .env.example exists"; else echo "  ✗ .env.example NOT found"; fi
if [ -f ".env.test" ]; then echo "  .env.test exists"; else echo "  ✗ .env.test NOT found"; fi
if [ -f ".env.production" ]; then echo "  .env.production exists"; else echo "  ✗ .env.production NOT found"; fi
echo ""

echo "✓ Checking project structure..."
dirs=("config" "routes" "services" "middleware" "models" "utils" "__tests__" "logs" "migrations")
for dir in "${dirs[@]}"; do
  if [ -d "$dir" ]; then echo "  ✓ $dir/"; else echo "  ✗ $dir/ NOT found"; fi
done
echo ""

echo "✓ Checking key files..."
files=("server.js" "package.json" "README.md" ".gitignore" "jest.config.js")
for file in "${files[@]}"; do
  if [ -f "$file" ]; then echo "  ✓ $file"; else echo "  ✗ $file NOT found"; fi
done
echo ""

echo "✓ Checking node_modules..."
if [ -d "node_modules" ]; then 
  echo "  node_modules installed ($(du -sh node_modules | cut -f1))"
else 
  echo "  ✗ node_modules NOT found - run: npm install"
fi
echo ""

echo "================================"
echo "Verification Complete!"
echo "================================"
echo ""
echo "Next steps:"
echo "1. Update .env.production with your production domain"
echo "2. Test database connection: npm run dev"
echo "3. Run tests: npm test"
echo "4. For production: npm start"
