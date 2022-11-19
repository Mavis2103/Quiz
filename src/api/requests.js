import axios from "axios";

axios.defaults.baseURL = 'http://localhost:8000/'

export const uploadFile = (form, onSuccess, onFailed) => {
    axios({
        url: 'question_pack',
        method: 'POST',
        data: form,
        headers: { "Content-Type": "multipart/form-data" }
    })
    .then(onSuccess)
    .catch(onFailed);
}

export const getLessons = (onSuccess, onFailed) => {
    axios.get('question_pack')
    .then(onSuccess)
    .catch(onFailed)
}

export const getQuestion = (id, onSuccess, onFailed) => {
    axios.get(`question_pack/${id}`)
    .then(onSuccess)
    .catch(onFailed)
}