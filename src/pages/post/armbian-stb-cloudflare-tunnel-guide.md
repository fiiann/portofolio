---
layout: ../../layouts/post.astro
title: Armbian STB Cloudflare Tunnel Guide
description: Step-by-step guide to set up Armbian STB with Cloudflare Tunnel for secure remote access.
dateFormatted: June 23th, 2025
---

![Armbian STB Cloudflare Tunnel Guide](/assets/images/posts/armbian-stb-cloudflare-tunnel-guide.png)
# Setting Up Armbian STB with Cloudflare Tunnel: Transform Your Old TV Box into a Home Server

Are you looking to repurpose your old Android TV box into a powerful home server?  
This comprehensive guide will walk you through setting up **Armbian** on your STB (Set-Top Box) and configuring **Cloudflare Tunnel** to securely expose your services to the internet without opening firewall ports or dealing with dynamic DNS.

---

## What You'll Learn

By the end of this guide, you'll have:

- A fully functional Armbian-based home server running on your old TV box  
- Cloudflare Tunnel configured for secure external access  
- A foundation for hosting various services like web applications, APIs, and automation tools  

---

## Prerequisites

Before diving in, ensure you have:

- **Old Android TV Box**: Any ARM-based STB that supports Armbian installation  
- **Armbian OS**: Already flashed and running on your device  
- **Cloudflare Account**: Free account with your domain configured  
- **Domain Name**: Registered domain added to Cloudflare with nameservers configured  
- **SSH Access**: Command-line access to your Armbian device  
- **Basic Linux Knowledge**: Comfort with terminal commands and text editors  

---

## Why Choose This Setup?

This configuration offers several advantages:

- 🔒 **Security**: No need to expose ports directly to the internet  
- ⚙️ **Reliability**: Cloudflare's global network ensures high availability  
- 💰 **Cost-Effective**: Repurpose existing hardware instead of buying new servers  
- 📘 **Learning Opportunity**: Great way to learn about self-hosting and networking  

---

## Step 1: Prepare Your Armbian Environment

### Update Your System

```bash
# Connect via SSH
ssh your-username@your-stb-ip

# Update package lists and system
sudo apt update && sudo apt upgrade -y

# Install essential tools
sudo apt install -y curl wget nano htop
```

### Check System Architecture

```bash
# Check architecture
dpkg --print-architecture

# Common outputs:
# arm64 - for newer 64-bit ARM devices
# armhf - for older 32-bit ARM devices
```

### Configure Network Settings

```bash
# Check current IP
ip addr show

# Note your current IP (e.g., 192.168.0.100)
# Set static IP via router DHCP reservation for consistency
```

---

## Step 2: Install and Configure Cloudflare Tunnel

### Download Cloudflared

For **ARM64** devices:

```bash
curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-arm64.deb
```

For **ARMHF** devices:

```bash
curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-arm.deb
```

### Install Cloudflared

```bash
sudo dpkg -i cloudflared.deb

# Verify installation
cloudflared --version
```

### Authenticate with Cloudflare

```bash
cloudflared tunnel login
```

Follow the URL in the terminal:

- Open in your browser  
- Log in to your Cloudflare account  
- Select your domain  
- Click **Authorize and Begin Tunneling**

---

## Step 3: Create and Configure Your Tunnel

### Create a Named Tunnel

```bash
cloudflared tunnel create home-server-tunnel
```

> 📌 Note: Save the Tunnel ID and credentials file path shown in the output.

### Create Configuration Directory

```bash
sudo mkdir -p /etc/cloudflared
```

### Configure Tunnel Routing

```bash
sudo nano /etc/cloudflared/config.yml
```

```yaml
tunnel: <YOUR_TUNNEL_ID>
credentials-file: /root/.cloudflared/<YOUR_TUNNEL_ID>.json

ingress:
  - hostname: status.yourdomain.com
    service: http://localhost:8080
  - service: http_status:404
```

---

## Step 4: Set Up DNS Routing

```bash
cloudflared tunnel route dns home-server-tunnel status.yourdomain.com
```

> This creates a **CNAME record** in your Cloudflare DNS automatically.

---

