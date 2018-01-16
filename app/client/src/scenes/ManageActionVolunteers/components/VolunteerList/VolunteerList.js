import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import {
  Table, TableBody, TableHeader, TableHeaderColumn,
  TableRow, TableRowColumn,
} from 'material-ui/Table';


class VolunteerList extends PureComponent {
  static propTypes = {
    handleRowSelection: PropTypes.func.isRequired,
    volunteers: PropTypes.arrayOf(PropTypes.object),
    selected: PropTypes.arrayOf(PropTypes.object),
  }

  static defaultProps = {
    volunteers: [],
    selected: [],
  }

  isSelected = id => (this.props.selected.find(row => row.id === id) !== undefined)

  handleRowSelection = (selectedRows) => {
    if (selectedRows === 'none') {
      this.props.handleRowSelection([]);
    } else {
      const selected = this.props.volunteers.filter((volunteer, index) => (
        (selectedRows === 'all' || selectedRows.includes(index))
      ));

      this.props.handleRowSelection(selected);
    }
  }

  render() {
    if (this.props.volunteers) {
      const { volunteers } = this.props;

      return (
        <Table
          fixedHeader
          selectable
          multiSelectable
          onRowSelection={this.handleRowSelection}
        >
          <TableHeader
            displaySelectAll
            adjustForCheckbox
            enableSelectAll
          >
            <TableRow>
              <TableHeaderColumn>Name</TableHeaderColumn>
              <TableHeaderColumn>Email</TableHeaderColumn>
              <TableHeaderColumn>Phone</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody
            displayRowCheckbox
            showRowHover
            stripedRows={false}
            deselectOnClickaway={false}
          >
            {volunteers.map((volunteer, index) => (
              <TableRow key={volunteer.id} selected={this.isSelected(volunteer.id)} selectable>
                <TableRowColumn>{`${volunteer.first_name} ${volunteer.last_name}`}</TableRowColumn>
                <TableRowColumn>{volunteer.email}</TableRowColumn>
                <TableRowColumn>{volunteer.phone_number}</TableRowColumn>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      );
    }
    return null;
  }
}

export default VolunteerList;
