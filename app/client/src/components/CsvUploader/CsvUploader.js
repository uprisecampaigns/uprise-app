import React, { PropTypes } from 'react';
import { connect } from 'react-redux'
import RaisedButton from 'material-ui/RaisedButton';
import {
  Table, TableBody, TableFooter, TableHeader, TableHeaderColumn,
  TableRow, TableRowColumn
} from 'material-ui/Table';
import FontIcon from 'material-ui/FontIcon';
import CircularProgress from 'material-ui/CircularProgress';
import Dropzone from 'react-dropzone';
import Parser from 'papaparse';

import { notify } from 'actions/NotificationsActions';

import s from 'styles/ImageUploader.scss';

class CsvUploader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      csvFile: null,
      rows: null
    };
  }
 
  static propTypes = {
  };

  componentWillReceiveProps(nextProps) {
  }

  onDrop = (acceptedFiles, rejectedFiles) => {

    const { dispatch, ...props } = this.props;

    if (!acceptedFiles.length) {
      dispatch(notify('There was an error with your file. Please check and try again'));
      return;
    }

    const csvFile = acceptedFiles[0];
    console.log(csvFile);

    if (!csvFile.type.match('text/csv')) {
      dispatch(notify('File must be a csv'));
      return;
    }

    this.setState({ csvFile });
    Parser.parse(csvFile, {
      error: (err, file, inputElem, reason) => {
        console.error(err);
      },
      complete: (results, file) => {
        console.log(results);
        this.setState({ rows: results.data });
      }
    });
  }

  cancel = (event) => {
    event.stopPropagation();
    event.preventDefault();
    this.setState({ 
      csvFile: null,
      rows: null
    });
  }

  render() {
    const { ...props } = this.props;
    const { rows, ...state } = this.state;

    return (

      <div>
        { rows ? (
          <div>
            <RaisedButton
              onTouchTap={this.cancel}
              primary={true}
              label="Cancel"
            />
            <Table
              fixedHeader={true}
              selectable={true}
              multiSelectable={true}
              onRowSelection={this.handleRowSelection}
            >
              <TableHeader
                displaySelectAll={true}
                adjustForCheckbox={true}
                enableSelectAll={true}
              >
                <TableRow>
                  {rows[0].map((header, index) => (
                    <TableHeaderColumn key={index}>{header}</TableHeaderColumn>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody
                displayRowCheckbox={true}
                showRowHover={true}
                stripedRows={false}
                deselectOnClickaway={false}
              >
                {rows.map((row, index) => (
                  <TableRow key={index} selected={false} selectable={true}>
                    {row.map((cell, index) => (
                      <TableRowColumn key={index}>{cell}</TableRowColumn>
                    ))}
                  </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <Dropzone
            onDrop={this.onDrop}
            multiple={false}
          >
            <div className={s.instructions}>Drag and drop your csv file here, or click to select an file to upload.</div>

            <FontIcon className="material-icons">add_a_photo</FontIcon>
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

export default connect(mapStateToProps)(CsvUploader);
