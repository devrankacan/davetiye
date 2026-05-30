# VPS Deploy Rehberi

## 1. Sunucuya bağlan ve bağımlılıkları kur

```bash
# Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs nginx

# PM2
sudo npm install -g pm2
```

## 2. Projeyi çek

```bash
cd /var/www
git clone https://github.com/devrankacan/davetiye.git
cd davetiye
git checkout claude/charming-bell-wVJl6
```

## 3. Ortam değişkenlerini ayarla

```bash
cp .env.example .env.local
nano .env.local
```

`.env.local` içeriği:
```
ADMIN_PASSWORD=güçlü_bir_şifre_yaz
```

## 4. Yüklemelerin saklanacağı klasörü oluştur

```bash
mkdir -p public/uploads
```

## 5. Build ve başlat

```bash
npm install
npm run build
pm2 start ecosystem.config.js
pm2 save
pm2 startup   # sunucu yeniden başladığında otomatik çalışsın
```

## 6. Nginx ayarla

```bash
sudo cp nginx.conf /etc/nginx/sites-available/davetiye
sudo ln -s /etc/nginx/sites-available/davetiye /etc/nginx/sites-enabled/
# nginx.conf içindeki server_name satırını kendi IP veya domainine göre düzenle
sudo nginx -t
sudo systemctl reload nginx
```

## 7. SSL (isteğe bağlı, domain varsa)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d alan-adin.com
```

## Güncelleme yapmak için

```bash
cd /var/www/davetiye
git pull
npm run build
pm2 restart davetiye
```

## Fotoğrafları yedekle

Yüklenen fotoğraflar `public/uploads/` klasöründe saklanır.
Yedeklemek için:
```bash
tar -czf nissan-fotolar-$(date +%Y%m%d).tar.gz /var/www/davetiye/public/uploads/
```
