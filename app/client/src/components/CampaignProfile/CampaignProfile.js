import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import moment from 'moment';
import TextField from 'material-ui/TextField';

import Link from 'components/Link';

import s from 'styles/Campaign.scss';


class CampaignProfile extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    campaign: PropTypes.object.isRequired,
  }

  render() {

    const { campaign, ...props } = this.props;

    const keywords = (typeof campaign.tags === 'object' && campaign.tags.length > 0) && (
      <div className={s.detailLine}>{campaign.tags.join(', ')}</div>
    );

    return (
      <div className={s.outerContainer}>
        <div className={s.innerContainer}>

          <Link to={'/campaign/' + campaign.slug}>
            <div className={s.titleContainer}>{campaign.title}</div>
          </Link>

          { campaign.profile_image_url && (
            <div className={s.profileImageContainer}>
              <img src={campaign.profile_image_url} className={s.profileImage}/>
            </div>
          )}

          { campaign.profile_subheader && (
            <div className={s.profileSubheaderContainer}>
              {campaign.profile_subheader}
            </div>
          )}

          { campaign.website_url && (
            <div className={s.websiteUrlContainer}>
              <Link to={campaign.website_url} external={true} useAhref={true}>
                {campaign.website_url}
              </Link>
            </div>
          )}

          { (typeof campaign.description === 'string' && campaign.description.trim() !== '') &&
            <div className={s.descriptionContainer}>{campaign.description}</div>
          }

          <div className={s.contactContainer}>
            Contact Coordinator:  
            <Link to={'mailto:' + campaign.owner.email} external={true} useAhref={true}>
              {campaign.owner.first_name} {campaign.owner.last_name}
            </Link>
          </div>

          {keywords && (
            <div className={s.keywordsContainer}>
              <div className={s.header}>
                Keywords:
              </div>
              <div>{keywords}</div>
            </div>
          )}

        </div>
      </div>
    );
;
  }
}

export default CampaignProfile;
