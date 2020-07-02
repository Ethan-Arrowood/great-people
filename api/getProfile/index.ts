import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { UserInfo } from "../models/UserInfo";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const userId = req.params.userId;
    const userInfo: UserInfo = <UserInfo>(context.bindings.userInfo);

    context.log.info(`getProfile called for ${userId}`)
    if (userId && userInfo) {
        context.res = {
            // status: 200, /* Defaults to 200 */
            body: userInfo
        };
    }
    else {
        context.res = {
            status: 400,
            body: "Oops I didn't catch your userId"
        };
    }
};

export default httpTrigger;
