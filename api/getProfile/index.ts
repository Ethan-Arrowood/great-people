import { AzureFunction, Context, HttpRequest } from "@azure/functions"

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');
    const name = req.params.userId;

    if (name) {
        context.res = {
            // status: 200, /* Defaults to 200 */
            body:
                { 
                    "userId": req.params.userId,
                    "aboutMe": "I'm me",
                    "interests": "interesting stuff",
                    "skills": "lots and lots of skills"
                }
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
