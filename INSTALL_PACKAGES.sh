#!/bin/bash

# Multi-Tenant SaaS Platform - Package Installation Script
# Run this script to install all required dependencies

echo "================================================"
echo "Installing Backend Dependencies..."
echo "================================================"

cd backend || exit

# Install main dependencies
echo "📦 Installing backend packages..."
npm install

# Install Razorpay SDK
echo "💳 Installing Razorpay SDK..."
npm install razorpay

# Install type definitions
echo "📝 Installing TypeScript definitions..."
npm install --save-dev @types/razorpay

echo "✅ Backend dependencies installed!"
echo ""

cd ..

echo "================================================"
echo "Installing Frontend Dependencies..."
echo "================================================"

cd frontend || exit

# Install all frontend dependencies
echo "📦 Installing frontend packages..."
npm install

echo "✅ Frontend dependencies installed!"
echo ""

cd ..

echo "================================================"
echo "✅ All Dependencies Installed Successfully!"
echo "================================================"
echo ""
echo "Next steps:"
echo "1. Configure backend/.env (copy from .env.example)"
echo "2. Configure frontend/.env.local (copy from .env.example)"
echo "3. Start MongoDB: mongod"
echo "4. Start backend: cd backend && npm run dev"
echo "5. Start frontend: cd frontend && npm run dev"
echo ""
echo "📚 See INSTALLATION_GUIDE.md for detailed setup instructions"
echo ""
