import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import moment from 'moment';
import TextField from 'material-ui/TextField';
import CircularProgress from 'material-ui/CircularProgress';
import RaisedButton from 'material-ui/RaisedButton';

import ImageUploader from 'components/ImageUploader';
import Link from 'components/Link';

import s from 'styles/Organize.scss';


class CampaignProfileForm extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    data: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired, 
    formSubmit: PropTypes.func.isRequired,
    campaignId: PropTypes.string.isRequired,
    handleInputChange: PropTypes.func.isRequired,
    saving: PropTypes.bool,
  }

  render() {

    const { data, formSubmit, errors, campaignId,
            handleInputChange, saving, ...props } = this.props;

    return (
      <div className={s.outerContainer}>
        <div className={s.editCampaignProfileContainer}>

          <ImageUploader 
            onChange={ (imgSrc) => { handleInputChange(undefined, 'profileImageUrl', imgSrc) } }
            imageSrc={data.profileImageUrl}
            imageUploadOptions={{
              collectionName: 'campaigns',
              collectionId: campaignId,
              filePath: 'profile'
            }}
          />

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
