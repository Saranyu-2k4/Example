# Email Configuration Guide for Findora

## Important: OTP is sent to EMAIL, not Phone!

The phone number field during signup is **optional** and only used for contact information. All OTP codes are sent via **email**.

## Setup Gmail for OTP Emails

### Step 1: Enable 2-Factor Authentication

1. Go to your Google Account: https://myaccount.google.com/
2. Click on **Security** in the left sidebar
3. Under "How you sign in to Google", click **2-Step Verification**
4. Follow the prompts to enable 2FA

### Step 2: Generate App Password

1. After enabling 2FA, go back to **Security** settings
2. Under "How you sign in to Google", click **App passwords**
3. Select app: Choose **Mail**
4. Select device: Choose **Other (Custom name)**
5. Enter name: Type "Findora"
6. Click **Generate**
7. **Copy the 16-character password** (format: xxxx xxxx xxxx xxxx)

### Step 3: Update .env File

Open `backend/.env` and update:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_actual_gmail@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
```

**Replace:**
- `your_actual_gmail@gmail.com` with your Gmail address
- `xxxx xxxx xxxx xxxx` with the app password from Step 2

### Step 4: Restart Backend Server

After updating .env, restart the backend:

```powershell
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

## Testing Email OTP

1. **Sign up** with a valid email address
2. Check your email inbox (and spam folder!)
3. You'll receive an email with a 6-digit OTP
4. Enter the OTP on the verify-email page
5. Your account will be activated

## Common Issues

### "Error sending email"
- Check if EMAIL_USER and EMAIL_PASSWORD are correct
- Make sure you used an App Password, not your regular password
- Verify 2FA is enabled on your Google account

### "Email not received"
- Check spam/junk folder
- Wait a few minutes (sometimes delayed)
- Click "Resend OTP" button
- Verify the email address is correct

### "Invalid OTP"
- OTP expires after 10 minutes
- Make sure you're entering the most recent OTP
- Try requesting a new OTP

## Alternative: Use a Test Email Service

For development/testing, you can use services like:
- **Mailtrap.io** (free testing inbox)
- **MailHog** (local email testing)

### Using Mailtrap:

1. Sign up at https://mailtrap.io
2. Get SMTP credentials from your inbox
3. Update .env:

```env
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=your_mailtrap_username
EMAIL_PASSWORD=your_mailtrap_password
```

## Security Notes

- Never commit your .env file to Git
- App passwords are safer than regular passwords
- Change app passwords regularly
- Revoke unused app passwords

## Need Help?

If you continue to have issues:
1. Check backend terminal for error messages
2. Verify database connection is working
3. Test with a different email address
4. Check firewall/antivirus isn't blocking SMTP
