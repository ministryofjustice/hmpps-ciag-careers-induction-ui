const plans = {
  A00001A: {
    request: {
      method: 'GET',
      urlPattern: '/ciag/A00001A',
    },
    response: {
      status: 400,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        status: 400,
        userMessage: 'CIAG profile does not exist',
      },
    },
  },
  G6115VJ: {
    request: {
      method: 'GET',
      urlPattern: '/ciag/G6115VJ',
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        offenderId: 'G6115VJ',
      },
    },
  },
}

export default plans
