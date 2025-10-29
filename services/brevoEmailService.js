// Serviço de email usando API HTTP do Brevo (alternativa ao SMTP bloqueado)
const axios = require('axios');

/**
 * Envia email usando API REST do Brevo (não usa SMTP)
 * @param {string} to - Email destinatário
 * @param {string} subject - Assunto
 * @param {string} htmlContent - Conteúdo HTML
 * @param {string} from - Email e nome do remetente
 */
async function sendEmailViaBrevoAPI(to, subject, htmlContent, from = null) {
  const apiKey = process.env.BREVO_API_KEY;
  
  if (!apiKey) {
    throw new Error('BREVO_API_KEY não configurada');
  }

  const fromEmail = from || process.env.EMAIL_FROM || 'gustavo.fraga@unifebe.edu.br';
  
  // Parse do email e nome se vier no formato "Nome <email@domain.com>"
  let senderEmail = fromEmail;
  let senderName = 'ACAPRA';
  
  const match = fromEmail.match(/^(.+?)\s*<(.+?)>$/);
  if (match) {
    senderName = match[1].trim();
    senderEmail = match[2].trim();
  }

  try {
    const response = await axios.post(
      'https://api.brevo.com/v3/smtp/email',
      {
        sender: {
          name: senderName,
          email: senderEmail
        },
        to: [
          {
            email: to
          }
        ],
        subject: subject,
        htmlContent: htmlContent
      },
      {
        headers: {
          'accept': 'application/json',
          'api-key': apiKey,
          'content-type': 'application/json'
        },
        timeout: 10000 // 10 segundos
      }
    );

    console.log(`✅ Email enviado via Brevo API para ${to}`);
    return response.data;
  } catch (error) {
    console.error('❌ Erro ao enviar email via Brevo API:', error.response?.data || error.message);
    throw error;
  }
}

module.exports = {
  sendEmailViaBrevoAPI
};
