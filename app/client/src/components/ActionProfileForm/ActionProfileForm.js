import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import TextField from 'material-ui/TextField';
import CircularProgress from 'material-ui/CircularProgress';
import RaisedButton from 'material-ui/RaisedButton';

import s from 'styles/Organize.scss';
import f from 'styles/Form.scss';


class ActionProfileForm extends PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    formSubmit: PropTypes.func.isRequired,
    handleInputChange: PropTypes.func.isRequired,
    saving: PropTypes.bool,
    uploading: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    saving: false,
  }

  render() {
    const { data, formSubmit, errors,
      handleInputChange, saving, uploading } = this.props;

    return (
      <div className={s.outerContainer}>
        <div className={s.editCampaignProfileContainer}>

          <div className={s.editTitleContainer}>
            <TextField
              value={data.title}
              className={s.textField}
              hintText="Action Public Title"
              onChange={(event) => { handleInputChange(event, 'title', event.target.value); }}
              errorText={errors.titleErrorText}
              fullWidth
              underlineShow={false}
            />
          </div>

          <div className={f.textareaContainer}>
            <TextField
              name="description"
              hintText={`Write a short description here. 
                This will show up in the search results. 
                You do not need to include the name of the action, or issues, keywords, etc. as they will all appear automatically`}
              value={data.description}
              multiLine
              rows={4}
              onChange={(event) => { handleInputChange(event, 'description', event.target.value); }}
              errorText={errors.descriptionErrorText}
              fullWidth
              underlineShow={false}
            />
          </div>

          { (saving || uploading) ? (

            <div className={s.savingThrobberContainer}>
              <CircularProgress
                size={100}
                thickness={5}
              />
            </div>
          ) : (

            <div className={[s.organizeButton, s.saveButton].join(' ')}>
              <RaisedButton
                onTouchTap={formSubmit}
                primary
                type="submit"
                label="Save Changes"
              />
            </div>
          )}

        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  uploading: state.uploads.uploading,
});

export default connect(mapStateToProps)(ActionProfileForm);
