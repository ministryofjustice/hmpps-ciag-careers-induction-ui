const plans = {
  A00001A: {
    request: {
      method: 'GET',
      urlPattern: '/ciag/induction/A00001A',
    },
    response: {
      status: 404,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        status: 404,
        userMessage: 'CIAG profile does not exist',
      },
    },
  },
  G6115VJ: {
    request: {
      method: 'GET',
      urlPattern: '/ciag/induction/G6115VJ',
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
