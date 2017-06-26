import * as React from "react";
import { List, makeSelectable } from 'material-ui/List';

// ReSharper disable once InconsistentNaming
let SelectableListTemp = makeSelectable(List);

interface ISelectableListProps {
  defaultValue: string;
  onIndexChanged : (selectedValue:string) => void;
}

interface ISelectableListState {
  selectedIndex: string;
}

export class SelectableList extends React.Component<ISelectableListProps, ISelectableListState> {
  onIndexChangedPrivate: (selectedValue: string) => void;

  constructor(props: any) {
    super(props);
    this.onIndexChangedPrivate = props.onIndexChanged;
    this.state = {
      selectedIndex: this.props.defaultValue
    }
  }

  handleRequestChange = (event: any, index: string) => {
    this.setState({
      selectedIndex: index
    });
    this.onIndexChangedPrivate(index);
  };

  render() {
    return (
      <SelectableListTemp
        value={this.state.selectedIndex}
        onChange={this.handleRequestChange}
      >
        {this.props.children}
      </SelectableListTemp>
    );
  }
}
