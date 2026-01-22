# Quick Start: Testing Payment Flow

## 🚀 Quick Setup (5 minutes)

### Step 1: Get Razorpay Test Keys
1. Go to https://dashboard.razorpay.com/
2. Sign up (free)
3. Settings → API Keys → Generate Test Keys
4. Copy:
   - Key ID (starts with `rzp_test_`)
   - Key Secret

### Step 2: Configure in Admin Dashboard
1. Login as admin: `/login`
   - Email: `admin@ownaccessy.in`
   - Password: Check `ADMIN_CREDENTIALS.md`

2. Go to **Configure** tab
3. Paste Razorpay keys
4. Click **Save Configuration**
5. ✅ Success toast appears

### Step 3: Test Payment (2 minutes)
1. Logout and login as regular user
2. Go to `/pricing`
3. Click **Buy** on any package
4. Use test card: `4111 1111 1111 1111`
5. Expiry: `12/25`, CVV: `123`
6. Click **Pay**
7. ✅ Token balance updates immediately in header!

## 🎯 What to Verify

### After Payment:
- ✅ Token balance increases in header (no page refresh)
- ✅ Redirected to dashboard with success message
- ✅ Transaction appears in Transactions tab

### After Property Unlock:
- ✅ Token balance decreases in header (no page refresh)
- ✅ Owner details revealed
- ✅ Download buttons enabled

## 🧪 Test Cards

| Card Number         | Result  |
|---------------------|----------|
| 4111 1111 1111 1111 | ✅ Success |
| 4000 0000 0000 0002 | ❌ Fails   |

## 📚 Full Documentation

For complete testing guide, see:
- **PAYMENT_FLOW_TESTING_GUIDE.md** - Complete step-by-step guide
- **DYNAMIC_TOKEN_UPDATES.md** - Technical implementation details
- **RAZORPAY_CONFIGURATION.md** - Configuration documentation

## 🆘 Common Issues

**"Razorpay not configured"**
→ Go to admin Configure tab and save keys

**Token balance not updating**
→ Check browser console for errors
→ Verify JWT token is valid

**Payment modal doesn't open**
→ Verify Razorpay key ID is correct
→ Check it starts with `rzp_test_`

## ✅ Ready for Production?

1. Replace test keys with live keys (`rzp_live_`)
2. Test with small real payment (₹1)
3. Enable HTTPS
4. Monitor Razorpay dashboard

---

**Need Help?** Check `PAYMENT_FLOW_TESTING_GUIDE.md` for detailed instructions.
