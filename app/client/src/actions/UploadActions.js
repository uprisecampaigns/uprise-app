import fetch from 'isomorphic-fetch';
import apolloClient from 'store/apolloClient';

import { urls } from 'config/config';

import { FileUploadSignature } from 'schemas/queries';


export const START_UPLOAD = 'START_UPLOAD';
export const UPLOAD_SUCCESS = 'UPLOAD_SUCCESS';
export const UPLOAD_FAIL = 'UPLOAD_FAIL';

export function attemptUpload({ onSuccess, filePath, collectionName, collectionId, contentType, blob }) {
  return async (dispatch, getState) => {

    if (!getState().uploads.uploading) {
      try {
        dispatch(startedUpload());

        const fileName = filePath + '/' + new Date().toISOString(); 

        const signatureResponse = await apolloClient.query({
          query: FileUploadSignature,
          variables: {
            input: { 
              fileName, collectionId, collectionName, contentType
            }
          },
          fetchPolicy: 'network-only',
        });

        if (signatureResponse.data.fileUploadSignature.url) {

        } else {

        }

        const signatureUrl = signatureResponse.data.fileUploadSignature.url;

        const uploadResponse = await fetch(signatureUrl, {
          method: 'PUT',
          body: blob,
          mode: 'cors',
          headers: {
            'Content-Type': contentType,
            'x-amz-acl': 'public-read'
          },
        });

        console.log(uploadResponse);

        const newUrl = urls.s3 + '/' + collectionName + '/' + collectionId + '/' + fileName;
        console.log(newUrl);

        if (uploadResponse.ok) {
          onSuccess(newUrl);
          dispatch(uploadSuccess(newUrl));
        } else {
          dispatch(uploadFail(uploadResponse));
        }

      } catch(err) {
        console.log(err);
        dispatch(uploadFail(err));
      }
    }
  }
}

export function startedUpload() {
  return { type: START_UPLOAD };
}

export function uploadSuccess(url) {
  return { type: UPLOAD_SUCCESS, url };
}

export function uploadFail() {
  return { type: UPLOAD_FAIL };
}

