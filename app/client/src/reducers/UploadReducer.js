import {  START_UPLOAD, UPLOAD_FAIL, UPLOAD_SUCCESS } from 'actions/UploadActions';

const defaultStartState = { 
  uploading: false, 
  uploadedUrls: [],
  error: null,
  message: null
}

export function updateUploads(uploadsState = defaultStartState, action) {
  switch (action.type){
    
    case START_UPLOAD:
      return Object.assign({}, uploadsState, {
        uploading: true
      });

    case UPLOAD_FAIL:
      return Object.assign({}, uploadsState, {
        uploading: false,
        error: action.error
      });

    case UPLOAD_SUCCESS: 
      return Object.assign({}, uploadsState, {
        uploading: false,
        uploadedUrls: uploadsState.uploadedUrls.concat(action.url)
      });

    default: 
      return uploadsState;
  }
}
