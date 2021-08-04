import apisauce from 'apisauce'
import { Config } from 'App/Config'

function attemptLogin(username, password) {
  const authApiClient = apisauce.create({
    baseURL: Config.API_URL,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    timeout: 3000,
  })
  return authApiClient.post(Config.LOGIN,
    {
      userid: username,
      passwd: password,
    }).then((response) => {
      if (response.ok) {
        return response.data
      }
      return {
        status: 'failed',
        message: response.problem === 'NETWORK_ERROR' ? 'INTERNET TERPUTUS' : response.data.invalid
      }
    })
}

function updateProfile(userToken, nama, email, nohp, foto) {
  const authApiClient = apisauce.create({
    baseURL: Config.API_URL,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    timeout: 3000,
  })
  authApiClient.setHeader('Authorization', 'Bearer ' + userToken);
  const form = new FormData()
  if (JSON.stringify(foto) !== "{}") {
    authApiClient.setHeaders({
      'Content-Type': 'multipart/form-data',
      'Authorization': 'Bearer ' + userToken
    });
    form.append('foto', {
      name: foto.fileName,
      uri: 'file://' + foto.path,
      type: foto.type
    });
  }
  form.append('nama', nama);
  form.append('email', email);
  form.append('nohp', nohp);

  return authApiClient.post(Config.UPDATE_PROFILE,
    form).then((response) => {
      if (response.ok) {
        return response.data
      }
      return {
        status: 'failed',
        message: response.problem === 'NETWORK_ERROR' ? 'INTERNET TERPUTUS' : response.data.invalid
      }
    })
}

export const authService = {
  attemptLogin, updateProfile
}
