function getEmailTemplate(resetToken: string) {
  const domain = process.env.NEXT_PUBLIC_Domain;
  const resetLink = `${domain}/admin/reset-password/${resetToken}`;
  const logoUrl = `${domain}/images/Logo.png`;
  const homepageUrl = domain;

  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; padding: 30px;">
      <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1); padding: 30px;">
        
        <!-- Logo -->
        <div style="text-align: center; margin-bottom: 30px;">
          <img src="${logoUrl}" alt="Company Logo" style="max-width: 150px;" />
        </div>

        <!-- Heading -->
        <h2 style="color: #333;">Reset Your Password</h2>
        <p style="color: #555; line-height: 1.6;">
          We received a request to reset your password. Click the button below to set a new one.
        </p>

        <!-- Button -->
        <div style="text-align: center; margin: 30px 0;">
          <a
            href="${resetLink}"
            style="
              display: inline-block;
              background-color: #007bff;
              color: white;
              padding: 12px 25px;
              font-size: 16px;
              border-radius: 6px;
              text-decoration: none;
            "
          >
            Reset Password
          </a>
        </div>

        <p style="color: #888; font-size: 14px;">
          If you did not request a password reset, no action is required. You can safely ignore this email.
        </p>

        <!-- Footer -->
        <hr style="margin: 40px 0; border: none; border-top: 1px solid #eee;" />
        <p style="text-align: center; color: #aaa; font-size: 12px;">
          &copy; ${new Date().getFullYear()} Your Company Name | 
          <a href="${homepageUrl}" style="color: #007bff; text-decoration: none;">Bonous9ja</a>
        </p>
      </div>
    </div>
  `;
}

export default getEmailTemplate;