## Step 5: Install and Start the Tunnel Service

```bash
# Install systemd service
sudo cloudflared service install

# Enable on boot
sudo systemctl enable cloudflared

# Start the service
sudo systemctl start cloudflared
```

### Verify Service

```bash
sudo systemctl status cloudflared
sudo journalctl -u cloudflared.service -f
```

---

## Step 6: Test Your Setup

### Create a Simple Test Service

```bash
# Install Python
sudo apt install -y python3

# Create test directory
mkdir ~/test-server
cd ~/test-server

# Create HTML file
cat << EOF > index.html
<!DOCTYPE html>
<html>
<head>
    <title>Armbian Home Server</title>
</head>
<body>
    <h1>Welcome to Your Armbian Home Server!</h1>
    <p>Cloudflare Tunnel is working correctly.</p>
    <p>Server IP: $(hostname -I | awk '{print $1}')</p>
    <p>Timestamp: $(date)</p>
</body>
</html>
EOF

# Start HTTP server
python3 -m http.server 8080
```

### Update Tunnel Config

```bash
sudo nano /etc/cloudflared/config.yml
```

Update the `ingress` section if needed, then restart:

```bash
sudo systemctl restart cloudflared
```

### Test in Browser

Visit:  
**https://status.yourdomain.com**

✅ You should see your test page live.

---

## Troubleshooting Common Issues

### 🔴 Service Cannot Connect

```bash
# Check local service
curl http://localhost:8080

# Check UFW firewall
sudo ufw status
sudo ufw allow 8080/tcp
```

### 🔴 Cloudflared Service Issues

```bash
sudo journalctl -u cloudflared.service --no-pager -n 50
```

Fixes:

- Ensure `/etc/cloudflared/config.yml` exists  
- Check permissions and correct paths  
- Restart service: `sudo systemctl restart cloudflared`

### 🔴 DNS Propagation Issues

```bash
nslookup status.yourdomain.com
```

Tips:

- Wait a few minutes  
- Clear browser cache  
- Test from another network  

---

## Security Considerations

### SSH Hardening

```bash
sudo nano /etc/ssh/sshd_config
```

Recommended changes:

```
Port 2222
PermitRootLogin no
PasswordAuthentication no
```

```bash
sudo systemctl restart ssh
```

### Firewall Setup

```bash
sudo ufw enable
sudo ufw allow 22/tcp
sudo ufw allow 8080/tcp
sudo ufw status
```

---

## Regular Maintenance

### Create Update Script

```bash
cat << EOF > ~/update-system.sh
#!/bin/bash
sudo apt update
sudo apt upgrade -y
sudo apt autoremove -y
sudo systemctl restart cloudflared
EOF

chmod +x ~/update-system.sh
```

### Automate Weekly via Cron

```bash
(crontab -l 2>/dev/null; echo "0 2 * * 0 /home/$(whoami)/update-system.sh") | crontab -
```

---

## Next Steps

Now that your server is online:

- 🌐 **Host a Portfolio Website**  
- ⚙️ **Run Automation Tools** like n8n, Home Assistant  
- 🎬 **Install Media Servers** like Jellyfin or Plex  
- 💻 **Set Up Dev Environments**: Git, CI/CD  
- 📊 **Monitor** using Grafana, Prometheus  

---

## Performance Optimization Tips

### Resource Monitoring

```bash
sudo apt install -y htop iotop nethogs
htop       # CPU/memory
iotop      # Disk I/O
nethogs    # Network usage
```

### Storage Management

```bash
df -h
sudo apt autoremove -y
sudo apt autoclean
```

### Log Rotation

```bash
sudo nano /etc/logrotate.d/cloudflared
```

```conf
/var/log/cloudflared.log {
    daily
    rotate 7
    compress
    missingok
    notifempty
}
```

---

## Conclusion

🎉 Congratulations! You've successfully transformed your old TV box into a powerful home server.

- 🔒 Secure remote access via Cloudflare  
- ⚡ Professional-grade uptime with no port forwarding  
- 💵 Cost-effective and scalable solution  

Regularly update and secure your setup, and you're all set to expand your self-hosted ecosystem!
