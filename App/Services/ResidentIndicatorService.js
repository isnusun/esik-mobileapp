import apisauce from 'apisauce'
import { Config } from 'App/Config'

function fetchData(userToken) {
  const apiClient = apisauce.create({
    baseURL: Config.API_URL,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    timeout: 3000,
  })
  const url = Config.GET_RESIDENT_INDICATOR
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

export const residentIndicatorService = {
  fetchData,
}
