import axios from "axios";

export const sendRecoveryMail = (email) => {
  axios
    .post('/api/users/reset-password', email)
    .then(res => {
      console.log(res.data);
      window.alert('Recovery link sent to Mailbox');
    })
    .catch(err => {
      console.log(err);
      window.alert('Error occurs while sending email')
    });
};
