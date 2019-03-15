export default async function sendRequest(apiRequest, data, config) {
  const response = {
    success: undefined,
    failure: undefined,
  };

  try {
    const res = await apiRequest(data, config);

    response.success = res.data;

    return response;
  } catch (e) {
    response.failure = e.response.data;

    return response;
  }
}
