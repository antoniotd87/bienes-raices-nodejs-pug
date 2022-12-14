import nodemailer from "nodemailer";
const emailRegistro = async (datos) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const { email, nombre, token } = datos;

  // enviar el email
  await transport.sendMail({
    from: "BienesRaices.com",
    to: email,
    subject: "Confirma tu cuenta en BienesRaices.com",
    text: "Confirma tu cuenta en BienesRaices.com",
    html: `
            <p>Hola ${nombre}, comprueba tu cuenta en bienes raices.com</p>
            <p>Tu Cuenta ya esta lista, solo debes confirmarla en el siguiente enlace
            <a href="${process.env.BACKEND_URL}:${
      process.env.PORT || 3000
    }/auth/confirmar/${token}">Confirmar Cuenta</a></p>
            <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>
    `,
  });

  console.log(datos);
};
const emailOlvidePassword = async (datos) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const { email, nombre, token } = datos;

  // enviar el email
  await transport.sendMail({
    from: "BienesRaices.com",
    to: email,
    subject: "Restablece tu password en BienesRaices.com",
    text: "Restablece tu password en BienesRaices.com",
    html: `
            <p>Hola ${nombre}, has solicitado reestablecer tu password en bienes raices.com</p>
            <p>Sigue el siguiente enlace para generar un password nuevo
            <a href="${process.env.BACKEND_URL}:${
      process.env.PORT || 3000
    }/auth/olvide-password/${token}">Reestablecer Password</a></p>
            <p>Si tu no solicitaste el cambio de password, puedes ignorar el mensaje</p>
    `,
  });

  console.log(datos);
};

export { emailRegistro, emailOlvidePassword };
