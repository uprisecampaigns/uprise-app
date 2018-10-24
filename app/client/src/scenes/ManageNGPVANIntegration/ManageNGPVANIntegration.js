import PropTypes from 'prop-types';
import ClassNames from 'classnames';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import FontIcon from 'material-ui/FontIcon';
import camelCase from 'camelcase';

import NGPForm from 'components/NGPForm';
import Link from 'components/Link';

import formWrapper from 'lib/formWrapper';
import { validateString } from 'lib/validateComponentForms';

import userObject from 'lib/userObject';

import { NGPVanFindOrCreate } from 'actions/NGPVan';

import CampaignQuery from 'schemas/queries/CampaignQuery.graphql';
import SubscribedUsersQuery from 'schemas/queries/SubscribedUsersQuery.graphql';
import EditCampaignMutation from 'schemas/mutations/EditCampaignMutation.graphql';

import s from 'styles/Organize.scss';

const WrappedNPGForm = formWrapper(NGPForm);

class ManageNGPVANIntegration extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    editCampaignMutation: PropTypes.func.isRequired,
    campaign: PropTypes.object,
  };

  static defaultProps = {
    campaign: undefined,
  };

  constructor(props) {
    super(props);

    const initialState = {
      formData: {
        title: '',
        profileSubheader: '',
        description: '',
        profileImageUrl: '',
        streetAddress: '',
        streetAddress2: '',
        websiteUrl: '',
        phoneNumber: '',
        email: '',
        city: '',
        state: '',
        zipcode: '',
        legalOrg: false,
        orgWebsite: '',
        orgName: '',
        orgStatus: '',
        orgContactName: '',
        orgContactPosition: '',
        orgContactEmail: '',
        orgContactPhone: '',
        tags: [],
        zipcodeList: '',
        locationType: null,
        legislativeDistrictType: null,
        locationDistrictNumber: '',
        locationState: '',
        ngpName: '',
        ngpKey: '',
      },
      selected: [],
      syncStatus: {},
    };

    this.state = Object.assign({}, initialState);
  }

  componentWillMount() {
    this.handleCampaignProps(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.handleCampaignProps(nextProps);
  }

  handleCampaignProps = (nextProps) => {
    if (nextProps.campaign && !nextProps.graphqlLoading) {
      // Just camel-casing property keys and checking for null/undefined
      const campaign = Object.assign(
        ...Object.keys(nextProps.campaign).map((k) => {
          if (nextProps.campaign[k] !== null) {
            return { [camelCase(k)]: nextProps.campaign[k] };
          }
          return undefined;
        }),
      );

      Object.keys(campaign).forEach((k) => {
        if (!Object.keys(this.state.formData).includes(camelCase(k))) {
          delete campaign[k];
        }
      });

      campaign.zipcodeList = typeof campaign.zipcodeList === 'object' ? campaign.zipcodeList.join(',') : '';

      this.setState((prevState) => ({
        formData: Object.assign({}, prevState.formData, campaign),
      }));
    }
  };

  defaultErrorText = {
    titleErrorText: null,
    streetAddressErrorText: null,
    websiteUrlErrorText: null,
    phoneNumberErrorText: null,
    cityErrorText: null,
    stateErrorText: null,
    zipcodeErrorText: null,
    orgNameErrorText: null,
    orgWebsiteErrorText: null,
    orgStatusErrorText: null,
    orgContactPositionErrorText: null,
    orgContactEmailErrorText: null,
    orgContactPhoneErrorText: null,
    zipcodeListErrorText: null,
    locationDistrictNumberErrorText: null,
  };

  resetSubscribers = () => {
    this.setState({
      syncStatus: {
        error: null,
        result: null,
      },
    });
  };

  formSubmit = async (data) => {
    // A little hackish to avoid an annoying rerender with previous form data
    // If I could figure out how to avoid keeping state here
    // w/ the componentWillReceiveProps/apollo/graphql then
    // I might not need this
    // this.setState({
    //   formData: Object.assign({}, data),
    // });

    const formData = Object.assign({}, data);

    formData.id = this.props.campaign.id;

    formData.zipcodeList = formData.zipcodeList.split(',').map((zip) => zip.trim());

    try {
      await this.props.editCampaignMutation({
        variables: {
          data: formData,
        },
        // TODO: decide between refetch and update
        refetchQueries: ['CampaignQuery', 'CampaignsQuery', 'MyCampaignsQuery'],
      });
      this.resetSubscribers();

      return { success: true, message: 'Changes Saved' };
    } catch (e) {
      console.error(e);
      return { success: false, message: e.message };
    }
  };

  isSelected = (id) => this.state.selected.find((row) => row.id === id) !== undefined;

  handleRowSelection = (selectedRows) => {
    if (selectedRows === 'none') {
      this.setState({ selected: [] });
    } else {
      const selected = this.props.subscribers.filter(
        (volunteer, index) => selectedRows === 'all' || selectedRows.includes(index),
      );

      this.setState({ selected });
    }
  };

  APISync = async () => {
    event.preventDefault();

    const { campaign, subscribers } = this.props;

    let count = 0;
    let error = false;

    const processSubscribers = async () => {
      if (subscribers[count]) {
        const subscriber = subscribers[count];

        const data = {
          campaignId: campaign.id,
          user: userObject(subscriber),
        };
        const res = await this.props.dispatch(NGPVanFindOrCreate(data));

        if (res && !res.errors) {
          this.setState({
            syncStatus: {
              ...this.state.syncStatus,
              [subscriber.id]: 'success',
            },
          });
        } else {
          error = true;
          let errorText;

          if (res && res.errors && res.errors[0].code === 'FORBIDDEN') {
            errorText = 'Invalid API Key, please verify it and try again.';
          } else {
            errorText = 'There was an issue syncing. Please contact uprise for assistance.';
          }

          this.setState({
            syncStatus: {
              ...this.state.syncStatus,
              [subscriber.id]: 'error',
              error: errorText,
              result: 'error',
            },
          });
        }
      }

      count += 1;

      if (!error && count < subscribers.length) {
        // Wait 2 seconds, then process next subscriber, per NGP API docs
        setTimeout(() => {
          processSubscribers();
        }, 2000);
      }
      if (count === subscribers.length) {
        this.setState({
          syncStatus: {
            ...this.state.syncStatus,
            result: 'success',
          },
        });
      }
    };

    this.resetSubscribers();
    processSubscribers();
  };

  render() {
    if (this.props.campaign && this.props.subscribers) {
      const { state, formSubmit, defaultErrorText } = this;
      const { campaign, subscribers } = this.props;
      const { formData, syncStatus } = state;

      const validators = [
        (component) => validateString(component, 'ngpName', 'ngpNameErrorText', 'Application name is required'),
        (component) => validateString(component, 'ngpKey', 'ngpKeyErrorText', 'API Key is required'),
      ];

      const baseActionUrl = `/organize/${campaign.slug}`;

      const statusIcon = (status) => {
        let response = 'sync';
        if (status === 'error') {
          response = 'sync_disabled';
        }
        return response;
      };

      const statusColor = (status) => {
        let response = s.statusGray;
        if (status === 'success') {
          response = s.statusBlue;
        }
        if (status === 'error') {
          response = s.statusRed;
        }
        return response;
      };

      const SyncStatus = () => {
        const status = syncStatus.result;
        let statusText;

        if (status === 'success') {
          statusText = 'Sync complete!';
        }
        if (status === 'error') {
          statusText = syncStatus.error || 'There was an issue syncing';
        }
        return <div className={[s.statusText, statusColor(status)].join(' ')}>{statusText}</div>;
      };

      return (
        <div className={s.outerContainer}>
          <div className={s.innerContainer}>
            {/*
            <Link to={`/organize/${campaign.slug}`}>
              <div className={s.navHeader}>
                <FontIcon className={['material-icons', s.backArrow].join(' ')}>arrow_back</FontIcon>

                {campaign.title}
              </div>
            </Link>
          */}

            <div className={s.sectionHeaderContainer}>
              <div className={s.pageHeader}>{campaign.title}</div>

              {campaign.profile_subheader && <div className={s.sectionSubheader}>{campaign.profile_subheader}</div>}
            </div>

            <div className={s.crumbs}>
              <div className={s.navHeader}>
                <Link to={`${baseActionUrl}`}>{campaign.title}</Link>
                <FontIcon className={['material-icons', 'arrowRight'].join(' ')}>keyboard_arrow_right</FontIcon>
                Sync with VAN
              </div>
            </div>

            <div className={s.sectionsContainer}>
              <div className={s.section}>
                <WrappedNPGForm
                  initialState={formData}
                  initialErrors={defaultErrorText}
                  validators={validators}
                  submit={formSubmit}
                  submitText="Save API Key"
                  campaign={campaign}
                  campaignId={campaign.id}
                />
              </div>
              <div className={s.section}>
                <div className={s.centerButtonContainer}>
                  <div
                    className={ClassNames({
                      [s.composeButton]: true,
                      [s.disabledButton]: !campaign.ngp_name || !campaign.ngp_key,
                    })}
                    onClick={this.APISync}
                    onKeyPress={this.APISync}
                    role="button"
                    tabIndex="0"
                  >
                    Sync with NGPVAN
                  </div>
                </div>
                <SyncStatus />
                <Table fixedHeader selectable={false} className={s.subscribers}>
                  <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                    <TableRow>
                      <TableHeaderColumn>Name</TableHeaderColumn>
                      <TableHeaderColumn>Status</TableHeaderColumn>
                    </TableRow>
                  </TableHeader>
                  <TableBody displayRowCheckbox={false} showRowHover stripedRows={false} deselectOnClickaway={false}>
                    {subscribers.map((subscriber, index) => (
                      <TableRow key={subscriber.id} selected={this.isSelected(subscriber.id)}>
                        <TableRowColumn>{`${subscriber.first_name} ${subscriber.last_name}`}</TableRowColumn>
                        <TableRowColumn>
                          <FontIcon className={['material-icons', statusColor(syncStatus[subscriber.id])].join(' ')}>
                            {statusIcon(syncStatus[subscriber.id])}
                          </FontIcon>
                        </TableRowColumn>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  }
}

export default compose(
  connect(),
  graphql(CampaignQuery, {
    options: (ownProps) => ({
      variables: {
        search: {
          id: ownProps.campaignId,
        },
      },
    }),
    props: ({ data }) => ({
      campaign: data.campaign,
    }),
  }),
  graphql(SubscribedUsersQuery, {
    options: (ownProps) => ({
      variables: {
        search: {
          id: ownProps.campaignId,
        },
      },
      fetchPolicy: 'cache-and-network',
    }),
    props: ({ data }) => ({
      subscribers: data.subscribedUsers,
    }),
  }),
  graphql(EditCampaignMutation, { name: 'editCampaignMutation' }),
)(ManageNGPVANIntegration);
