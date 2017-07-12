import React, { PropTypes } from 'react';
import { connect } from 'react-redux'
import RaisedButton from 'material-ui/RaisedButton';
import {
  Table, TableBody, TableFooter, TableHeader, TableHeaderColumn,
  TableRow, TableRowColumn
} from 'material-ui/Table';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
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
      rows: null,
      selectedHeaders: null
    };
  }
 
  static propTypes = {
    config: PropTypes.object.isRequired
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
        const rows = Array.from(results.data).map((row) => {
          const values = Array.from(row);
          return {
            selected: true,
            values
          };
        });

        this.setState({ rows });

        const selectedHeaders = Array(results.data[0].length);
        selectedHeaders.fill('skip');
        this.setState({ selectedHeaders });
      }
    });
  }

  cancel = (event) => {
    event.stopPropagation();
    event.preventDefault();
    this.setState({ 
      csvFile: null,
      rows: null,
      selectedHeaders: null
    });
  }

  submit = async (event) => {
    event.stopPropagation();
    event.preventDefault();

    const submissionValues = [];
    const { config, ...props } = this.props;

    this.state.rows.filter(i => i.selected).forEach((row) => {
      const newItem = {};

      this.state.selectedHeaders.forEach((selection, index) => {
        if (selection !== 'skip') {
          const selectedHeader = config.headers.find(h => h.slug === selection);
          if (selectedHeader === undefined) {
            throw new Error('Can\'t find matching header');
          }

          const value = selectedHeader.processData(row.values[index]);
          newItem[selectedHeader.slug] = value;
        }
      });
      submissionValues.push(newItem);
      console.log(newItem);
    });
    console.log(submissionValues);

    await config.onSubmit(submissionValues);
  }

  handleRowSelection = (selectedRows) => {
    const newRows = Array.from(this.state.rows);
    if (selectedRows === 'all') {
      newRows.forEach((row, index) => newRows[index].selected = true);
    } else if (selectedRows === 'none') {
      newRows.forEach((row, index) => newRows[index].selected = false);
    } else {
      newRows.forEach((row, index) => newRows[index].selected = (selectedRows.includes(index)));
    }

    this.setState({
      rows: newRows
    });
  }

  handleHeaderChange = (event, index, value) => {
    event.stopPropagation();
    event.preventDefault();

    const newlySelected = Array.from(this.state.selectedHeaders);

    const testIndex = newlySelected.indexOf(value);
    if (testIndex !== -1) {
      newlySelected[testIndex] = 'skip';
    }

    newlySelected[index] = value;

    this.setState({ selectedHeaders: newlySelected });
  }

  render() {
    const { config, ...props } = this.props;
    const { rows, selectedHeaders, ...state } = this.state;

    if (rows && selectedHeaders) {
      const availableHeaders = Array.from(config.headers);
      availableHeaders.unshift({
        title: 'Skip',
        slug: 'skip',
      });

      return (
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
                {selectedHeaders.map((selected, index) => (
                  <TableHeaderColumn key={index}>
                    <SelectField
                      value={selected}
                      onChange={(event, i, value) => this.handleHeaderChange(event, index, value)}
                    >
                      {availableHeaders.map((header, index) => (
                        <MenuItem value={header.slug} primaryText={header.title} />
                      ))}
                    </SelectField>
                  </TableHeaderColumn>
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
                <TableRow key={index} selected={row.selected} selectable={true}>
                  {row.values.map((cell, index) => (
                    <TableRowColumn key={index}>{cell}</TableRowColumn>
                  ))}
                </TableRow>
                ))}
            </TableBody>
          </Table>
          <RaisedButton
            onTouchTap={this.submit}
            primary={true}
            label="Submit"
          />
        </div>
      );
    } else {
      return (
        <Dropzone
          onDrop={this.onDrop}
          multiple={false}
        >
          <div className={s.instructions}>Drag and drop your csv file here, or click to select an file to upload.</div>

          <FontIcon className="material-icons">add_a_photo</FontIcon>
        </Dropzone>
      );
    }
  }
}

const mapStateToProps = (state) => {
  return {
    uploading: state.uploads.uploading,
    error: state.uploads.error,
  };
}

export default connect(mapStateToProps)(CsvUploader);
