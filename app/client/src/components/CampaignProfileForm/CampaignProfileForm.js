import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import TextField from 'material-ui/TextField';
import CircularProgress from 'material-ui/CircularProgress';
import RaisedButton from 'material-ui/RaisedButton';

import ImageUploader from 'components/ImageUploader';

import s from 'styles/Organize.scss';
import f from 'styles/Form.scss';

class CampaignProfileForm extends PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    formSubmit: PropTypes.func.isRequired,
    campaignId: PropTypes.string.isRequired,
    handleInputChange: PropTypes.func.isRequired,
    saving: PropTypes.bool,
    uploading: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    saving: false,
  };

  render() {
    const { data, formSubmit, errors, campaignId, handleInputChange, saving, uploading } = this.props;

    return (
      <div className={s.outerContainer}>
        <div className={s.editCampaignProfileContainer}>
          <ImageUploader
            onChange={(imgSrc) => {
              handleInputChange(undefined, 'profileImageUrl', imgSrc);
            }}
            imageSrc={data.profileImageUrl}
            imageHeight={800}
            imageWidth={800}
            imageUploadOptions={{
              collectionName: 'campaigns',
              collectionId: campaignId,
              filePath: 'profile',
            }}
          />

          <div className={s.editTitleContainer}>
            <TextField
              value={data.title}
              className={s.textField}
              hintText="Campaign Public Title"
              onChange={(event) => {
                handleInputChange(event, 'title', event.target.value);
              }}
              errorText={errors.titleErrorText}
              fullWidth
              underlineShow={false}
            />
          </div>

          <div className={s.editSubheaderContainer}>
            <TextField
              className={s.textField}
              value={data.profileSubheader}
              hintText="Subheader"
              onChange={(event) => {
                handleInputChange(event, 'profileSubheader', event.target.value);
              }}
              errorText={errors.profileSubheaderErrorText}
              fullWidth
              underlineShow={false}
            />
          </div>

          <div className={s.editWebsiteUrlContainer}>
            <TextField
              value={data.websiteUrl}
              className={s.textField}
              hintText="Website Url"
              onChange={(event) => {
                handleInputChange(event, 'websiteUrl', event.target.value);
              }}
              errorText={errors.websiteUrlErrorText}
              fullWidth
              underlineShow={false}
            />
          </div>

          <div className={f.textareaContainer}>
            <TextField
              name="description"
              hintText="Write a short description here.
                This will show up in the search results.
                You do not need to include the name of the campaign, your website url, or your issues, keywords, etc.
                as they will all appear automatically"
              value={data.description}
              multiLine
              rows={4}
              onChange={(event) => {
                handleInputChange(event, 'description', event.target.value);
              }}
              errorText={errors.descriptionErrorText}
              fullWidth
              underlineShow={false}
            />
          </div>

          {saving || uploading ? (
            <div className={s.savingThrobberContainer}>
              <CircularProgress size={100} thickness={5} />
            </div>
          ) : (
            <div
              className={[s.organizeButton, s.saveButton].join(' ')}
              onClick={formSubmit}
              onKeyPress={formSubmit}
              role="button"
              tabIndex="0"
            >
              Save Changes
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  uploading: state.uploads.uploading,
});

export default connect(mapStateToProps)(CampaignProfileForm);
