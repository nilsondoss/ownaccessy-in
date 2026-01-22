# Domain Setup Guide - ownaccessy.in

## Your Domain
**Domain:** ownaccessy.in
**Current Preview URL:** https://qey66h1e3v.preview.c24.airoapp.ai
<<<<<<< HEAD
**Target:** Connect custom domain to your OwnAccessy.in application
=======
**Target:** Connect custom domain to your ownaccessy application
>>>>>>> 20260118033327-qey66h1e3v

## Setup Steps

### Step 1: Publish Your Application

Before connecting a domain, you need to publish your app to production:

1. Make sure all changes are committed (already done ✅)
2. Test your application on the preview URL
3. Use the publish command to deploy to production

**I can publish your app now if you're ready!**

### Step 2: Configure DNS Records

After publishing, you'll need to add DNS records at your domain registrar (where you bought ownaccessy.in):

#### Option A: Using A Record (Recommended)

```
Type: A
Name: @ (or leave blank for root domain)
Value: [IP address will be provided after publishing]
TTL: 3600 (or Auto)
```

#### Option B: Using CNAME Record (for www subdomain)

```
Type: CNAME
Name: www
Value: [CNAME target will be provided after publishing]
TTL: 3600 (or Auto)
```

### Step 3: Configure Domain in GoDaddy/Airo Settings

After publishing, you'll need to:

1. Go to your application settings
2. Navigate to the "Domains" or "Custom Domain" section
3. Add your domain: `ownaccessy.in`
4. Follow the verification steps
5. Wait for SSL certificate to be issued (usually 5-15 minutes)

### Step 4: Update Application URLs

After domain is connected, update these environment variables:

```bash
# In your .env or environment settings
VITE_PREVIEW_URL=https://ownaccessy.in
```

This is important for:
- Razorpay payment callbacks
- Email links
- Social sharing
- OAuth redirects

## DNS Configuration by Registrar

### If your domain is with GoDaddy:

1. Log in to GoDaddy account
2. Go to "My Products" → "Domains"
3. Click "DNS" next to ownaccessy.in
4. Click "Add" to add new record
5. Add the A record or CNAME as provided
6. Save changes

### If your domain is with another registrar:

**Namecheap:**
1. Dashboard → Domain List → Manage
2. Advanced DNS tab
3. Add new record

**Cloudflare:**
1. Select your domain
2. DNS tab
3. Add record
4. Make sure proxy is disabled (grey cloud) initially

**Other registrars:**
- Look for "DNS Management" or "DNS Settings"
- Add the A or CNAME record as provided

## SSL Certificate

✅ **Automatic SSL:** Your domain will automatically get a free SSL certificate (HTTPS) after DNS propagation.

**Timeline:**
- DNS propagation: 5 minutes to 48 hours (usually 1-2 hours)
- SSL certificate issuance: 5-15 minutes after DNS is verified

## Verification

### Check DNS Propagation

Use these tools to verify your DNS records are working:

1. **DNS Checker:** https://dnschecker.org/
   - Enter: ownaccessy.in
   - Check if A record points to correct IP

2. **Command Line:**
   ```bash
   # Check A record
   nslookup ownaccessy.in
   
   # Check CNAME (for www)
   nslookup www.ownaccessy.in
   ```

### Test Your Domain

Once DNS propagates:

1. Visit http://ownaccessy.in (will redirect to https://)
2. Visit https://ownaccessy.in
3. Verify SSL certificate is valid (padlock icon in browser)
4. Test all functionality:
   - Login/Registration
   - Property browsing
   - Token purchases (Razorpay)
   - Admin dashboard

## Troubleshooting

### Domain not loading

**Check:**
- DNS records are correct
- DNS has propagated (use dnschecker.org)
- Domain is added in application settings
- No typos in DNS records

**Solution:**
- Wait for DNS propagation (up to 48 hours)
- Clear browser cache
- Try incognito/private browsing
- Try different device/network

### SSL Certificate Issues

**Symptoms:**
- "Not Secure" warning
- Certificate error
- Mixed content warnings

**Solutions:**
- Wait 15 minutes after DNS propagation
- Make sure DNS points to correct IP
- Check that you're using HTTPS not HTTP
- Clear browser cache and cookies

### Razorpay Callback Issues

**After domain change:**

1. Update Razorpay dashboard:
   - Go to Settings → API Keys
   - Update webhook URL to: `https://ownaccessy.in/api/payments/verify`
   - Update authorized domains

2. Update environment variable:
   ```bash
   VITE_PREVIEW_URL=https://ownaccessy.in
   ```

### Email Links Not Working

**Update email templates** to use new domain:
- Welcome emails
- Password reset links
- Property unlock confirmations
- Payment confirmations

The application should automatically use the correct domain if `VITE_PREVIEW_URL` is set correctly.

## Post-Setup Checklist

### Immediate (After DNS Propagation)

- [ ] Domain loads successfully
- [ ] HTTPS works (SSL certificate valid)
- [ ] Homepage displays correctly
- [ ] Login/Registration works
- [ ] Properties page loads
- [ ] Admin dashboard accessible

### Configuration Updates

- [ ] Update `VITE_PREVIEW_URL` environment variable
- [ ] Update Razorpay webhook URL
- [ ] Update Razorpay authorized domains
- [ ] Test payment flow end-to-end
- [ ] Test email links
- [ ] Update any external integrations

### SEO & Marketing

- [ ] Submit sitemap to Google Search Console
- [ ] Update Google Analytics (if configured)
- [ ] Update social media links
- [ ] Update business cards/marketing materials
- [ ] Set up domain redirects (www → non-www or vice versa)

## Common DNS Record Examples

### Root Domain (ownaccessy.in)

```
Type: A
Host: @
Value: 123.45.67.89  # Example IP - use actual IP provided
TTL: 3600
```

### WWW Subdomain (www.ownaccessy.in)

```
Type: CNAME
Host: www
Value: ownaccessy.in
TTL: 3600
```

### Email Records (if needed)

If you're using email with your domain:

```
# MX Records for email
Type: MX
Host: @
Value: mail.youremailprovider.com
Priority: 10
TTL: 3600
```

## Support Resources

### GoDaddy Support
- **DNS Help:** https://www.godaddy.com/help/manage-dns-680
- **Domain Connection:** Check Airo/GoDaddy documentation
- **Support:** Contact GoDaddy support if issues persist

### Airo Platform Support
- Check platform documentation for domain setup
- Contact support if domain verification fails
- Review deployment logs for errors

## Timeline Summary

**Total Time: 1-48 hours (typically 2-3 hours)**

1. **Publish App:** 2-5 minutes
2. **Add DNS Records:** 5-10 minutes
3. **DNS Propagation:** 1-48 hours (usually 1-2 hours)
4. **SSL Certificate:** 5-15 minutes after DNS
5. **Testing & Verification:** 15-30 minutes

## Next Steps

### Ready to Proceed?

1. **First:** I can publish your application to production
2. **Then:** You'll receive the DNS records to add
3. **Finally:** Add records at your domain registrar
4. **Wait:** For DNS propagation and SSL certificate
5. **Test:** Verify everything works on your custom domain

---

**Status:** 📋 Ready to publish
**Domain:** ownaccessy.in
**Current URL:** https://qey66h1e3v.preview.c24.airoapp.ai
**Date:** January 9, 2026

**Would you like me to publish your application now?**
