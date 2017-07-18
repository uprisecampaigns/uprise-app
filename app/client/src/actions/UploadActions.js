import fetch from 'isomorphic-fetch';
import apolloClient from 'store/apolloClient';

import { urls } from 'config/config';

import { notify } from 'actions/NotificationsActions';

import FileUploadSignatureQuery from 'schemas/queries/FileUploadSignatureQuery.graphql';


export const START_UPLOAD = 'START_UPLOAD';
export const UPLOAD_SUCCESS = 'UPLOAD_SUCCESS';
export const UPLOAD_FAIL = 'UPLOAD_FAIL';

export function attemptUpload({ onSuccess, filePath, collectionName, collectionId, contentType, blob }) {
  return async (dispatch, getState) => {
    if (getState().uploads.uploading) {
      dispatch(notify('Already uploading file. Please try again after previous upload is finished.'));
      dispatch(uploadFail('Already uploading file'));
    } else {
      try {
        dispatch(startedUpload());

        const fileName = `${filePath}/${new Date().toISOString()}`;

        const signatureResponse = await apolloClient.query({
          query: FileUploadSignatureQuery,
          variables: {
            input: {
              fileName, collectionId, collectionName, contentType,
            },
          },
          fetchPolicy: 'network-only',
        });

        if (!signatureResponse.data.fileUploadSignature.url) {
          throw new Error('Error retrieving signed url from server.');
        }

        const signatureUrl = signatureResponse.data.fileUploadSignature.url;

        const uploadResponse = await fetch(signatureUrl, {
          method: 'PUT',
          body: blob,
          mode: 'cors',
          headers: {
            'Content-Type': contentType,
            'x-amz-acl': 'public-read',
          },
        });

        const newUrl = `${urls.s3}/${collectionName}/${collectionId}/${fileName}`;

        if (uploadResponse.ok) {
          onSuccess(newUrl);
          dispatch(notify('Upload success.'));
          dispatch(uploadSuccess(newUrl));
        } else {
          console.error(uploadResponse);
          // TODO: implement real error handler/callback
          onSuccess('');
          dispatch(notify('Upload failed. Please try again or contact help@uprise.org for help.'));
          dispatch(uploadFail(`Could not PUT file to S3: ${JSON.stringify(uploadResponse)}`));
        }
      } catch (err) {
        console.error(err);
        // TODO: implement real error handler/callback
        onSuccess('');
        dispatch(notify('Upload failed. Please try again or contact help@uprise.org for help.'));
        dispatch(uploadFail(err));
      }
    }
  };
}

export function startedUpload() {
  return { type: START_UPLOAD };
}

export function uploadSuccess(url) {
  return { type: UPLOAD_SUCCESS, url };
}

export function uploadFail(error) {
  return { type: UPLOAD_FAIL, error };
}

