import { UAParser } from "ua-parser-js";

export const magicLinkEmailTemplate = (
  magicLink: string,
  userAgent: string,
) => {
  const parser = new UAParser(userAgent);
  const uaResult = parser.getResult();
  const browser = uaResult.browser.name || "Unknown Browser";
  const os = uaResult.os.name || "Unknown OS";
  const time = new Date().toLocaleString("en-US", { timeZoneName: "short" });

  const template = `
  <!doctype html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Your Magic Link</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: "Courier New", Courier, monospace;
          background-color: #ffffff;
          color: #000000;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          border-radius: 8px;
          padding: 30px;
          text-align: center;
          color: #000000;
          font-family: "Courier New", Courier, monospace;
        }
        .logo {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
          margin-bottom: 20px;
        }
        .logo img {
          height: 32px;
        }
        .logo span {
          font-weight: bold;
          margin-left: 5px;
          font-size: 20px;
          color: #000000;
        }
        .header {
          font-size: 22px;
          font-weight: bold;
          margin-bottom: 12px;
        }
        .content {
          font-size: 16px;
          margin-bottom: 24px;
          color: #000000;
        }
        .btn {
          display: inline-block;
          background-color: #000000;
          color: #ffffff !important;
          text-decoration: none;
          padding: 12px 28px;
          border-radius: 6px;
          font-weight: bold;
          transition: background-color 0.3s ease;
          font-family: "Courier New", Courier, monospace;
        }
        .btn:hover {
          background-color: #333333;
        }
        .raw-link {
          margin-top: 20px;
          font-size: 14px;
          color: #000000;
          word-break: break-all;
          text-align: left;
          font-family: "Courier New", Courier, monospace;
        }
        .raw-link a {
          color: #000000;
          text-decoration: underline;
        }
        .info-box {
          background-color: #f3f4f6;
          padding: 15px;
          border-radius: 6px;
          margin-top: 20px;
          text-align: left;
          color: #000000;
          font-size: 14px;
          font-family: "Courier New", Courier, monospace;
        }
        .footer {
          font-size: 13px;
          color: #000000;
          margin-top: 20px;
          font-family: "Courier New", Courier, monospace;
        }
        @media screen and (max-width: 600px) {
          .container {
            padding: 20px;
          }
          .btn {
            width: 100%;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">

          <span>Nexsume.ai</span>
        </div>
        <div class="header">Hi, here’s your magic link</div>
        <div class="content">
          Click the button below to securely log in. This magic link will expire in 20 minutes.
        </div>
        <a href="${magicLink}" class="btn">Login to Nexsume.ai</a>
        <div class="raw-link">
          If the button doesn't work, copy and paste this URL into your browser:<br />
          <a href="${magicLink}">${magicLink}</a>
        </div>
        <div class="info-box">
          This login was requested using <strong>${browser} on ${os}</strong> at <strong>${time}</strong>.
        </div>
        <div class="footer">
          You are receiving this email because you signed up for Nexsume.ai.<br /><br />
          &copy; ${new Date().getFullYear()} Nexsume.ai. All rights reserved.
        </div>
      </div>
    </body>
  </html>
  `;
  return template;
};
