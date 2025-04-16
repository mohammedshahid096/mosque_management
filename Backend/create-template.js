const {
  SESClient,
  CreateTemplateCommand,
  GetTemplateCommand,
  SendTemplatedEmailCommand,
} = require("@aws-sdk/client-ses");
const dotenv = require("dotenv");
//   env load
dotenv.config();

const SESClientConfig = {
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
};

const welcomeTemplate = {
  Template: {
    TemplateName: "WelcomeMosqueTemplateWithMosqueName",
    SubjectPart: "Welcome to Mosque Management System",
    HtmlPart: `
         <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to Mosque Management</title>
            <style>
                /* Reset and Base Styles */
                * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                }
                
                body {
                font-family: Arial, sans-serif;
                background-color: #f3f4f6;
                color: #4b5563;
                line-height: 1.5;
                padding: 20px;
                }
                
                /* Container Styles */
                .email-container {
                max-width: 600px;
                margin: 32px auto;
                background-color: #ffffff;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }
                
                /* Header Styles */
                .header {
                background-color: #047857;
                padding: 24px;
                text-align: center;
                }
                
                .header h1 {
                color: #ffffff;
                font-size: 24px;
                font-weight: bold;
                }
                
                .header p {
                color: #d1fae5;
                margin-top: 8px;
                }
                
                /* Image Container */
                .image-container {
                width: 100%;
                background-color: #ecfdf5;
                padding: 16px;
                display: flex;
                justify-content: center;
                }
                
                .mosque-image {
                height: 160px;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                
                /* Main Content */
                .content {
                padding: 24px;
                color: #4b5563;
                }
                
                .content h2 {
                font-size: 22px;
                font-weight: 600;
                color: #047857;
                margin-bottom: 16px;
                }
                
                .content p {
                margin-bottom: 16px;
                }
                
                /* Features Box */
                .features-box {
                background-color: #ecfdf5;
                padding: 16px;
                border-radius: 8px;
                margin-bottom: 24px;
                }
                
                .features-box h3 {
                font-size: 18px;
                font-weight: 500;
                color: #065f46;
                margin-bottom: 8px;
                }
                
                .features-box ul {
                list-style-type: disc;
                padding-left: 20px;
                color: #047857;
                }
                
                .features-box li {
                margin-bottom: 4px;
                }
                
                /* Button Styles */
                .button-container {
                text-align: center;
                margin: 24px 0;
                }
                
                .button {
                display: inline-block;
                background-color: #059669;
                color: #ffffff;
                font-weight: 500;
                padding: 8px 24px;
                border-radius: 9999px;
                text-decoration: none;
                transition: background-color 0.3s;
                }
                
                .button:hover {
                background-color: #047857;
                }
                
                /* Contact Info */
                .contact-info {
                color: #059669;
                text-decoration: none;
                }
                
            
                
                /* Footer Styles */
                .footer {
                background-color: #065f46;
                padding: 24px;
                text-align: center;
                color: #d1fae5;
                }
                
                .footer p {
                margin-bottom: 8px;
                }
                
                .footer .small-text {
                font-size: 14px;
                }
                
                .footer-links {
                margin-top: 16px;
                }
                
                .footer-links a {
                color: #ffffff;
                text-decoration: none;
                margin: 0 8px;
                }
                
                .footer-links a:hover {
                color: #a7f3d0;
                }
                
                .divider {
                color: #10b981;
                }
                
                /* Responsive Styles */
                @media (min-width: 768px) {
                .header h1 {
                    font-size: 28px;
                }
                
                .mosque-image {
                    height: 192px;
                }
                
                .content {
                    padding: 32px;
                }
                
                .content h2 {
                    font-size: 24px;
                }
                
                .links-grid {
                    grid-template-columns: repeat(3, 1fr);
                }
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <!-- Header -->
                <div class="header">
                <h1>Welcome to Mosque Management</h1>
                <p>السلام عليكم ورحمة الله وبركاته</p>
                </div>

                <!-- Mosque Image -->
                <div class="image-container">
                <img src="https://github.com/mohammedshahid096/mosque_management/blob/master/frontend/src/assets/images/home1.png?raw=true alt="Mosque" class="mosque-image">
                </div>

                <!-- Main Content -->
                <div class="content">
                <h2>Registration Successful!</h2>
                
                <p>Dear {{mosque_name}}</p>
                
                <p>Alhamdulillah! We are pleased to welcome you to our Mosque Management System. Your registration has been successfully completed, and you now have access to all the features and resources available on our platform.</p>
                
                <div class="features-box">
                    <h3>What You Can Do Now:</h3>
                    <ul>
                    <li>Access prayer times and important announcements</li>
                    <li>Register for community events and programs</li>
                    <li>Contribute to mosque donations online</li>
                    <li>Connect with community members</li>
                    <li>Access Islamic resources and educational materials</li>
                    </ul>
                </div>
                
                <p>To get started, simply log in using your registered email and password. Our user-friendly interface will guide you through the various features available.</p>
                
                <div class="button-container">
                    <a href="https://mosque-management-dev.vercel.app/login" class="button">Log In to Your Account</a>
                </div>
                
                <p>If you have any questions or need assistance, please don't hesitate to contact our support team at <a href="mailto:mohammedshahidnagodriya@gmail.com" class="contact-info">mohammedshahidnagodriya@gmail.com</a> or call us at <a href="tel:+919347222304" class="contact-info">(+91) 9347 222 304</a>.</p>
                <p>May Allah bless you and your family,</p>
                <p style="font-weight: 500; color: #047857;">The Mosque Management Team</p>
                </div>

            

                <!-- Footer -->
                <div class="footer">
                <p>© 2025 Mosque Management System</p>
                <div class="footer-links">
                    <a href="#">Privacy Policy</a>
                    <span class="divider">|</span>
                    <a href="#">Terms of Service</a>
                    <span class="divider">|</span>
                    <a href="#">Unsubscribe</a>
                </div>
                </div>
            </div>
        </body>
    </html>
    `,
    TextPart: `Welcome to Mosque Management System!`,
  },
};

async function createTemplateFunction(template_to_create) {
  try {
    const sesClient = new SESClient(SESClientConfig);
    const createTemplate = new CreateTemplateCommand(template_to_create);
    const response = await sesClient.send(createTemplate);
    console.log("Template created successfully:", response);
  } catch (error) {
    console.error("Error starting server:", error);
  }
}

async function getEmailTemplateFunction(templateName) {
  const sesClient = new SESClient(SESClientConfig);
  const getTemplate = new GetTemplateCommand({
    TemplateName: templateName,
  });
  const response = await sesClient.send(getTemplate);
  console.log("Template fetched successfully:", response);
}

async function sendEmailFunction(sesTemplate, recipientEmail) {
  try {
    const sesClient = new SESClient(SESClientConfig);
    const sendTemplate = new SendTemplatedEmailCommand({
      Source: process.env.AWS_SES_SENDER,
      Template: sesTemplate,
      Destination: {
        ToAddresses: [recipientEmail],
      },
      TemplateData: JSON.stringify({
        mosque_name: "Masjid Al-Haram",
      }),
    });

    const response = await sesClient.send(sendTemplate);
    console.log("Email sent successfully:", response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
// createTemplateFunction(welcomeTemplate);
// getEmailTemplateFunction("WelcomeMosqueTemplate");
sendEmailFunction(
  "WelcomeMosqueTemplateWithMosqueName",
  "www.mohdshahid303@gmail.com"
);
