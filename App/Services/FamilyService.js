import apisauce from 'apisauce'
import { Config } from 'App/Config'

function fetchData(page, userToken) {
  const apiClient = apisauce.create({
    baseURL: Config.API_URL,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    timeout: 3000,
  })
  const url = Config.GET_FAMILY + '?page=' + page
  apiClient.setHeader('Authorization', 'Bearer ' + userToken);
  return apiClient.get(url).then((response) => {
    // console.log(JSON.stringify(response))
    if (response.ok) {
      return response.data
    }
    return {
      status: 'failed',
      message: response.problem === 'NETWORK_ERROR' ? 'INTERNET TERPUTUS' : response.data.invalid
    }
  })
}

function postFamily(userToken, idbdt, data) {

  const apiClient = apisauce.create({
    baseURL: Config.API_URL,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    },
    timeout: 3000,
  })
  apiClient.setHeader('Authorization', 'Bearer ' + userToken);
  const form = new FormData()
  form.append("idbdt", idbdt);
  var len = data.length;
  for (let i = 0; i < len; i++) {
    let row = data[i]
    const { fi_id, answer } = row;
    form.append(fi_id, answer);
  }
  for (let i = 0; i < len; i++) {
    let row = data[i]
    const { fi_id, foto } = row;
    if (foto !== "{}") {
      foto = JSON.parse(foto)
      form.append('foto-' + fi_id, {
        name: foto.fileName,
        uri: 'file://' + foto.path,
        type: foto.type,
        latitude: foto.latitude,
        longitude: foto.longitude
      });
    }
  }

  // console.log(JSON.stringify(form))
  // return {
  //   status: 'OK',
  //   data: ''
  // }
  return apiClient.post(Config.POST_FAMILY,
    form).then((response) => {
      if (response.ok) {
        console.log('Success post answer' + response.data)
        return {
          status: 'ok',
          data: response.data
        }
      }
      console.log('something error' + response)
      return {
        status: 'failed',
        message: response
      }
    })
}

export const familyService = {
  fetchData, postFamily
}
