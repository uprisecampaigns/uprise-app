import {  START_UPLOAD, UPLOAD_FAIL, UPLOAD_SUCCESS } from 'actions/UploadActions';

const defaultStartState = { 
  uploadedUrl: null,
  uploading: false, 
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
        uploading: false
      });

    case UPLOAD_SUCCESS: 
      return Object.assign({}, uploadsState, {
        uploading: false,
        uploadedUrl: action.url
      });

    default: 
      return uploadsState;
  }
}
