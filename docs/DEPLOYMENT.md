# Hospital Management System - Deployment Guide

## Prerequisites for Deployment

- Production database (MongoDB Atlas)
- Cloud hosting provider (Azure, AWS, Heroku, Vercel)
- Domain name
- SSL certificate
- CDN for static assets

## Frontend Deployment

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Deploy:**
```bash
cd frontend
vercel --prod
```

3. **Environment Variables in Vercel Dashboard:**
```
VITE_API_URL=https://your-backend-domain.com
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

### Option 2: Netlify

1. **Build locally:**
```bash
cd frontend
npm run build
```

2. **Upload `dist` folder to Netlify**
3. **Configure build settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`

### Option 3: AWS S3 + CloudFront

1. **Build:**
```bash
cd frontend
npm run build
```

2. **Upload to S3:**
```bash
aws s3 sync dist/ s3://your-bucket-name/
```

3. **Create CloudFront distribution pointing to S3**

### Option 4: Docker + Azure

1. **Create Dockerfile:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package.json .
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "preview"]
```

2. **Build and push to Azure Container Registry:**
```bash
docker build -t hospital-frontend:1.0 .
az acr build --registry myregistry --image hospital-frontend:1.0 .
```

## Backend Deployment

### Option 1: Azure App Service

1. **Create App Service:**
```bash
az appservice plan create --name hospital-plan --resource-group myGroup
az webapp create --name hospital-api --plan hospital-plan --resource-group myGroup
```

2. **Deploy using Git:**
```bash
git remote add azure https://yourapp.scm.azurewebsites.net/yourapp.git
git push azure main
```

3. **Configure environment variables in Azure Portal**

### Option 2: Heroku

1. **Login to Heroku:**
```bash
heroku login
```

2. **Create app:**
```bash
heroku create hospital-system-api
```

3. **Set environment variables:**
```bash
heroku config:set MONGODB_URI=mongodb+srv://...
heroku config:set JWT_SECRET=your_secret_key
heroku config:set NODE_ENV=production
```

4. **Deploy:**
```bash
git push heroku main
```

### Option 3: Railway

1. **Deploy with Railway CLI:**
```bash
npm install -g @railway/cli
railway init
railway up
```

### Option 4: Docker + AWS ECS

1. **Create Dockerfile:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --only=production

COPY src ./src

EXPOSE 5000

CMD ["node", "src/server.js"]
```

2. **Build image:**
```bash
docker build -t hospital-backend:1.0 .
docker tag hospital-backend:1.0 123456789.dkr.ecr.us-east-1.amazonaws.com/hospital-backend:1.0
```

3. **Push to ECR:**
```bash
aws ecr get-login-password | docker login --username AWS --password-stdin 123456789.dkr.ecr.us-east-1.amazonaws.com
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/hospital-backend:1.0
```

## Database Deployment

### MongoDB Atlas (Recommended)

1. **Create cluster in MongoDB Atlas**
2. **Configure IP whitelist**
3. **Create database user**
4. **Get connection string:**
```
mongodb+srv://username:password@cluster.mongodb.net/hospital
```

5. **Add to backend environment variables**

## Production Environment Setup

### Environment Variables (Backend)

```env
MONGODB_URI=mongodb+srv://prod-user:password@prod-cluster.mongodb.net/hospital
JWT_SECRET=your_very_secure_random_key_here
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=production

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

EMAIL_USER=noreply@hospital.com
EMAIL_PASSWORD=your_app_password
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587

GEMINI_API_KEY=your_gemini_api_key
```

### Environment Variables (Frontend)

```env
VITE_API_URL=https://api.hospital.com
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

## SSL/TLS Certificate

### Let's Encrypt (Free)

```bash
# Using certbot
certbot certonly --standalone -d hospital.com -d api.hospital.com
```

### Update Nginx Configuration

```nginx
server {
    listen 443 ssl http2;
    server_name api.hospital.com;

    ssl_certificate /etc/letsencrypt/live/api.hospital.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.hospital.com/privatekey.pem;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Monitoring & Logging

### Application Monitoring

```bash
# PM2 for process management
npm install -g pm2

# Start app
pm2 start src/server.js --name hospital-api

# Monitor
pm2 monit

# Logs
pm2 logs hospital-api
```

### Logging

Add to backend `src/server.js`:

```javascript
import winston from 'winston'

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
})

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }))
}
```

## Performance Optimization

### Caching

```javascript
// Redis caching
import redis from 'redis'

const client = redis.createClient()

// Cache doctor list
app.get('/doctors', async (req, res) => {
  const cached = await client.get('doctors')
  if (cached) return res.json(JSON.parse(cached))
  
  const doctors = await Doctor.find()
  await client.setex('doctors', 3600, JSON.stringify(doctors))
  res.json(doctors)
})
```

### Database Indexes

Already configured in [DATABASE.md](./DATABASE.md)

### CDN for Static Assets

Configure Cloudinary for all image delivery and use CDN for React build files.

## Security Checklist

- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] Database authentication enabled
- [ ] CORS properly configured
- [ ] Rate limiting implemented
- [ ] Input validation on all endpoints
- [ ] OWASP security headers added
- [ ] Regular dependency updates
- [ ] Database backups configured
- [ ] Monitoring and alerting set up

## Backup Strategy

### Database Backups

```bash
# Automatic backup in MongoDB Atlas is enabled
# Or manual backup:
mongodump --uri mongodb+srv://user:password@cluster.mongodb.net/hospital
mongorestore --uri mongodb+srv://user:password@cluster.mongodb.net/hospital dump/
```

### Application Backups

Use git to version control the entire project.

## Scaling Considerations

1. **Horizontal Scaling:**
   - Load balancer (Nginx, AWS ELB)
   - Multiple backend instances
   - Redis cache layer

2. **Database Scaling:**
   - MongoDB sharding
   - Read replicas
   - Connection pooling

3. **CDN:**
   - Cloudinary for images
   - CloudFront/Fastly for static assets

## Rollback Plan

```bash
# Using git
git tag production-v1.0
git push origin production-v1.0

# If needed, rollback
git reset --hard production-v1.0
git push -f origin main
```

## Post-Deployment

1. **Verify health endpoint:**
```bash
curl https://api.hospital.com/health
```

2. **Test authentication:**
```bash
curl -X POST https://api.hospital.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@hospital.com","password":"admin123"}'
```

3. **Monitor logs and performance**
4. **Set up alerts for errors**
5. **Schedule regular backups**

## Support

For deployment issues:
- Check provider documentation
- Review application logs
- Verify environment variables
- Test database connectivity
- Contact cloud provider support
