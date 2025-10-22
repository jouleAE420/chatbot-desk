export const emailValidationHTML = (link: string, email: string): string =>
    `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Validation</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #142142;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #142142; padding: 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #2F3234; border-radius: 8px; padding: 20px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <tr>
                        <td align="center" style="padding: 20px 0;">
                            <img src="https://b2park.com.mx/wp-content/uploads/2024/08/sikker-logo.png" alt="Logo" style="max-width: 150px; width: 100%; height: auto;">
                        </td>
                    </tr>
                    <!-- Title -->
                    <tr>
                        <td align="center" style="font-size: 28px; color: #66d43d; margin: 20px 0; text-align: center; font-weight: bold;">
                            <!-- Variable de TypeScript: título -->
                            Validate your email
                        </td>
                    </tr>
                    <!-- Body Text -->
                    <tr>
                        <td style="font-size: 20px; color: #FFFFFF; margin: 20px 0; line-height: 1.6; text-align: justify; font-weight: bold;">
                            Click on the flollowing link to validate your email\n
                        </td>
                    </tr>
                    <!-- Button -->
                    <tr>
                        <td align="center" style="padding: 20px 0;">
                            <a href="${link}" style="display: inline-block; background-color: #00b300; color: #000000; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-size: 18px; font-weight: bold;">
                                Validate Email ${email}
                            </a>
                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td align="center" style="font-size: 14px; color: #66d43d; margin-top: 40px;">
                            <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
                            <p><a href="${link}" style="color: #00b300; text-decoration: none; font-weight: bold;">Visita nuestro sitio web</a></p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;
export const emailTicketHTML = (phone: string, title: string, body: string): string =>
    `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Correo Atractivo</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #11145c;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #11145c; padding: 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #3c3c3c; border-radius: 8px; padding: 20px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <tr>
                        <td align="center" style="padding: 20px 0;">
                            <img src="https://accessone.com.mx/images/logo.jpg" alt="Logo" style="max-width: 150px; width: 100%; height: auto;">
                        </td>
                    </tr>
                    <!-- Title -->
                    <tr>
                        <td align="center" style="font-size: 28px; color: #ffcc0a; margin: 20px 0; text-align: center; font-weight: bold;">
                            <!-- Variable de TypeScript: título -->
                            ${title}
                        </td>
                    </tr>
                    <!-- Body Text -->
                    <tr>
                        <td style="font-size: 20px; color: #FFFFFF; margin: 20px 0; line-height: 1.6; text-align: justify; font-weight: bold;">
                            Haz recibido un nuevo comentario, por favor brinda atencion lo antes posible al cliente:\n
                        </td>
                    </tr>
                    <tr>
                        <td style="font-size: 20px; color: #FFFFFF; margin: 20px 0; line-height: 1.6; text-align: justify;font-weight: bold;">
                            ${phone}
                        </td>
                    </tr>
                    <tr>
                        <td style="font-size: 18px; color: #FFFFFF; margin: 20px 0; line-height: 1.6; text-align: justify;">
                            ${body}
                        </td>
                    </tr>
                    <!-- Button -->
                    <tr>
                        <td align="center" style="padding: 20px 0;">
                            <a href="https://wa.me/${phone}" style="display: inline-block; background-color: #00b300; color: #000000; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-size: 18px; font-weight: bold;">
                                Enviar WhatsApp
                            </a>
                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td align="center" style="font-size: 14px; color: #ffcc0a; margin-top: 40px;">
                            <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
                            <p><a href="https://accessone.com.mx" style="color: #ffff8a; text-decoration: none; font-weight: bold;">Visita nuestro sitio web</a></p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;
