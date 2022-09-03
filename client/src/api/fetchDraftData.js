import axios from "./config/axios"

export default async function fetchDraftData() {
  const response = await axios.get('/draft/data')
  return response.data
}