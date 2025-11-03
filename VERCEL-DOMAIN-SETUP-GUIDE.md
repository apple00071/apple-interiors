# 🌐 Vercel Domain Setup Guide - Critical for SEO

## ⚠️ IMPORTANT: This Step is REQUIRED

The www redirect will NOT work without proper Vercel domain configuration. This is the most critical step for fixing your URL canonicalization issue.

---

## 📋 Overview

You need to configure TWO domains in Vercel:
1. **www.appleinteriors.in** (Primary domain - where all traffic goes)
2. **appleinteriors.in** (Redirect domain - redirects to www)

---

## 🎯 Step-by-Step Instructions

### **Step 1: Access Vercel Dashboard**

1. Go to: https://vercel.com/dashboard
2. Login with your Vercel account
3. Click on your `apple-interiors` project

---

### **Step 2: Navigate to Domains Settings**

1. Click on the **"Settings"** tab at the top
2. In the left sidebar, click on **"Domains"**
3. You'll see the domain management interface

---

### **Step 3: Add Primary Domain (www version)**

1. Click the **"Add"** button
2. Enter: `www.appleinteriors.in`
3. Click **"Add"**

Vercel will show you DNS configuration requirements. Keep this page open - you'll need these values.

**Expected DNS Records for www:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600 (or Auto)
```

---

### **Step 4: Add Redirect Domain (non-www version)**

1. Click the **"Add"** button again
2. Enter: `appleinteriors.in` (without www)
3. Click **"Add"**

**IMPORTANT:** When Vercel asks what to do with this domain, select:
- ✅ **"Redirect to www.appleinteriors.in"**
- ✅ Make sure "Permanent (301)" is selected

**Expected DNS Records for root domain:**
```
Type: A
Name: @ (or leave blank for root)
Value: 76.76.21.21
TTL: 3600 (or Auto)
```

---

### **Step 5: Configure DNS Records in Your Domain Registrar**

Now you need to add these DNS records in your domain registrar (GoDaddy, Namecheap, Google Domains, etc.)

#### **If using GoDaddy:**

1. Login to GoDaddy
2. Go to "My Products" → "Domains"
3. Click on `appleinteriors.in`
4. Click "DNS" or "Manage DNS"
5. Add/Edit the following records:

**Record 1 - CNAME for www:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 1 Hour
```

**Record 2 - A Record for root:**
```
Type: A
Name: @ (or leave blank)
Value: 76.76.21.21
TTL: 1 Hour
```

6. Click "Save"

#### **If using Namecheap:**

1. Login to Namecheap
2. Go to "Domain List"
3. Click "Manage" next to `appleinteriors.in`
4. Go to "Advanced DNS" tab
5. Add/Edit the following records:

**Record 1 - CNAME for www:**
```
Type: CNAME Record
Host: www
Value: cname.vercel-dns.com
TTL: Automatic
```

**Record 2 - A Record for root:**
```
Type: A Record
Host: @
Value: 76.76.21.21
TTL: Automatic
```

6. Click "Save All Changes"

#### **If using Cloudflare:**

⚠️ **IMPORTANT:** If using Cloudflare, you need to:
1. Set SSL/TLS mode to "Full" (not "Flexible")
2. Disable "Always Use HTTPS" (Vercel handles this)
3. Set proxy status to "DNS only" (gray cloud, not orange)

Then add records:
```
Type: CNAME
Name: www
Target: cname.vercel-dns.com
Proxy status: DNS only (gray cloud)

Type: A
Name: @
IPv4 address: 76.76.21.21
Proxy status: DNS only (gray cloud)
```

---

### **Step 6: Wait for DNS Propagation**

DNS changes can take 5 minutes to 48 hours to propagate, but usually it's 5-30 minutes.

**Check DNS propagation:**
- Use: https://dnschecker.org
- Enter: `www.appleinteriors.in`
- Should show CNAME pointing to `cname.vercel-dns.com`

---

### **Step 7: Verify in Vercel Dashboard**

1. Go back to Vercel Dashboard → Settings → Domains
2. Wait for Vercel to verify the domains (refresh the page)
3. You should see:

```
✅ www.appleinteriors.in
   Status: Valid
   Type: Production
   
🔀 appleinteriors.in
   Status: Valid
   Type: Redirect → www.appleinteriors.in
```

---

### **Step 8: Test the Redirects**

Open your browser and test these URLs:

