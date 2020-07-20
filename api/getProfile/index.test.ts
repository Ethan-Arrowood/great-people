import httpTrigger from '.'
import { UserInfo } from '../models/UserInfo'
import { Context, HttpRequest } from '@azure/functions' 
import { Substitute } from '@fluffy-spoon/substitute'

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

  const context = Substitute.for<Context>() as Context
  (context.req as any).returns({ req: request });
  (context.bindings as any).returns({ userInfo: user });

  const response = await httpTrigger(context, request)

  expect(response.status as UserInfo).toBe(200)
})
