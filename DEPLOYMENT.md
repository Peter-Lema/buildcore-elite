# BuildCore Elite - Deployment Guide

Complete deployment instructions for multiple hosting platforms.

## 📋 Table of Contents

1. [Vercel (Recommended - Easiest)](#vercel-deployment)
2. [Docker Self-Hosted (VPS)](#docker-self-hosted)
3. [DigitalOcean](#digitalocean)
4. [AWS](#aws)
5. [Railway](#railway)
6. [Post-Deployment](#post-deployment)

---

## 🚀 Vercel Deployment

**Best for:** Fast, zero-config deployment with automatic scaling

### Prerequisites
- GitHub account (already connected)
- Vercel account (free)

### Steps

1. **Visit Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "Add New..." → "Project"

2. **Import Repository**
   - Select `buildcore-elite`
   - Click "Import"

3. **Configure**
   - **Framework:** Next.js (auto-detected)
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
   - **Install Command:** `npm install`

4. **Environment Variables**
   - Add from `.env.example`:
   ```
   NEXT_PUBLIC_JWT_SECRET=your-secret-key
   NEXT_PUBLIC_API_URL=https://your-domain.vercel.app/api
   DATABASE_URL=your-postgresql-url
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   EMAIL_FROM=noreply@buildcoreelite.com
   ADMIN_EMAIL=admin@buildcoreelite.com
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Get automatic HTTPS URL

### Database Setup (Vercel + PostgreSQL)

**Option A: Vercel Postgres** (Recommended)
```bash
vercel env pull
# Database URL automatically added
vercel deploy
```

**Option B: External PostgreSQL** (AWS RDS, Supabase, Railway)
- Add `DATABASE_URL` to Vercel environment variables
- Run migrations: `vercel env pull && npm run db:migrate`

### Custom Domain
1. Go to Vercel Project Settings
2. Domains → Add custom domain
3. Follow DNS configuration
4. SSL certificate auto-provisioned

**🎉 Done!** Your site is live at `https://your-domain.vercel.app`

---

## 🐳 Docker Self-Hosted (VPS)

**Best for:** Full control, custom configuration, best value

### Prerequisites
- VPS with Docker & Docker Compose installed
- Domain name with DNS access
- SSH access to server

### Installation

1. **Connect to VPS**
```bash
ssh root@your-vps-ip
```

2. **Install Docker** (if not installed)
```bash
# Ubuntu/Debian
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

3. **Clone Repository**
```bash
git clone https://github.com/Peter-Lema/buildcore-elite.git
cd buildcore-elite
```

4. **Setup Environment**
```bash
cp .env.docker .env
nano .env
# Update with your values:
# - Database password
# - JWT secret
# - Email credentials
# - Domain name
```

5. **Setup SSL Certificates**

**Self-Signed (Testing)**
```bash
mkdir -p ssl
openssl req -x509 -newkey rsa:4096 -keyout ssl/key.pem -out ssl/cert.pem -days 365 -nodes
```

**Let's Encrypt (Production)**
```bash
sudo apt-get install certbot
certbot certonly --standalone -d buildcoreelite.com
sudo cp /etc/letsencrypt/live/buildcoreelite.com/fullchain.pem ssl/cert.pem
sudo cp /etc/letsencrypt/live/buildcoreelite.com/privkey.pem ssl/key.pem
sudo chown $USER:$USER ssl/*
```

6. **Deploy**
```bash
chmod +x scripts/*.sh
./scripts/docker-setup.sh
```

Or manually:
```bash
docker-compose up -d
docker-compose exec app npx prisma migrate deploy
docker-compose exec app npm run db:seed
```

7. **Verify**
```bash
./scripts/health-check.sh
```

### Firewall Configuration
```bash
# Allow HTTP/HTTPS/SSH
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### Point Domain
1. Get server IP: `curl ifconfig.me`
2. Update DNS A record to server IP
3. Wait for propagation (5-30 minutes)
4. Access at `https://buildcoreelite.com`

**🎉 Live!** Your site is now running on your own VPS

---

## ☁️ DigitalOcean

**Best for:** Easy VPS hosting with app templates

### Steps

1. **Create Droplet**
   - Visit [DigitalOcean](https://www.digitalocean.com)
   - Click "Create" → "Droplet"
   - Choose: **Docker on Ubuntu 22.04**
   - Select size: 2GB RAM ($6/month) minimum
   - Add SSH key
   - Click "Create Droplet"

2. **SSH into Droplet**
```bash
ssh root@your-droplet-ip
```

3. **Follow Docker Self-Hosted steps above**

4. **Enable Backup**
   - DigitalOcean Dashboard
   - Droplet → Enable Backups
   - Cost: +20% of droplet price

### App Platform (No Docker needed)
1. GitHub → Authorize DigitalOcean App Platform
2. Select buildcore-elite repo
3. Auto-detects Next.js
4. Configure database
5. Deploy with one click

**Cost:** $12/month (includes database)

---

## 🔥 AWS Deployment

**Best for:** Large scale, auto-scaling, advanced features

### Option 1: Elastic Container Service (ECS)

1. **Create ECR Repository**
```bash
aws ecr create-repository --repository-name buildcore-elite
```

2. **Push Docker Image**
```bash
docker build -t buildcore-elite .
docker tag buildcore-elite:latest YOUR_ACCOUNT.dkr.ecr.YOUR_REGION.amazonaws.com/buildcore-elite:latest
aws ecr get-login-password --region YOUR_REGION | docker login --username AWS --password-stdin YOUR_ACCOUNT.dkr.ecr.YOUR_REGION.amazonaws.com
docker push YOUR_ACCOUNT.dkr.ecr.YOUR_REGION.amazonaws.com/buildcore-elite:latest
```

3. **Create RDS PostgreSQL**
   - RDS → Create Database
   - PostgreSQL 15+
   - Multi-AZ for HA
   - Note connection string

4. **Launch ECS Cluster**
   - Create task definition pointing to ECR image
   - Create service in cluster
   - Configure load balancer
   - Map domain via Route 53

### Option 2: Lightsail (Simpler)
1. Create Lightsail container service
2. Upload `docker-compose.yml`
3. Configure domain
4. Deploy

**Cost:** $40-100/month depending on configuration

---

## 🚆 Railway Deployment

**Best for:** Simple, GitHub-connected deployment

### Steps

1. **Connect GitHub**
   - Visit [railway.app](https://railway.app)
   - Login with GitHub
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose `buildcore-elite`

2. **Configure**
   - Railway auto-detects Next.js
   - Add PostgreSQL service
   - Configure environment variables

3. **Deploy**
   - Click "Deploy"
   - Railway builds and deploys automatically

4. **Custom Domain**
   - Settings → Domain
   - Add your domain
   - Update DNS

**Cost:** $5 + usage (very affordable)

---

## 📧 Post-Deployment Setup

### 1. Email Configuration

**Gmail SMTP**
```
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
```

[Generate App Password](https://support.google.com/accounts/answer/185833)

### 2. Environment Variables

Update based on platform:

```bash
# Production URLs
NEXT_PUBLIC_API_URL=https://buildcoreelite.com/api

# Security
NEXT_PUBLIC_JWT_SECRET=generate-secure-32-char-key
NODE_ENV=production

# Database (PostgreSQL)
DATABASE_URL=postgresql://user:pass@host:5432/buildcore_elite

# Email
EMAIL_FROM=noreply@buildcoreelite.com
ADMIN_EMAIL=admin@buildcoreelite.com
```

### 3. Database Migrations

```bash
# On Vercel
vercel env pull
npx prisma migrate deploy

# On Docker
docker-compose exec app npx prisma migrate deploy
docker-compose exec app npm run db:seed

# Via CLI (any platform)
DATABASE_URL="..." npx prisma migrate deploy
```

### 4. SSL/TLS

- **Vercel:** Automatic ✅
- **Docker (Let's Encrypt):** Auto-renewal via Certbot
- **AWS:** ACM certificates
- **Railway:** Automatic ✅
- **DigitalOcean App Platform:** Automatic ✅

### 5. Monitoring & Logs

**Vercel**
```bash
vercel logs
```

**Docker**
```bash
docker-compose logs -f app
```

**AWS CloudWatch**
```bash
aws logs tail /ecs/buildcore-elite --follow
```

### 6. Backups

**Docker - Daily Backup Script**
```bash
# Add to crontab
0 2 * * * /path/to/scripts/backup.sh
```

**PostgreSQL Automated**
- Vercel Postgres: Automatic daily backups
- AWS RDS: Enable automated backups
- DigitalOcean: Enable managed backups

---

## 🔒 Security Checklist

- [ ] Change database password
- [ ] Set strong JWT secret (32+ characters)
- [ ] Enable SSL/TLS
- [ ] Configure firewall rules
- [ ] Enable automated backups
- [ ] Set up monitoring/alerts
- [ ] Configure rate limiting (done in code)
- [ ] Enable security headers (done in code)
- [ ] Set up email notifications
- [ ] Regular updates/patches

---

## ⚙️ Performance Optimization

### CDN Configuration

**Vercel:** Automatic global CDN ✅

**Docker/Self-Hosted:**
```nginx
# Cloudflare
# 1. Add domain to Cloudflare
# 2. Point nameservers to Cloudflare
# 3. Set to "Proxied" (orange cloud)
```

### Database Optimization

```sql
-- Create indexes for common queries
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_testimonials_published ON testimonials(published);
```

### Image Optimization

Already configured in Next.js:
- Automatic WebP conversion
- Responsive images
- Lazy loading

---

## 🚨 Troubleshooting

### Database Connection Error
```bash
# Check DATABASE_URL format
echo $DATABASE_URL

# Test connection
psql "$DATABASE_URL"
```

### Build Fails on Vercel
```bash
# Check build logs
vercel logs --follow

# Test locally
npm run build
```

### Docker Services Not Starting
```bash
# Check logs
docker-compose logs

# Verify ports available
lsof -i :3000
lsof -i :5432
```

### SSL Certificate Issues
```bash
# Verify certificate
openssl x509 -in ssl/cert.pem -text -noout

# Renew Let's Encrypt
certbot renew --force-renewal
```

---

## 📞 Support Resources

- **GitHub Issues:** [buildcore-elite/issues](https://github.com/Peter-Lema/buildcore-elite/issues)
- **Documentation:** See README.md & DOCKER.md
- **Email:** support@buildcoreelite.com

---

## 🎯 Next Steps

1. ✅ Choose deployment platform
2. ✅ Follow deployment instructions
3. ✅ Configure custom domain
4. ✅ Set up SSL certificate
5. ✅ Configure email service
6. ✅ Run database migrations
7. ✅ Test all features
8. ✅ Set up monitoring
9. ✅ Configure backups
10. ✅ Go live! 🎉

---

**Your BuildCore Elite website is ready to launch!** 🚀
