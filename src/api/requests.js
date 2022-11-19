import axios from "axios";

axios.defaults.baseURL = 'http://localhost:8000/'

const uploadFile = (form, onSuccess, onFailed) => {
    axios({
        url: 'question_pack',
        method: 'POST',
        data: form,
        headers: { "Content-Type": "multipart/form-data" }
    })
    .then(onSuccess)
    .catch(onFailed);
}