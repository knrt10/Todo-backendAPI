import { Response } from "../models";

export function completeRequest(promise: Promise<Response>): any {
  const x = promise.then((response) => {
    const finallResponse = {
      code: response.code,
      message: response.message,
      data: response.data,
    };
    return finallResponse;
  }).catch((errorRes) => {
    const finallResponse = {
      code: errorRes.code,
      message: errorRes.message,
      data: errorRes.data,
    };
    return finallResponse;
  });
  return x;
}
