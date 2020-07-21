/* eslint-disable no-unused-vars */
import httpTrigger from '.'
import { UserInfo } from '../models/UserInfo'
import { Context, HttpRequest, Logger } from '@azure/functions'
/* eslint-enable no-unused-vars */

test('Http trigger should return known text', async () => {
  const request = {
    method: 'GET',
    url: '',
    headers: {},
    query: {},
    params: { userId: 'pete' }
  } as HttpRequest

  const user = {
    userId: 'pete',
    aboutMe: 'about',
    interests: 'interests',
    skills: 'skills'
  } as UserInfo

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

  expect(response.status as UserInfo).toBe(200)
})
