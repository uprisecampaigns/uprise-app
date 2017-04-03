import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import moment from 'moment';
import Dropzone from 'react-dropzone';
import ReactCrop from 'react-image-crop';
import TextField from 'material-ui/TextField';
import CircularProgress from 'material-ui/CircularProgress';
import RaisedButton from 'material-ui/RaisedButton';

import Link from 'components/Link';

import 'react-image-crop/dist/ReactCrop.css';

import s from 'styles/Organize.scss';


class CampaignProfileForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editImageSrc: null,
      imageCrop: {
        aspect: 1
      },
      croppedImageSrc: null
    };
  }

  static propTypes = {
    data: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired, 
    formSubmit: PropTypes.func.isRequired,
    handleInputChange: PropTypes.func.isRequired,
    saving: PropTypes.bool,
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

  acceptImageCrop = () => {
    console.log(this.state);
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
          const url = URL.createObjectURL(blob);

          this.setState({ 
            croppedImageSrc: url,
            editImageSrc: null
          });

          //TODO: Is `revokeObjectURL` important??
          // imgDest.onload = function() {
          //   URL.revokeObjectURL(url);
          //   this.ready();
          // };
        });
      } else {
        this.setState({ 
          croppedImageSrc: canvas.toDataURL('image/jpeg'),
          editImageSrc: null
        });
      }
    });
  }

  cancelImageEdit = () => {
    this.setState({ editImageSrc: null });
  }

  render() {

    const { data, formSubmit, errors,
            handleInputChange, saving, ...props } = this.props;

    return (
      <div className={s.outerContainer}>
        <div className={s.editCampaignProfileContainer}>

          <div className={s.imageUploadContainer}>
            { this.state.editImageSrc ? (
              <div>
                <ReactCrop 
                  src={this.state.editImageSrc} 
                  onComplete={this.imageCropChange}
                  crop={this.state.imageCrop}
                />
                <RaisedButton 
                  onTouchTap={this.cancelImageEdit} 
                  label="Cancel Crop" 
                />
                <RaisedButton 
                  onTouchTap={this.acceptImageCrop} 
                  primary={true} 
                  label="Save Changes" 
                />
              </div>
            ) : (
              <Dropzone 
                onDrop={this.onDrop}
                multiple={false}
              >
                { this.state.croppedImageSrc ? (
                  <img src={this.state.croppedImageSrc}/>
                ): (
                  <div>Drag and drop your profile image here, or click to select an image to upload.</div>
                )}
              </Dropzone>
            )}

          </div>

          <div className={s.editTitleContainer}>
            <TextField
              value={data.title}
              hintText="Campaign Public Title"
              onChange={ (event) => { handleInputChange(event, 'title', event.target.value) } }
              errorText={errors.titleErrorText}
              fullWidth={true}
              underlineShow={false}
            />
          </div>

          <div className={s.editMapUrlContainer}>
            <TextField
              className={s.textField}
              value={data.mapUrl}
              hintText="Map Url"
              onChange={ (event) => { handleInputChange(event, 'mapUrl', event.target.value) } }
              errorText={errors.mapUrlErrorText}
              fullWidth={true}
              underlineShow={false}
            />
          </div>

          <div className={s.editWebsiteUrlContainer}>
            <TextField
              value={data.websiteUrl}
              hintText="Website Url"
              onChange={ (event) => { handleInputChange(event, 'websiteUrl', event.target.value) } }
              errorText={errors.websiteUrlErrorText}
              fullWidth={true}
              underlineShow={false}
            />
          </div>

          <div className={s.editDescriptionContainer}>
            <TextField
              name="description"
              hintText="Write a short description here. This will show up in the search results. You do not need to include the name of the campaign, your website url, or your issues, keywords, etc. as they will all appear automatically"
              value={data.description}
              multiLine={true}
              onChange={ (event) => { handleInputChange(event, 'description', event.target.value) } }
              errorText={errors.descriptionErrorText}
              fullWidth={true}
            />
          </div>

          { saving ? (

            <div className={s.savingThrobberContainer}>
              <CircularProgress
                size={100}
                thickness={5}
              />
            </div>
          ) : (

            <div className={[s.organizeButton, s.button].join(' ')}>
              <RaisedButton 
                onTouchTap={formSubmit} 
                primary={true} 
                type="submit"
                label="Save Changes" 
              />
            </div>
          )}

        </div>
      </div>
    );
;
  }
}

export default CampaignProfileForm;
