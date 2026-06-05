#!/bin/bash

# BuildCore Elite - Docker Health Check Script

set -e

echo "🔍 Checking BuildCore Elite Health..."
echo ""

# Check Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found"
    exit 1
fi
echo "✅ Docker is running"

# Check services
echo ""
echo "📋 Service Status:"
docker-compose ps

# Check application health
echo ""
echo "🌐 Application Health:"
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Application is responding"
else
    echo "⚠️  Application not responding - checking logs..."
    docker-compose logs app | tail -20
fi

# Check database
echo ""
echo "🗄️  Database Health:"
if docker-compose exec -T postgres pg_isready -U postgres > /dev/null 2>&1; then
    echo "✅ Database is healthy"
else
    echo "❌ Database connection failed"
fi

echo ""
echo "✅ Health check complete!"
