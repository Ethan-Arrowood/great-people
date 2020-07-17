/* eslint-disable no-unused-vars */
import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { UserInfo } from '../models/UserInfo'
/* eslint-enable no-unused-vars */

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  const userInfo = context.req?.body as UserInfo

  if (userInfo && userInfo.userId === context.req?.params.userId) {
    context.bindings.userInfo = userInfo

    context.res = {
      body: `Saved profile for ${userInfo.userId}`
    }
  }
  else {
    context.res = {
      status: 400,
      body: 'Invalid user info'
    }
  }
}

export default httpTrigger