1. **Test 1:** `http://appleinteriors.in`
   - Should redirect to: `https://www.appleinteriors.in`
   
2. **Test 2:** `https://appleinteriors.in`
   - Should redirect to: `https://www.appleinteriors.in`
   
3. **Test 3:** `http://www.appleinteriors.in`
   - Should redirect to: `https://www.appleinteriors.in`
   
4. **Test 4:** `https://www.appleinteriors.in`
   - Should load normally (no redirect)

**All tests should pass!** ✅

---

## 🔍 Troubleshooting

### **Problem: "Domain is not configured correctly"**

**Solution:**
- Check DNS records in your registrar
- Wait 30 minutes for DNS propagation
- Make sure CNAME points to `cname.vercel-dns.com` (not your old hosting)

---

### **Problem: "Redirect not working"**

**Solution:**
- Make sure you selected "Redirect to www" when adding the non-www domain
- Check that redirect type is "Permanent (301)"
- Clear browser cache and try in incognito mode
- Wait for DNS propagation

---

### **Problem: "SSL Certificate Error"**

**Solution:**
- Wait 5-10 minutes for Vercel to provision SSL certificate
- Make sure DNS is pointing to Vercel
- If using Cloudflare, set SSL mode to "Full"

---

### **Problem: "Both domains show same content (no redirect)"**

**Solution:**
- In Vercel Dashboard, remove the non-www domain
- Re-add it and make sure to select "Redirect" option
- Select "Permanent (301)" redirect type

---

## 📊 Expected Results

### **Before Configuration:**
```
❌ http://appleinteriors.in → Loads site (wrong)
❌ https://appleinteriors.in → Loads site (wrong)
❌ http://www.appleinteriors.in → Loads site (wrong)
✅ https://www.appleinteriors.in → Loads site (correct)
```

### **After Configuration:**
```
✅ http://appleinteriors.in → Redirects to https://www.appleinteriors.in
✅ https://appleinteriors.in → Redirects to https://www.appleinteriors.in
✅ http://www.appleinteriors.in → Redirects to https://www.appleinteriors.in
✅ https://www.appleinteriors.in → Loads site (no redirect)
```

---

## 🎓 Why This Matters for SEO

### **Without Proper Domain Configuration:**
- ❌ Google sees 2 separate websites
- ❌ Domain authority split 50/50
- ❌ Duplicate content penalties
- ❌ Backlinks don't consolidate
- ❌ Rankings suffer

### **With Proper Domain Configuration:**
- ✅ Google sees 1 canonical website
- ✅ 100% domain authority consolidated
- ✅ No duplicate content
- ✅ All backlinks count toward www version
- ✅ Rankings improve

---

## ✅ Verification Checklist

After completing all steps, verify:

- [ ] Both domains added in Vercel Dashboard
- [ ] www domain set as "Production"
- [ ] non-www domain set as "Redirect"
- [ ] DNS records configured in domain registrar
- [ ] DNS propagation complete (check dnschecker.org)
- [ ] Vercel shows both domains as "Valid"
- [ ] SSL certificates provisioned (green padlock)
- [ ] All 4 redirect tests pass
- [ ] No SSL errors
- [ ] Site loads correctly at https://www.appleinteriors.in

---

## 🚀 Next Steps After Domain Configuration

Once domains are configured and redirects are working:

1. ✅ Submit updated sitemap to Google Search Console
2. ✅ Request re-indexing of key pages
3. ✅ Update Google My Business URL
4. ✅ Monitor Search Console for improvements
5. ✅ Wait 2-4 weeks for ranking improvements

---

## 📞 Need Help?

### **Common Issues:**

**"I don't have access to DNS settings"**
- Contact your domain registrar support
- Or transfer DNS management to Vercel

**"DNS changes not taking effect"**
- Wait 24-48 hours for full propagation
- Clear browser cache
- Try different browser/device

**"Vercel not detecting my domain"**
- Double-check DNS records (no typos)
- Make sure you're editing the correct domain
- Contact Vercel support if needed

---

## 📚 Additional Resources

- Vercel Domains Documentation: https://vercel.com/docs/concepts/projects/domains
- DNS Checker Tool: https://dnschecker.org
- Vercel Support: https://vercel.com/support

---

**Status:** Follow this guide step-by-step for successful domain configuration.

**Time Required:** 15-30 minutes (plus DNS propagation time)

**Difficulty:** Medium (requires access to domain registrar)

---

**Last Updated:** November 3, 2025

