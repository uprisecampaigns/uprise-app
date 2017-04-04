import React, { PropTypes } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Dropzone from 'react-dropzone';
import ReactCrop from 'react-image-crop';

import s from 'styles/ImageUploader.scss';

import 'react-image-crop/dist/ReactCrop.css';


class ImageUploader extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      imageSrc: props.imageSrc || null,
      editImageSrc: null,
      imageCrop: {
        width: 100,
        height: 100,
        x: 0,
        y: 0,
        aspect: 1,
      },
    };
  }
  
  static propTypes = {
    handleInputChange: PropTypes.func.isRequired,
    imageSrc: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
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

      if (HTMLCanvasElement.prototype.toBlob) {

        canvas.toBlob( (blob) => {

          const fileReader = new FileReader();

          fileReader.onload = (event) => {
            this.props.onChange(event.target.result);

            this.setState({ 
              editImageSrc: null
            });
          };

          fileReader.onerror = (event) => {
            console.error(event);
          };

          fileReader.readAsDataURL(blob);

          //TODO: Is `revokeObjectURL` important??
          //      would I have access to `onload`
          //      from a refs object?
          // imgDest.onload = function() {
          //   URL.revokeObjectURL(url);
          //   this.ready();
          // };
        });
      } else {


        const url = canvas.toDataURL('image/jpeg');
        this.setState({ 
          editImageSrc: null,
        });
        this.props.onChange(url);

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

export default ImageUploader;
