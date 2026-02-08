# Network Access Instructions

## Access Your Portfolio from Other Devices

Your portfolio is now accessible on your local network!

### URLs to Access:

**On This Computer:**
- http://localhost:3000

**From Other Devices on the Same Network:**
- http://10.13.11.167:3000

### How to Access from Other Devices:

1. **Make sure both devices are on the same WiFi network**
   - Your computer and the device you want to test on must be connected to the same WiFi

2. **On your phone, tablet, or another computer:**
   - Open a web browser (Chrome, Safari, Firefox, etc.)
   - Type in the address bar: `http://10.13.11.167:3000`
   - Press Enter/Go

3. **If it doesn't work, check your firewall:**
   - Windows Firewall might be blocking the connection
   - You may need to allow Node.js through the firewall

### Troubleshooting:

If you can't access from other devices:

1. **Check Windows Firewall:**
   ```powershell
   # Run this in PowerShell as Administrator
   New-NetFirewallRule -DisplayName "Node.js Server" -Direction Inbound -Protocol TCP -LocalPort 3000 -Action Allow
   ```

2. **Verify your IP address hasn't changed:**
   ```powershell
   Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.IPAddress -like "192.168.*" -or $_.IPAddress -like "10.*"}
   ```

3. **Make sure the dev server is running:**
   - Check that you see "Network: http://0.0.0.0:3000" in the terminal

### Features to Test:

✅ Hero section with photo
✅ About section with skills
✅ Experience timeline
✅ Projects showcase
✅ Contact buttons (Email Me, Call Me)
✅ Footer with links
✅ Dark mode toggle
✅ Responsive design on mobile

### Notes:

- The server must be running on your computer for others to access it
- The IP address (10.13.11.167) is only valid on your local network
- For internet access, you'll need to deploy to a hosting service like Vercel or Netlify
