import axios from "axios";

export const savePartData = (data) => {
  axios
    .post('/api/data/save', data)
    .then(res => {
      console.log(res.data);
      window.alert('Data Saved Successfully');
    })
    .catch(err =>
      window.alert('Error occurs while saving data')
  );
};
