# Admin Credentials

## Admin Account Details

**Created:** January 9, 2026

### Login Information

```
📧 Email: admin@ownaccessy.com
👤 Username: admin
🔑 Password: Admin@098
👑 Role: admin
🪙 Token Balance: 1000 tokens
🔗 Referral Code: 3469574F081D
```

### Access URLs

- **Login Page:** https://qey66h1e3v.preview.c24.airoapp.ai/login
- **Dashboard:** https://qey66h1e3v.preview.c24.airoapp.ai/dashboard (shows admin or user view based on role)
- **Properties:** https://qey66h1e3v.preview.c24.airoapp.ai/properties

## Admin Capabilities

### Property Management
- ✅ Add new properties
- ✅ Edit existing properties
- ✅ Delete properties
- ✅ Toggle property active/inactive status
- ✅ Bulk upload properties via CSV/Excel
- ✅ View all property listings

### User Management
- ✅ View all registered users
- ✅ See user token balances
- ✅ Monitor user roles
- ✅ Track user registration dates

### Payment & Token Management
- ✅ View all token purchases
- ✅ Monitor payment transactions
- ✅ Track payment status
- ✅ View transaction amounts

### Analytics Dashboard
- ✅ Revenue trends (30-day chart)
- ✅ User growth metrics
- ✅ Property unlock statistics
- ✅ Token distribution analysis
- ✅ Popular properties ranking
- ✅ Recent transactions log
- ✅ Conversion rate tracking
- ✅ Average token balance

### Token Transaction Logs
- ✅ View all token activities
- ✅ Filter by transaction type (purchase/unlock/referral)
- ✅ Track property unlocks
- ✅ Monitor referral bonuses

## Security Notes

⚠️ **IMPORTANT SECURITY RECOMMENDATIONS:**

1. **Change Default Password**
   - Login and change password immediately after first use
   - Use a strong, unique password
   - Enable 2FA if available

2. **Protect Credentials**
   - Never share admin credentials
   - Don't commit this file to public repositories
   - Store credentials in a secure password manager

3. **Monitor Activity**
   - Regularly review admin dashboard logs
   - Check for suspicious user activity
   - Monitor payment transactions

4. **Access Control**
   - Only grant admin access to trusted personnel
   - Use separate accounts for different admins
   - Revoke access when no longer needed

## Creating Additional Admin Users

To create more admin users:

### Option 1: Via Script
```bash
# Edit scripts/create-admin.ts with new credentials
npm run create-admin
```

### Option 2: Via Database
```sql
-- Update existing user to admin
UPDATE users 
SET role = 'admin' 
WHERE email = 'user@example.com';
```

### Option 3: Via Registration + Database
1. Register normally at /register
2. Update role in database to 'admin'
3. User can now access admin dashboard

## Troubleshooting

### Can't Login?
- ✅ Verify email is exactly: `admin@ownaccessy.com`
- ✅ Password is case-sensitive: `Admin@098`
- ✅ Clear browser cache and cookies
- ✅ Try incognito/private browsing mode

### Admin Dashboard Not Accessible?
- ✅ Verify user role is 'admin' in database
- ✅ Check JWT token is valid
- ✅ Ensure you're logged in
- ✅ Navigate to /dashboard (admin view will show automatically)

### Forgot Password?
- Currently no password reset feature
- Reset via database:
  ```bash
  # Generate new hash
  node -e "console.log(require('bcryptjs').hashSync('NewPassword123', 10))"
  
  # Update in database
  UPDATE users SET password = '<hash>' WHERE email = 'admin@ownaccessy.com';
  ```

## Token Balance

Admin account starts with **1000 tokens** for testing:
- Use tokens to unlock properties
- Test the unlock flow
- Verify PDF/Excel downloads
- Test payment integration

## Next Steps

1. ✅ **Login** at https://qey66h1e3v.preview.c24.airoapp.ai/login
2. ✅ **Change Password** in account settings
3. ✅ **Add Properties** via admin dashboard
4. ✅ **Configure Razorpay** API keys for payments
5. ✅ **Test Platform** end-to-end
6. ✅ **Monitor Analytics** in admin dashboard

---

**Last Updated:** January 9, 2026  
<<<<<<< HEAD
**Platform:** OwnAccessy.in - Real Estate Token Platform  
=======
**Platform:** ownaccessy - Real Estate Token Platform  
>>>>>>> 20260118033327-qey66h1e3v
**Preview URL:** https://qey66h1e3v.preview.c24.airoapp.ai
