const emailTemplate = ({ title, body, footer }) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <style>
    body { margin: 0; padding: 0; background-color: #f8f9fa; font-family: ui-monospace, monospace; }
    .wrapper { max-width: 560px; margin: 40px auto; background-color: #e9ecef; border-radius: 16px; overflow: hidden; }
    .header { background-color: #adb5bd; padding: 24px 32px; }
    .header h1 { margin: 0; font-size: 20px; color: #212529; }
    .content { padding: 32px; color: #212529; font-size: 14px; line-height: 1.7; }
    .content p { margin: 0 0 16px; }
    .info-box { background-color: #dee2e6; border-radius: 10px; padding: 16px 20px; margin: 20px 0; font-size: 14px; }
    .info-box .row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #adb5bd; }
    .info-box .row:last-child { border-bottom: none; }
    .info-box .label { font-weight: 600; color: #6c757d; }
    .info-box .value { color: #212529; }
    .footer { padding: 16px 32px; font-size: 12px; color: #6c757d; border-top: 1px solid #dee2e6; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header"><h1>LinkPanel</h1></div>
    <div class="content">${body}</div>
    <div class="footer">${footer}</div>
  </div>
</body>
</html>
`;

module.exports = emailTemplate;
