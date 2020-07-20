import httpTrigger from '.'
import { UserInfo } from '../models/UserInfo'
import { Context, HttpRequest } from '@azure/functions' 
import { Substitute } from '@fluffy-spoon/substitute'

test('Http trigger should return known text', async () => {
    const user = {
      userId: 'pete',
      aboutMe: 'about',
      interests: 'interests',
      skills: 'skills'
    } as UserInfo

    const reques = {
      method: 'POST',
      url: '',
      headers: {},
      query: {},
      body: user,
      params: {
        userId: user.userId
      }
    }

  const request = Substitute.for<HttpRequest>();
  (request.method as any).returns('POST');
  (request.body as any).returns(user);
  (request.params as any)({ userId: user.userId });

  const context = Substitute.for<Context>() as Context
  (context.req as any).returns({ req: request })

  const response = await httpTrigger(context, request)

  expect(response.status).toBe(400)
})
