import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import Checkbox from 'material-ui/Checkbox';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import FontIcon from 'material-ui/FontIcon';
import CircularProgress from 'material-ui/CircularProgress';
import Dropzone from 'react-dropzone';
import Parser from 'papaparse';
import { CellMeasurer, CellMeasurerCache, Grid, AutoSizer } from 'react-virtualized';

import { notify } from 'actions/NotificationsActions';

import s from './CsvUploader.scss';

class CsvUploader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      csvFile: null,
      rows: null,
    };
  }

  static propTypes = {
    config: PropTypes.object.isRequired,
  };

  componentWillReceiveProps(nextProps) {
  }

  onDrop = async (acceptedFiles, rejectedFiles) => {
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
          values.unshift('SELECT_BOX_PLACEHOLDER');
          return {
            selected: true,
            values,
          };
        });

        const selectedHeaders = Array(results.data[0].length);
        selectedHeaders.fill('skip').unshift('skip'); // Skip first checkbox row

        rows.unshift({
          selected: true,
          values: selectedHeaders,
        });

        this.measurerCache = new CellMeasurerCache({
          defaultWidth: 150,
          fixedWidth: true,
          defaultHeight: 60,
          fixedHeight: false,
        });

        this.setState({ rows });
      },
    });
  }

  cancel = (event) => {
    event.stopPropagation();
    event.preventDefault();
    this.setState({
      csvFile: null,
      rows: null,
    });
  }

  submit = async (event) => {
    event.stopPropagation();
    event.preventDefault();

    const submissionValues = [];
    const { config, dispatch, ...props } = this.props;

    const submissionRows = Array.from(this.state.rows);

    try {
      const selectedHeaders = submissionRows.shift().values;

      submissionRows.filter(i => i.selected).forEach((row) => {
        const newItem = {};

        selectedHeaders.forEach((selection, index) => {
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
      });

      console.log(submissionValues);

      const results = await config.onSubmit(submissionValues);
      console.log(results);
      dispatch(notify('Successfully imported'));

      this.setState({
        csvFile: null,
        rows: null,
      });
    } catch (e) {
      console.error(e);
      dispatch(notify(`There was an error importing. Please check and try again. ${e.message}`));
    }
  }

  handleSelectAll = () => {
    const newRows = Array.from(this.state.rows);
    if (this.state.rows.every((i => i.selected))) {
      newRows.forEach((row, index) => newRows[index].selected = false);
    } else {
      newRows.forEach((row, index) => newRows[index].selected = true);
    }

    this.setState({
      rows: newRows,
    });
  }

  toggleRowSelection = (index) => {
    const newRows = Array.from(this.state.rows);
    newRows[index].selected = !newRows[index].selected;

    this.setState({
      rows: newRows,
    });
  }

  handleHeaderChange = (event, index, value) => {
    event.stopPropagation();
    event.preventDefault();
    const newRows = Array.from(this.state.rows);

    const newHeaders = newRows[0];

    const testIndex = newHeaders.values.indexOf(value);

    if (testIndex !== -1) {
      newHeaders.values[testIndex] = 'skip';
    }

    newHeaders.values[index] = value;

    newRows[0] = newHeaders;

    this.setState({
      rows: newRows,
    });
  }

  cellRenderer = ({ columnIndex, key, parent, rowIndex, style }) => {
    const { config, ...props } = this.props;

    const availableHeaders = Array.from(config.headers);
    availableHeaders.unshift({
      title: 'Skip',
      slug: 'skip',
    });

    const headerRow = (columnIndex === 0) ? (
      <Checkbox
        checked={this.state.rows.every((i => i.selected))}
        onTouchTap={(event) => {
          event.preventDefault();
          this.handleSelectAll();
        }}
      />
    ) : (
      <SelectField
        value={this.state.rows[0].values[columnIndex]}
        onChange={(event, i, value) => this.handleHeaderChange(event, columnIndex, value)}
      >
        {availableHeaders.map((header, index) => (
          <MenuItem value={header.slug} primaryText={header.title} />
        ))}
      </SelectField>
    );

    const bodyRow = (columnIndex === 0) ? (
      <Checkbox
        checked={this.state.rows[rowIndex].selected}
        onTouchTap={(event) => {
          event.preventDefault();
          this.toggleRowSelection(rowIndex);
        }}
      />
    ) : (
      this.state.rows[rowIndex].values[columnIndex]
    );

    return (
      <CellMeasurer
        cache={this.measurerCache}
        columnIndex={columnIndex}
        key={key}
        parent={parent}
        rowIndex={rowIndex}
      >
        <div
          style={{
            ...style,
            width: 150,
          }}
          className={s.gridCell}
        >
          <div style={{ margin: '10px' }}>
            {(rowIndex === 0) ? headerRow : bodyRow}

          </div>
        </div>
      </CellMeasurer>
    );
  }

  render() {
    const { config, ...props } = this.props;
    const { rows, ...state } = this.state;

    if (rows) {
      return (
        <div>
          <div className={s.cancelButton}>
            <RaisedButton
              onTouchTap={this.cancel}
              primary
              label="Cancel"
            />
          </div>


          <AutoSizer disableHeight>
            {({ width }) => (
              <Grid
                cellRenderer={this.cellRenderer}
                className={s.grid}
                columnCount={rows[0].values.length}
                columnWidth={150}
                deferredMeasurementCache={this.measurerCache}
                height={500}
                rowCount={rows.length}
                rowHeight={this.measurerCache.rowHeight}
                width={width}
                selected={rows.map(r => r.selected)}
                headers={rows[0].values}
              />
            )}
          </AutoSizer>

          <RaisedButton
            onTouchTap={this.submit}
            primary
            label="Submit"
          />
        </div>
      );
    }
    return (
      <div className={s.dropzoneContainer}>
        <div className={s.dropzone}>
          <Dropzone
            onDrop={this.onDrop}
            multiple={false}
          >
            <div className={s.instructions}>Drag and drop your csv file here, or click to select an file to upload.</div>

            <FontIcon className="material-icons">file_upload</FontIcon>
          </Dropzone>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  uploading: state.uploads.uploading,
  error: state.uploads.error,
});

export default connect(mapStateToProps)(CsvUploader);
