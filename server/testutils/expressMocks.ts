/* eslint-disable @typescript-eslint/no-explicit-any */
const expressMocks = () => ({
  req: {
    session: {
      data: {},
    },
    context: {},
    params: {},
    query: {},
    body: {},
  } as any,
  res: {
    render: jest.fn(),
    redirect: jest.fn(),
    locals: {},
  } as any,
  next: jest.fn(),
})

export default expressMocks
