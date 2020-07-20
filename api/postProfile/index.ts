/* eslint-disable no-unused-vars */
import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { UserInfo } from '../models/UserInfo'
/* eslint-enable no-unused-vars */

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<any> {
  const userInfo = req.body as UserInfo

  if (userInfo && userInfo.userId === req.params.userId) {
    context.bindings.userInfo = userInfo

    return {
      body: `Saved profile for ${userInfo.userId}`
    }
  } else {
    return {
      status: 400,
      body: 'Invalid user info'
    }
  }
}

export default httpTrigger
