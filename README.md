# nicetrydiddy 👀

Simple Node.js + Express server that serves a single GIF page. Designed for minimal setup, works great on Amazon Linux 2023.

---

## 🧾 Description

This app uses [Express.js](https://expressjs.com/) to serve a single webpage with a GIF image. It's great for testing web deployment or just having fun.

---

## ❗ Why Port 6000 Was Replaced

The original code uses **port 6000**, but:

- 🚫 **Port 6000 is often blocked** by firewalls, cloud providers, or Linux itself.
- 🔐 It’s historically used for the **X11 display server**, which poses security risks.
- 🧱 Many cloud VMs (e.g., AWS EC2) **block uncommon ports by default**.

✅ We changed it to **port 8000**, a commonly used and accessible port for development servers.

---

## 🚀 Quick Setup on Amazon Linux 2023

### 1. Update and install Node.js

```bash
sudo dnf update -y
sudo dnf install nodejs -y
