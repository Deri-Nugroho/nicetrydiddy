# nicetrydiddy 👀

Simple Node.js + Express server that serves a single GIF page. Designed for minimal setup, works great on Amazon Linux 2023.

---

## 🧾 Description

This app uses [Express.js](https://expressjs.com/) to serve a single webpage with a GIF image. It's great for testing web deployment or just having fun.

---

## 🚀 Quick Setup on Amazon Linux 2023

### *Install dependency*

```bash
npm isntall
```

## *Modify app.js to use port 8000*

❗ Why Port 6000 Was Replaced

The original code uses **port 6000**, but:

- 🚫 **Port 6000 is often blocked** by firewalls, cloud providers, or Linux itself.
- 🔐 It’s historically used for the **X11 display server**, which poses security risks.
- 🧱 Many cloud VMs (e.g., AWS EC2) **block uncommon ports by default**.

✅ We changed it to **port 8000**, a commonly used and accessible port for development servers.

```bash
nano app.js
```

🔧 Change:

```js
const port = 6000;
```

➡️ To:

```js
const port = 8000;
```

## *Environment*

```java
# Konfigurasi server
PORT=your-port-server                 # Port tempat aplikasi berjalan

# AWS Credentials
AWS_ACCESS_KEY_ID=your-access-key-id   # Access Key ID AWS
AWS_SECRET_ACCESS_KEY=your-secret-key  # Secret Access Key AWS
AWS_SESSION_TOKEN=your-session-token   # Token sesi AWS (jika menggunakan kredensial sementara)
AWS_REGION=your-region                 # Wilayah AWS (contoh: us-east-1, us-west-2)
AWS_BUCKET_NAME=your-bucket-name       # Nama bucket S3 tempat penyimpanan backup
```

## Run the app
```bash
node app.js
```
