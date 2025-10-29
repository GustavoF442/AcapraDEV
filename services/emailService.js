const nodemailer = require('nodemailer');

// Configurar transporter de email
const createEmailTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: false, // true para 465, false para outras portas
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

// Templates de email
const emailTemplates = {
  // Template para confirmação de envio de adoção
  adoptionConfirmation: (data) => ({
    subject: `Confirmação de Solicitação de Adoção - ${data.animalName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
          .content { background-color: #f9f9f9; padding: 20px; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #777; }
          .button { background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; display: inline-block; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🐾 ACAPRA</h1>
            <h2>Confirmação de Solicitação de Adoção</h2>
          </div>
          <div class="content">
            <p>Olá <strong>${data.adopterName}</strong>,</p>
            
            <p>Recebemos sua solicitação de adoção para <strong>${data.animalName}</strong>!</p>
            
            <p><strong>Detalhes da solicitação:</strong></p>
            <ul>
              <li><strong>Animal:</strong> ${data.animalName}</li>
              <li><strong>Data:</strong> ${new Date().toLocaleDateString('pt-BR')}</li>
              <li><strong>Status:</strong> Pendente de análise</li>
            </ul>
            
            <p>Nossa equipe irá analisar sua solicitação e entraremos em contato em breve através do email <strong>${data.adopterEmail}</strong> ou telefone <strong>${data.adopterPhone}</strong>.</p>
            
            <p>O processo de adoção inclui:</p>
            <ol>
              <li>Análise da solicitação</li>
              <li>Entrevista (presencial ou por videochamada)</li>
              <li>Visita ao local (quando necessário)</li>
              <li>Finalização da adoção</li>
            </ol>
            
            <p>Agradecemos seu interesse em adotar e dar um lar cheio de amor!</p>
            
            <p>Com carinho,<br><strong>Equipe ACAPRA</strong></p>
          </div>
          <div class="footer">
            <p>Este é um email automático, por favor não responda.</p>
            <p>Para dúvidas, entre em contato através do nosso site.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  // Template para notificação de recebimento (para ACAPRA)
  adoptionReceived: (data) => ({
    subject: `Nova Solicitação de Adoção - ${data.animalName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #2196F3; color: white; padding: 20px; text-align: center; }
          .content { background-color: #f9f9f9; padding: 20px; }
          .info-box { background-color: white; padding: 15px; margin: 10px 0; border-left: 4px solid #2196F3; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>🔔 Nova Solicitação de Adoção</h2>
          </div>
          <div class="content">
            <div class="info-box">
              <h3>Animal: ${data.animalName}</h3>
              <p><strong>ID:</strong> ${data.animalId}</p>
            </div>
            
            <div class="info-box">
              <h3>Dados do Solicitante</h3>
              <p><strong>Nome:</strong> ${data.adopterName}</p>
              <p><strong>Email:</strong> ${data.adopterEmail}</p>
              <p><strong>Telefone:</strong> ${data.adopterPhone}</p>
              ${data.city ? `<p><strong>Cidade:</strong> ${data.city}</p>` : ''}
            </div>
            
            <div class="info-box">
              <h3>Motivação</h3>
              <p>${data.motivation}</p>
            </div>
            
            <p><strong>Data da solicitação:</strong> ${new Date().toLocaleString('pt-BR')}</p>
            
            <p>Acesse o painel administrativo para mais detalhes e para gerenciar esta solicitação.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  // Template para status atualizado
  adoptionStatusUpdate: (data) => ({
    subject: `Atualização da sua Solicitação de Adoção - ${data.animalName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #FF9800; color: white; padding: 20px; text-align: center; }
          .content { background-color: #f9f9f9; padding: 20px; }
          .status { padding: 15px; margin: 20px 0; text-align: center; font-size: 18px; font-weight: bold; }
          .status.aprovado { background-color: #4CAF50; color: white; }
          .status.em-analise { background-color: #2196F3; color: white; }
          .status.rejeitado { background-color: #f44336; color: white; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>📋 Atualização da Solicitação</h2>
          </div>
          <div class="content">
            <p>Olá <strong>${data.adopterName}</strong>,</p>
            
            <p>Houve uma atualização no status da sua solicitação de adoção para <strong>${data.animalName}</strong>.</p>
            
            <div class="status ${data.status.toLowerCase().replace(' ', '-')}">
              Novo Status: ${data.status.toUpperCase()}
            </div>
            
            ${data.notes ? `
              <div style="background-color: white; padding: 15px; margin: 20px 0;">
                <h3>Observações:</h3>
                <p>${data.notes}</p>
              </div>
            ` : ''}
            
            ${data.status === 'aprovado' ? `
              <p>🎉 <strong>Parabéns!</strong> Sua solicitação foi aprovada! Em breve entraremos em contato para agendar a entrega do animal.</p>
            ` : data.status === 'em análise' ? `
              <p>Sua solicitação está sendo analisada por nossa equipe. Entraremos em contato em breve.</p>
            ` : data.status === 'rejeitado' ? `
              <p>Infelizmente, não foi possível aprovar sua solicitação neste momento. Agradecemos seu interesse.</p>
            ` : ''}
            
            <p>Para qualquer dúvida, entre em contato conosco.</p>
            
            <p>Atenciosamente,<br><strong>Equipe ACAPRA</strong></p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  // Template para confirmação de doação
  donationConfirmation: (data) => ({
    subject: 'Confirmação de Doação - ACAPRA',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #E91E63; color: white; padding: 20px; text-align: center; }
          .content { background-color: #f9f9f9; padding: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>❤️ ACAPRA</h1>
            <h2>Obrigado pela sua Doação!</h2>
          </div>
          <div class="content">
            <p>Olá <strong>${data.donorName}</strong>,</p>
            
            <p>Recebemos sua doação com muito carinho e gratidão!</p>
            
            <p><strong>Detalhes da doação:</strong></p>
            <ul>
              <li><strong>Tipo:</strong> ${data.donationType}</li>
              ${data.amount ? `<li><strong>Valor:</strong> R$ ${data.amount}</li>` : ''}
              <li><strong>Data:</strong> ${new Date().toLocaleDateString('pt-BR')}</li>
            </ul>
            
            ${data.description ? `<p><strong>Descrição:</strong> ${data.description}</p>` : ''}
            
            <p>Sua contribuição é essencial para que possamos continuar nosso trabalho de resgate e cuidado com os animais.</p>
            
            <p>Com gratidão,<br><strong>Equipe ACAPRA</strong></p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  // Template para lembrete de evento
  eventReminder: (data) => ({
    subject: `Lembrete: ${data.eventName} - ACAPRA`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #9C27B0; color: white; padding: 20px; text-align: center; }
          .content { background-color: #f9f9f9; padding: 20px; }
          .event-info { background-color: white; padding: 15px; margin: 15px 0; border-left: 4px solid #9C27B0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>📅 Lembrete de Evento</h2>
          </div>
          <div class="content">
            <div class="event-info">
              <h3>${data.eventName}</h3>
              <p><strong>Data:</strong> ${data.eventDate}</p>
              <p><strong>Horário:</strong> ${data.eventTime}</p>
              ${data.location ? `<p><strong>Local:</strong> ${data.location}</p>` : ''}
            </div>
            
            ${data.description ? `<p>${data.description}</p>` : ''}
            
            <p>Contamos com sua presença!</p>
            
            <p>Atenciosamente,<br><strong>Equipe ACAPRA</strong></p>
          </div>
        </div>
      </body>
      </html>
    `
  })
};

// Função principal para enviar email
const sendEmail = async (to, templateName, data) => {
  try {
    const transporter = createEmailTransporter();
    const template = emailTemplates[templateName](data);

    const mailOptions = {
      from: `ACAPRA <${process.env.EMAIL_FROM}>`,
      to: to,
      subject: template.subject,
      html: template.html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email enviado:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Erro ao enviar email:', error);
    return { success: false, error: error.message };
  }
};

// Função para enviar email simples (sem template)
const sendSimpleEmail = async (to, subject, html, replyTo = null) => {
  try {
    const transporter = createEmailTransporter();

    const mailOptions = {
      from: `ACAPRA <${process.env.EMAIL_FROM}>`,
      to: to,
      subject: subject,
      html: html,
      replyTo: replyTo
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email enviado:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Erro ao enviar email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendEmail,
  sendSimpleEmail,
  emailTemplates
};
