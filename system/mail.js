var nodemailer = require('nodemailer');

module.exports = async function send({
    to,
    subject,
    from
}) {
    
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'auth@esperanto.network',
          pass: 'Ahojworld12'
        }
      });
      
      var mailOptions = {
        from,
        to,
        
        text: 'That was easy!'
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
}