# BuildCore Elite - VPS Deployment Walkthrough

Complete step-by-step guide to deploy BuildCore Elite on a VPS using Docker.

## 📋 Prerequisites

Before starting, you need:

- [ ] A VPS (DigitalOcean, AWS Lightsail, Linode, or similar) - Ubuntu 22.04 LTS
- [ ] SSH access to your VPS
- [ ] A domain name
- [ ] Basic command line knowledge
- [ ] 2GB RAM minimum
- [ ] 10GB disk space

---

## 🚀 Step 1: Choose Your VPS Provider

### Recommended Options

#### **DigitalOcean (Best Value)**
- **Cost:** $6/month (2GB RAM) - $12/month (4GB RAM)
- **Setup:** 2 minutes
- **Visit:** [digitalocean.com](https://www.digitalocean.com/pricing/droplets)

1. Click "Create" → "Droplet"
2. Choose **Ubuntu 22.04 LTS**
3. Select **2GB RAM / 1vCPU** (minimum)
4. Choose datacenter region closest to you
5. Add SSH key (recommended over passwords)
6. Click "Create Droplet"
7. Note your droplet IP address

#### **AWS Lightsail (AWS Ecosystem)**
- **Cost:** $5/month
- **Setup:** 5 minutes
- **Visit:** [lightsail.aws.amazon.com](https://lightsail.aws.amazon.com)

1. Create instance
2. Choose Ubuntu 22.04
3. Select $5 plan minimum
4. Add SSH key
5. Note public IP

#### **Linode (Reliable)**
- **Cost:** $6/month (2GB Nanode)
- **Setup:** 3 minutes
- **Visit:** [linode.com](https://www.linode.com/pricing/)

1. Create Linode
2. Choose Ubuntu 22.04 LTS
3. Select Nanode 1GB+ plan
4. Note public IP address

---

## 🔐 Step 2: Initial Server Setup

### 2.1 Connect via SSH

```bash
ssh root@YOUR_VPS_IP_ADDRESS
# Replace YOUR_VPS_IP_ADDRESS with your actual IP
```

If using key file:
```bash
ssh -i /path/to/key.pem root@YOUR_VPS_IP_ADDRESS
```

### 2.2 Update System

```bash
apt update
apt upgrade -y
apt install -y curl wget git nano htop
```

### 2.3 Create Non-Root User (Recommended)

```bash
# Create new user
adduser buildcore
# Add sudo privileges
usermod -aG sudo buildcore
# Switch to new user
su - buildcore
```

---

## 🐳 Step 3: Install Docker & Docker Compose

### 3.1 Install Docker

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

### 3.2 Add User to Docker Group

```bash
sudo usermod -aG docker $USER
# Log out and back in for this to take effect
exit
ssh buildcore@YOUR_VPS_IP_ADDRESS
```

### 3.3 Install Docker Compose

```bash
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
docker-compose --version
```

### 3.4 Verify Installation

```bash
docker --version
docker-compose --version
```

---

## 📁 Step 4: Clone Repository

```bash
cd ~
git clone https://github.com/Peter-Lema/buildcore-elite.git
cd buildcore-elite
```

---

## 🔧 Step 5: Configure Environment

### 5.1 Create .env File

```bash
cp .env.docker .env
nano .env
```

### 5.2 Update Variables

Edit `.env` and change these values:

```env
# Database
DB_NAME=buildcore_elite
DB_USER=postgres
DB_PASSWORD=CHANGE_THIS_TO_STRONG_PASSWORD_12345

# Application
NODE_ENV=production
JWT_SECRET=CHANGE_THIS_TO_32_CHARACTER_RANDOM_STRING_ABCDEFGH

# Email (optional - for contact forms)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
EMAIL_FROM=noreply@buildcoreelite.com
ADMIN_EMAIL=your-admin-email@gmail.com

# API
NEXT_PUBLIC_API_URL=https://buildcoreelite.com/api

# Security
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=optional-recaptcha-key
RECAPTCHA_SECRET_KEY=optional-recaptcha-secret
```

**⚠️ Important:** Replace placeholders with actual values!

### 5.3 Generate Strong Secrets

```bash
# Generate random JWT secret (32 chars)
openssl rand -base64 32

# Example output (use this):
# 3vX9kL2pQ8nM5jR7tW1sU4zY6bC3dE5fG7hI9jK1lM
```

Copy the output and update `JWT_SECRET` in `.env`.

---

## 🔒 Step 6: SSL/TLS Setup

### Option A: Let's Encrypt (Recommended for Production)

#### 6A.1 Install Certbot

```bash
sudo apt install -y certbot python3-certbot-dns-digitalocean
# Or for other DNS providers, use appropriate plugin
```

#### 6A.2 Point Domain First

Before creating certificate, update your domain DNS:

1. Go to your domain registrar (Namecheap, GoDaddy, etc.)
2. Find DNS management
3. Add/Edit **A Record**:
   - Type: A
   - Name: @ (or buildcoreelite)
   - Value: YOUR_VPS_IP_ADDRESS
   - TTL: 3600
4. Wait 5-30 minutes for propagation

Verify DNS is working:
```bash
nslookup buildcoreelite.com
# Should show your VPS IP
```

#### 6A.3 Get Certificate

```bash
mkdir -p ~/buildcore-elite/ssl
cd ~/buildcore-elite

# Standalone method (easiest)
sudo certbot certonly --standalone -d buildcoreelite.com -d www.buildcoreelite.com

# When prompted:
# - Enter your email
# - Agree to terms
# - Share with EFF (your choice)
```

#### 6A.4 Copy Certificates

```bash
sudo cp /etc/letsencrypt/live/buildcoreelite.com/fullchain.pem ssl/cert.pem
sudo cp /etc/letsencrypt/live/buildcoreelite.com/privkey.pem ssl/key.pem
sudo chown -R $USER:$USER ssl/
```

#### 6A.5 Auto-Renewal

```bash
# Test renewal
sudo certbot renew --dry-run

# Add to crontab for auto-renewal
(sudo crontab -l 2>/dev/null; echo "0 3 * * * certbot renew --quiet && systemctl reload nginx") | sudo crontab -
```

### Option B: Self-Signed Certificate (Testing Only)

```bash
mkdir -p ssl
openssl req -x509 -newkey rsa:4096 -keyout ssl/key.pem -out ssl/cert.pem -days 365 -nodes

# When prompted, you can press Enter to skip or enter values
# Common Name: buildcoreelite.com
```

---

## 🚀 Step 7: Deploy Application

### 7.1 Update nginx.conf

Edit `nginx.conf` and change:
```bash
nano nginx.conf
```

Update this line:
```nginx
server_name buildcoreelite.com www.buildcoreelite.com;
```

Replace with your actual domain.

### 7.2 Start Docker Services

```bash
cd ~/buildcore-elite

# Build images (first time only)
docker-compose build

# Start services
docker-compose up -d

# Check status
docker-compose ps
```

You should see 3 containers running:
- `buildcore-db` (PostgreSQL)
- `buildcore-app` (Next.js)
- `buildcore-nginx` (Nginx proxy)

### 7.3 Run Database Migrations

Wait 10 seconds for PostgreSQL to start, then:

```bash
docker-compose exec app npx prisma migrate deploy
```

### 7.4 Seed Database (Optional)

```bash
docker-compose exec app npm run db:seed
```

### 7.5 Verify Deployment

```bash
# Check logs
docker-compose logs -f app

# Health check
./scripts/health-check.sh
```

---

## ✅ Step 8: Verify Everything Works

### 8.1 Test HTTP → HTTPS Redirect

```bash
curl -I http://buildcoreelite.com
# Should see: Location: https://buildcoreelite.com
```

### 8.2 Test HTTPS

```bash
curl -I https://buildcoreelite.com
# Should see: HTTP/2 200
```

### 8.3 Visit in Browser

Open: `https://buildcoreelite.com`

You should see your BuildCore Elite website! 🎉

### 8.4 Check SSL Certificate

```bash
openssl s_client -connect buildcoreelite.com:443 -showcerts
# Verify it's valid and has your domain
```

---

## 🔧 Step 9: Configure Firewall

### 9.1 Setup UFW Firewall

```bash
# Enable firewall
sudo ufw enable

# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP
sudo ufw allow 80/tcp

# Allow HTTPS
sudo ufw allow 443/tcp

# Verify
sudo ufw status
```

---

## 📧 Step 10: Email Configuration

### 10.1 Gmail SMTP Setup

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password:**
   - Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
   - Select "Mail" and "Windows Computer"
   - Copy the 16-character password

3. **Update .env:**
```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
EMAIL_FROM=noreply@buildcoreelite.com
ADMIN_EMAIL=your-email@gmail.com
```

4. **Restart app:**
```bash
docker-compose restart app
```

### 10.2 Test Email

Submit contact form on website - should receive email!

---

## 📊 Step 11: Monitoring & Maintenance

### 11.1 View Logs

```bash
# Application logs
docker-compose logs -f app

# Database logs
docker-compose logs -f postgres

# Nginx logs
docker-compose logs -f nginx

# Last 100 lines
docker-compose logs --tail=100 app
```

### 11.2 Monitor Resource Usage

```bash
# Docker stats
docker stats

# Or use system monitoring
htop
```

### 11.3 Database Backup

```bash
# Manual backup
./scripts/backup.sh

# Check backup
ls -lh backups/

# Auto backup (daily at 2 AM)
(sudo crontab -l 2>/dev/null; echo "0 2 * * * cd ~/buildcore-elite && ./scripts/backup.sh") | sudo crontab -
```

### 11.4 Health Check

```bash
# Run health check
./scripts/health-check.sh

# Schedule hourly
(sudo crontab -l 2>/dev/null; echo "0 * * * * cd ~/buildcore-elite && ./scripts/health-check.sh >> health.log 2>&1") | sudo crontab -
```

---

## 🔐 Step 12: Security Hardening

### 12.1 Update Docker Images

```bash
# Weekly updates
docker-compose pull
docker-compose up -d
```

### 12.2 Restrict SSH Access

```bash
# Disable root login
sudo nano /etc/ssh/sshd_config

# Change:
# PermitRootLogin no
# PasswordAuthentication no

# Restart SSH
sudo systemctl restart sshd
```

### 12.3 Setup Fail2Ban (Brute Force Protection)

```bash
sudo apt install -y fail2ban

sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 12.4 Monitor Security

```bash
# Check open ports
sudo netstat -tulpn

# Check failed SSH attempts
sudo tail -f /var/log/auth.log
```

---

## 📈 Step 13: Performance Optimization

### 13.1 Enable Swap (if needed)

```bash
# For 2GB RAM VPS
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

### 13.2 Database Optimization

```bash
# Access database
docker-compose exec postgres psql -U postgres -d buildcore_elite

# Create indexes
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_testimonials_published ON testimonials(published);

# Exit
\q
```

### 13.3 Check Disk Usage

```bash
df -h
du -sh ~/buildcore-elite
```

---

## 🔄 Step 14: Updating Application

### 14.1 Pull Latest Changes

```bash
cd ~/buildcore-elite
git pull origin main
```

### 14.2 Rebuild & Deploy

```bash
docker-compose build --no-cache
docker-compose up -d
```

### 14.3 Run Migrations (if schema changed)

```bash
docker-compose exec app npx prisma migrate deploy
```

---

## 🚨 Troubleshooting

### Problem: Connection Refused

```bash
# Check if services are running
docker-compose ps

# Restart services
docker-compose restart

# Check logs
docker-compose logs app
```

### Problem: Database Connection Error

```bash
# Check PostgreSQL is ready
docker-compose logs postgres

# Restart database
docker-compose restart postgres

# Wait 10 seconds then retry
sleep 10
docker-compose exec app npx prisma migrate deploy
```

### Problem: Out of Disk Space

```bash
# Check disk usage
df -h

# Clean Docker
docker system prune -a

# Check backups
du -sh backups/
```

### Problem: SSL Certificate Error

```bash
# Verify certificate validity
openssl x509 -in ssl/cert.pem -text -noout

# Renew Let's Encrypt
sudo certbot renew --force-renewal

# Copy renewed certificate
sudo cp /etc/letsencrypt/live/buildcoreelite.com/fullchain.pem ssl/cert.pem
sudo cp /etc/letsencrypt/live/buildcoreelite.com/privkey.pem ssl/key.pem
```

### Problem: Website Not Loading

```bash
# Check if Nginx is running
docker-compose logs nginx

# Test connection to app
docker-compose exec app curl http://localhost:3000

# Check DNS
nslookup buildcoreelite.com
```

---

## 📞 Useful Commands Reference

```bash
# Docker Compose
docker-compose up -d              # Start all services
docker-compose down               # Stop all services
docker-compose logs -f app        # View app logs
docker-compose ps                 # Show running containers
docker-compose restart app        # Restart app
docker-compose build              # Rebuild images

# Database
docker-compose exec postgres psql -U postgres -d buildcore_elite  # Access DB
docker-compose exec app npx prisma migrate deploy                 # Run migrations
./scripts/backup.sh               # Backup database

# System
docker stats                      # Monitor resource usage
df -h                            # Disk usage
htop                             # System monitor
sudo ufw status                  # Firewall status
sudo systemctl status docker     # Docker service status

# SSL
sudo certbot renew --dry-run     # Test renewal
sudo certbot certificates        # List certificates
```

---

## ✨ Final Checklist

- [ ] VPS created and accessible
- [ ] Docker & Docker Compose installed
- [ ] Repository cloned
- [ ] .env configured with strong passwords
- [ ] Domain DNS pointing to VPS IP
- [ ] SSL certificate created
- [ ] Docker services running
- [ ] Database migrations completed
- [ ] Website accessible at https://buildcoreelite.com
- [ ] Email configuration tested
- [ ] Backups scheduled
- [ ] Firewall configured
- [ ] Health checks enabled
- [ ] Monitoring configured

---

## 🎉 Success!

Your BuildCore Elite website is now running on your own VPS with:

✅ Full control  
✅ Auto-scaling via Docker  
✅ Automated backups  
✅ SSL/TLS encryption  
✅ Email notifications  
✅ Security hardening  
✅ Monitoring & health checks  
✅ 24/7 uptime  

**Your site is live at:** `https://buildcoreelite.com` 🚀

---

## 📚 Next Steps

1. **Customize content:**
   - Update `components/Hero.tsx` with your info
   - Add real projects to portfolio
   - Update contact info in footer

2. **Configure business details:**
   - Company name, address, phone
   - Service descriptions
   - Project images

3. **Monitor performance:**
   - Check logs regularly
   - Monitor database
   - Track website analytics

4. **Keep it updated:**
   - Regular security patches
   - Update dependencies
   - Review backups

---

**Congratulations! BuildCore Elite is live!** 🎊
