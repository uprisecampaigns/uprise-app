import React, { PropTypes } from 'react';
import { connect } from 'react-redux'
import { withApollo } from 'react-apollo';
import RaisedButton from 'material-ui/RaisedButton';
import Dropzone from 'react-dropzone';
import ReactCrop from 'react-image-crop';

import 'react-image-crop/dist/ReactCrop.css';

import { attemptUpload } from 'actions/UploadActions';

import { base64ToBlob } from 'lib/base64ToBlob';

import s from 'styles/ImageUploader.scss';


class ImageUploader extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      imageSrc: props.imageSrc || null,
      editImageSrc: null,
      imageCrop: {
        width: 90,
        height: 90,
        x: 5,
        y: 5,
        aspect: 1,
      },
    };
  }
  
  static propTypes = {
    imageSrc: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    imageUploadOptions: PropTypes.object.isRequired
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.imageSrc) {
      this.setState({ imageSrc: nextProps.imageSrc });
    }
  }

  onDrop = (acceptedFiles, rejectedFiles) => {
    console.log('received files');
    console.log(acceptedFiles);

    //TODO: 
    // - handle accepted vs rejected files!!
    // - check for image types

    const fileReader = new FileReader();

    fileReader.onload = (event) => {
      this.setState({ editImageSrc: event.target.result });
    };

    fileReader.onerror = (event) => {
      console.error(event);
    };

    fileReader.readAsDataURL(acceptedFiles[0]);
  }

  imageCropChange = (crop, pixelCrop) => {
    const newCrop = Object.assign({}, crop, { aspect: 1 });
    this.setState({ imageCrop: newCrop });
  }

  loadImage = (src, callback) => {
    let image = new Image();
    image.onload = (e) => {
      callback(image);
      image = null;
    };

    image.src = src;
  }

  acceptImageCrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const crop = this.state.imageCrop;

    this.loadImage(this.state.editImageSrc, (loadedImg) => {
      const imageWidth = loadedImg.naturalWidth;
      const imageHeight = loadedImg.naturalHeight;

      const cropX = (crop.x / 100) * imageWidth;
      const cropY = (crop.y / 100) * imageHeight;

      const cropWidth = (crop.width / 100) * imageWidth;
      const cropHeight = (crop.height / 100) * imageHeight;

      const canvas = document.createElement('canvas');
      canvas.width = cropWidth;
      canvas.height = cropHeight;
      const ctx = canvas.getContext('2d');

      ctx.drawImage(loadedImg, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);

      const uploadBlob = (blob) => {
        this.props.dispatch(attemptUpload({ 
          onSuccess: this.props.onChange,
          ...this.props.imageUploadOptions, 
          contentType: 'image/jpeg', 
          blob 
        }));
 
        this.setState({ 
          editImageSrc: null,
        });
      }

      if (HTMLCanvasElement.prototype.toBlob) {

        canvas.toBlob(uploadBlob);
          //TODO: Is `revokeObjectURL` important??
          //      would I have access to `onload`
          //      from a refs object?
          // imgDest.onload = function() {
          //   URL.revokeObjectURL(url);
          //   this.ready();
          // };
      } else {

        const url = canvas.toDataURL('image/jpeg');

        this.props.onChange(url);

        const blob = base64ToBlob(url);

        uploadBlob(blob);
      }
    });
  }

  cancelImageEdit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    this.setState({ editImageSrc: null });
  }

  render() {
    const { ...props } = this.props;
    const { imageSrc, editImageSrc, imageCrop, ...state } = this.state;

    return (

      <div className={s.imageUploadContainer}>
        { editImageSrc ? (
          <div className={s.cropContainer}>
            <div className={s.reactCropContainer}>
              <ReactCrop 
                className={s.reactCrop}
                src={editImageSrc} 
                onComplete={this.imageCropChange}
                crop={imageCrop}
              />
            </div>
            <div className={s.buttonContainer}>
              <RaisedButton 
                className={s.button}
                onTouchTap={this.cancelImageEdit} 
                label="Cancel Crop" 
              />
              <RaisedButton 
                className={s.button}
                onTouchTap={this.acceptImageCrop} 
                primary={true} 
                label="Save Changes" 
              />
            </div>
          </div>
        ) : (
          <Dropzone 
            className={s.fileDropContainer}
            onDrop={this.onDrop}
            multiple={false}
          >
            { imageSrc ? (
              <img src={imageSrc}/>
            ): (
              <div>Drag and drop your image here, or click to select an image to upload.</div>
            )}
          </Dropzone>
        )}

      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    uploading: state.uploads.uploading,
    error: state.uploads.error,
  };
}

export default connect(mapStateToProps)(withApollo(ImageUploader));
