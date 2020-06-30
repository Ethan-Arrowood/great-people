import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { BlobServiceClient, BlobDownloadResponseModel } from "@azure/storage-blob"

interface UserInfo {
    userId: string;
    aboutMe: string;
    interests: string;
    skills: string;
}

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');
    const userId = req.params.userId;

    if (userId) {
        const STORAGE_CONNECTION_STRING = process.env.STORAGE_CONNECTION_STRING || "";
        const blobServiceClient = BlobServiceClient.fromConnectionString(STORAGE_CONNECTION_STRING);
        const containerClient = blobServiceClient.getContainerClient("profiles");

        const blockBlobClient = containerClient.getBlockBlobClient(userId + ".json");
        const downloadBlockBlobResponse: BlobDownloadResponseModel = await blockBlobClient.download(0);
        const userInfoString = await streamToString(downloadBlockBlobResponse.readableStreamBody!);
        const userInfo: UserInfo = JSON.parse(userInfoString);

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

// A helper method used to read a Node.js readable stream into string
async function streamToString(readableStream: NodeJS.ReadableStream): Promise<string> {
    return new Promise((resolve, reject) => {
        const chunks: string[] = [];
        readableStream.on("data", (data) => {
            chunks.push(data.toString());
        });
        readableStream.on("end", () => {
            resolve(chunks.join(""));
        });
        readableStream.on("error", reject);
    });
}

export default httpTrigger;
