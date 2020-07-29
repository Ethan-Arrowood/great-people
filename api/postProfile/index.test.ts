/* eslint-disable no-unused-vars */
import httpTrigger from '.'
import { UserInfo } from '../models/UserInfo'
import { Context, HttpRequest, Logger } from '@azure/functions'
/* eslint-enable no-unused-vars */

test('Http trigger should return known text', async () => {
  const user = {
    userId: 'pete',
    aboutMe: 'about',
    interests: 'interests',
    skills: 'skills'
  } as UserInfo

  const request = {
    method: 'POST',
    url: '',
    headers: {},
    query: {},
    body: user,
    params: {
      userId: user.userId
    }
  } as HttpRequest

  const context = {
    req: request,
    bindings: { userInfo: user },
    invocationId: '',
    log: {
      error: () => { },
      info: () => { },
      verbose: () => { },
      warn: () => { }
    } as Logger,
    done: () => { },
    executionContext: {
      invocationId: '',
      functionName: '',
      functionDirectory: ''
    },
    bindingData: {},
    bindingDefinitions: [],
    traceContext: {
      attributes: {},
      traceparent: null,
      tracestate: null
    }
  } as Context

  const response = await httpTrigger(context, request)

  expect(response.status).toBe(200)
})
