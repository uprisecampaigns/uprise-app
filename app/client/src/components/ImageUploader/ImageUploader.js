import React, { PropTypes } from 'react';
import { connect } from 'react-redux'
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import CircularProgress from 'material-ui/CircularProgress';
import Dropzone from 'react-dropzone';
import ReactCrop from 'react-image-crop';

import 'react-image-crop/dist/ReactCrop.css';

import scale from 'lib/scale';

import { notify } from 'actions/NotificationsActions';
import { attemptUpload } from 'actions/UploadActions';

import { base64ToBlob } from 'lib/base64ToBlob';

import s from 'styles/ImageUploader.scss';


class ImageUploader extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      imageSrc: props.imageSrc || null,
      editImageSrc: null,
      uploading: false,
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
    imageUploadOptions: PropTypes.object.isRequired,
    imageHeight: PropTypes.number,
    imageWidth: PropTypes.number
  };

  componentWillReceiveProps(nextProps) {
    if (typeof nextProps.imageSrc !== 'undefined') {
      this.setState({ imageSrc: nextProps.imageSrc });
    }
  }

  onDrop = (acceptedFiles, rejectedFiles) => {

    const { dispatch, ...props } = this.props;

    const file = acceptedFiles[0];
    if (!acceptedFiles.length) {
      dispatch(notify('There was an error with your file. Please check that it is a valid image and try again'));
    } else if (!file.type.match('image.*')) {
      dispatch(notify('File must be an image'));
    } else {
      //TODO:
      // - handle accepted vs rejected files!!
      const fileReader = new FileReader();

      fileReader.onload = (event) => {
        this.setState({ editImageSrc: event.target.result });
      };

      fileReader.onerror = (event) => {
        console.error(event);
      };

      fileReader.readAsDataURL(file);
    }
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

    this.setState({ uploading: true });

    this.loadImage(this.state.editImageSrc, (loadedImg) => {
      const imageWidth = loadedImg.naturalWidth;
      const imageHeight = loadedImg.naturalHeight;

      const cropX = (crop.x / 100) * imageWidth;
      const cropY = (crop.y / 100) * imageHeight;

      const cropWidth = (crop.width / 100) * imageWidth;
      const cropHeight = (crop.height / 100) * imageHeight;

      let destWidth = cropWidth;
      let destHeight = cropHeight;

      if (this.props.imageWidth && this.props.imageHeight) {
        // TODO: handle scaling just width or just height?
        const scaledCrop = scale({
          width: cropWidth,
          height: cropHeight,
          maxWidth: this.props.imageWidth,
          maxHeight: this.props.imageHeight
        });

        destWidth = scaledCrop.width;
        destHeight = scaledCrop.height;
      }

      const canvas = document.createElement('canvas');
      canvas.width = destWidth;
      canvas.height = destHeight;
      const ctx = canvas.getContext('2d');

      ctx.drawImage(loadedImg, cropX, cropY, cropWidth, cropHeight, 0, 0, destWidth, destHeight);

      const uploadBlob = (blob) => {
        this.props.dispatch(attemptUpload({
          ...this.props.imageUploadOptions,
          contentType: 'image/jpeg',
          blob,
          onSuccess: (src) => {
            this.setState({ uploading: false });
            this.props.onChange(src);
          }
        }));

        this.setState({
          editImageSrc: null,
        });
      }

      if (HTMLCanvasElement.prototype.toBlob) {

        //TODO: Is `revokeObjectURL` important??
        canvas.toBlob( (blob) => {
          uploadBlob(blob);
          const url = URL.createObjectURL(blob);
          this.props.onChange(url);
        });

      } else {

        const url = canvas.toDataURL('image/jpeg');
        this.props.onChange(url);

        const blob = base64ToBlob(url);
        uploadBlob(blob);
      }
    });
  }

  cancelImageEdit = (event) => {
    event.stopPropagation();
    event.preventDefault();
    this.setState({ editImageSrc: null });
  }

  removeImage = (event) => {
    event.stopPropagation();
    event.preventDefault();
    this.props.onChange('');
  }

  render() {
    const { ...props } = this.props;
    const { imageSrc, editImageSrc, imageCrop, uploading, ...state } = this.state;

    return (

      <div className={s.imageUploadContainer}>
        { editImageSrc ? (
          <div className={s.cropContainer}>
            { uploading ? (
              <div className={s.uploadingThrobberContainer}>
                <CircularProgress
                  size={100}
                  thickness={5}
                />
              </div>
            ) : (
              <div>
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
                    label="Cancel"
                  />
                  <RaisedButton
                    className={s.primaryButton}
                    onTouchTap={this.acceptImageCrop}
                    primary={true}
                    label="Accept"
                  />
                </div>
              </div>
            )}
          </div>
        ) : (
          <Dropzone
            className={s.fileDropContainer}
            onDrop={this.onDrop}
            multiple={false}
          >
            { imageSrc ? (
              <div>
                <FontIcon
                  className={[s.removeImageButton, 'material-icons'].join(' ')}
                  onTouchTap={this.removeImage}
                >delete</FontIcon>
                <img src={imageSrc}/>
              </div>
            ): (
              <div className={s.instructions}>Drag and drop your image here, or click to select an image to upload.</div>
            )}

            <FontIcon className={[s.addImageButton, 'material-icons'].join(' ')}>add_a_photo</FontIcon>
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

export default connect(mapStateToProps)(ImageUploader);
