/* eslint-disable no-unused-vars */
import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { UserInfo } from '../models/UserInfo'
/* eslint-enable no-unused-vars */

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  const userId = req.params.userId
  const userInfo = context.bindings.userInfo as UserInfo

  context.log.info(`getProfile called for ${userId}`)
  if (userId && userInfo) {
    context.res = {
      body: userInfo
    }
  } else {
    context.res = {
      status: 400,
      body: 'Oops I didn\'t catch your userId'
    }
  }
}

export default httpTrigger
