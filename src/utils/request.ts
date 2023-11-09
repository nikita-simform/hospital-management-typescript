// Will be using AXIOS library for making calls to API from react...
// Documentation for:: https://www.npmjs.com/package/axios
import axios, { AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { getLocalStorage } from "./storage";
/**
 * [request description]
 * @param  {[string]} url       URL of the API which needs to be consumed by client
 * @param  {[string]} method    Method type of the API call currently GET,POST,PUT,DELETE is supported in order suport to more methods add method name to the array -> allowedMethodTypes
 * @param  {[JSON]} payload     Payload to be provided to server for sending data
 * @param  {[string]} headers   Request Headers required by the server side to process the API call
 * @return {[JSON]}             Response provided by the server side code
 */
interface Headers {
  [key: string]: string;
}

interface Payload {
  [key: string]: any;
}
export const request = (url:string, method:string, headers?:Headers, payload?:Payload, isTokenRequired?:boolean):Promise<AxiosResponse> => {
  return new Promise((resolve, reject) => {
    // Check for allowed method types for making a REST API call if not valid then throw an error...
    const allowedMethodTypes = ["get", "post", "put", "delete", "patch"];
    if (allowedMethodTypes.indexOf(method.toLowerCase()) < 0) {
      throw new Error(
        `Invalid method type please provide one of these methods... \n ${allowedMethodTypes}`
      );
    } else {
      if (isTokenRequired) {
        const token = getLocalStorage("token");
        headers.Authorization = "Bearer " + token;
      }
      axios({
        method,
        url,
        data: payload,
        headers,
      })
        .then((response:AxiosResponse) => {
          resolve(response);
        })
        .catch((error) => {
          if (error.response.status == 401) {
            const win: Window = window;
            win.location = "/login";
          } else {
            toast.error(
              error.response.data.error || error.response.data.message.error || error.response.data.message
            );
          }
          reject(error);
        });
    }
  });
};
