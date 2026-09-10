export const verificationEmail = (name: string, verificationUrl: string) => ({
    text: ` Hi ${name},

Welcome to Prisma Blog!

Please verify your email address by clicking the link below:

${verificationUrl}

Thanks,
Prisma Blog Team
`,

    html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email</title>
</head>

<body style="margin:0;padding:0;background:#f4f7f6;font-family:Arial,sans-serif;">

    <table width="100%" cellpadding="0" cellspacing="0"
        style="background:#f4f7f6;padding:40px 15px;">
        <tr>
            <td align="center">

                <table width="100%" cellpadding="0" cellspacing="0"
                    style="max-width:600px;background:#fff;border-radius:12px;">

                    <tr>
                        <td align="center"
                            style="background:#111827;padding:30px;">
                            <h1 style="color:#fff;margin:0;">
                                Prisma Blog
                            </h1>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:40px 35px;">

                            <h2>Verify your email address</h2>

                            <p>
                                Hi <strong>${name}</strong>,
                            </p>

                            <p>
                                Thanks for creating an account with
                                <strong>Prisma Blog</strong>.
                                Please verify your email address.
                            </p>

                            <div style="text-align:center;margin:30px 0;">
                                <a href="${verificationUrl}"
                                    style="
                                        display:inline-block;
                                        padding:14px 28px;
                                        background:#2563eb;
                                        color:#fff;
                                        text-decoration:none;
                                        border-radius:8px;
                                    ">
                                    Verify My Email
                                </a>
                            </div>

                            <p>
                                If the button doesn't work, use this link:
                            </p>

                            <p style="word-break:break-all;">
                                <a href="${verificationUrl}">
                                    ${verificationUrl}
                                </a>
                            </p>

                            <p style="color:#9ca3af;font-size:13px;">
                                If you didn't create an account,
                                you can safely ignore this email.
                            </p>

                        </td>
                    </tr>

                    <tr>
                        <td align="center"
                            style="padding:25px;background:#f9fafb;">
                            <p style="color:#6b7280;font-size:13px;">
                                © ${new Date().getFullYear()} Prisma Blog.
                                All rights reserved.
                            </p>
                        </td>
                    </tr>

                </table>

            </td>
        </tr>
    </table>

</body>
</html>
`
});
