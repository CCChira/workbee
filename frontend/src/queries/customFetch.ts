async function customFetch(input: RequestInfo, init?: RequestInit): Promise<Response> {
  const response = await fetch(input, init);
  if (response.status === 401) {

    const refreshed = await refreshToken();
    if (refreshed) {
      return fetch(input, init);
    }
  }
  return response;
}

