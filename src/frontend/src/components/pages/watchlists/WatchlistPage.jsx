import React, { Component } from 'react';
import { remove as loRemove } from 'lodash';
import {
  Button, Container, Confirm, Modal, Divider, Step, Icon, Grid,
} from 'semantic-ui-react';
import Navbar from '../../navbar/Navbar';
import EditWatchlistPage from './EditWatchlistModal';
import watchlistService from '../../../services/watchlistService';
import WatchlistTable from './WatchlistTable';
import history from '../../../helpers/history';
import instrumentService from '../../../services/instrumentService';
import SearchBar from '../../searchbars/SearchBar';

/**
 * A page which lists a bunch of watchlists owned by the currently active user.
 * Allows user to create new watchlists or view existing ones.
 */
class WatchlistPage extends Component {
  /**
   * constructor
   * @param {object} props
   */
  constructor(props) {
    super(props);
    this.state = {
      watchlist: null,
      id: null,
      editor: false,
      confirmOpen: false,
      symbols: [],
      data: [],
      isLoaded: false,
      selectedSymbol: '',
    };
    const { match } = this.props;
    const { id } = match.params;
    watchlistService.getWatchlistDetails(id, (watchlist, newId) => {
      const { watchlist_details: watchlistDetails } = watchlist;
      const symbols = watchlistDetails.map(item => item.symbol);
      this.setState({
        watchlist,
        id: newId,
        symbols,
      });
      this.tracker(symbols);
    });
  }

  /**
   * Adds a new 'detail' to a watchlist
   */
  addToWatchlist = () => {
    const { selectedSymbol, id } = this.state;
    watchlistService.createWatchlistDetails({
      symbol: selectedSymbol,
      watchlistId: id,
      onSuccess: (newItem) => {
        const { symbols, watchlist } = this.state;
        symbols.push(newItem.symbol);
        this.getTableData(symbols);
        watchlist.watchlist_details.push(newItem);
        this.setState({ symbols, watchlist });
        this.forceUpdate();
      },
    });
  };

  /**
   * Closes open dialogue and redirects to watchlistListPage.
   */
  onDelete = () => {
    this.toggleConfirmOpen();
    history.push('/watchlists');
  };

  /**
   * Calls Watchlist Service to delete a watchlist.
   * @param {object} event - Event object generated by onClick method of delete button.
   * @param {function} event.preventDefault - Prevents usual button functionality.
   */
  handleDelete = async (event) => {
    event.preventDefault();
    const { id } = this.state;
    watchlistService.deleteWatchlist(id, this.onDelete);
  };

  /**
   * Toggles the open/close state of the "Delete Watchlist" confirmation.
   */
  toggleConfirmOpen = () => {
    const { confirmOpen } = this.state;
    this.setState({ confirmOpen: !confirmOpen });
  };

  /**
   * Toggles the EditWatchlistModal for editing the name and description of a watchlist.
   * @param {object} newWatchlist - the new version of the watchlist
   */
  toggleEditor = (newWatchlist) => {
    const { editor, id } = this.state;
    this.setState({ editor: !editor });
    if (editor && newWatchlist) {
      watchlistService.getWatchlistDetails(id, (watchlist) => {
        this.setState({ watchlist });
      });
    }
  };

  /**
   * Gets an array of watchlists created by the current user.
   * @param {object} response - Watchlist service response for current user.
   * @param {Array<Object>} response.result - Array of watchlists.
   */
  getSymbolData = (response) => {
    this.setState({ data: response.result, isLoaded: true });
  };

  /**
   * Retrieves current prices and other market details for symbols in list.
   * @param {Array<string>} symbols - Array of symbols to get table data for.
   */
  getTableData = async (symbols) => {
    instrumentService.quotes({
      symbols,
      callback: this.getSymbolData,
    });
  };

  /**
   * This function will run asynchronously to update prices every 5 minutes.
   * @param {Array<string>} symbols - Array of symbols to update data for.
   */
  tracker = (symbols) => {
    if (symbols.length !== 0) {
      this.getTableData(symbols);
      setInterval(() => this.getTableData(symbols), 300000);
    } else {
      this.setState({ isLoaded: true });
    }
  };

  /**
   * Deletes a detail of a given id from the watchlist.
   * It also removes that detail from current table data.
   * @param {string} id - Id of the detail to delete.
   */
  handleDetailDelete = (id) => {
    const { data, symbols, watchlist } = this.state;
    const { watchlist_details: watchlistDetails } = watchlist;
    const toRemove = watchlistDetails.find(datum => datum.id === id);
    loRemove(symbols, symbol => symbol === toRemove.symbol);
    loRemove(data, datum => datum.symbol === toRemove.symbol);
    watchlistService.deleteWatchlistDetails(id);
    this.setState({ data, symbols });
  };

  /**
   * Changes which symbol is currently selected in the searchbar.
   * Passed down to SearchBar so it can use this component's state.
   */
  newSelection = (symbol) => {
    this.setState({ selectedSymbol: symbol });
  };

  /**
   * render
   * @return {ReactElement} markup
   */
  render() {
    const {
      watchlist,
      confirmOpen,
      id,
      editor,
      data,
      isLoaded,
      selectedSymbol,
      symbols,
    } = this.state;
    return (
      <Container>
        <Navbar page="Watchlists" />
        <Step.Group unstackable size="mini">
          <Step as="a" onClick={() => history.push('/watchlists/')}>
            <Icon size="small" name="eye" />
            <Step.Content>
              <Step.Title>Watchlists</Step.Title>
              <Step.Description>Manage Watchlists</Step.Description>
            </Step.Content>
          </Step>
          {watchlist && (
            <Step active as="a">
              <Icon size="small" name="file alternate outline" />
              <Step.Content>
                <Step.Title>{watchlist.name}</Step.Title>
                <Step.Description>{watchlist.description}</Step.Description>
              </Step.Content>
            </Step>
          )}
        </Step.Group>
        <br />
        <Button
          alt="delete"
          compact
          color="red"
          size="tiny"
          content="Delete"
          icon="trash"
          labelPosition="right"
          onClick={this.toggleConfirmOpen}
        />
        <Confirm
          content="Are you sure you want to delete this Watchlist for good?"
          open={confirmOpen}
          onCancel={this.toggleConfirmOpen}
          onConfirm={this.handleDelete}
        />
        <Modal basic dimmer="inverted" onClose={this.componentDidMount} open={editor}>
          {watchlist && (
            <EditWatchlistPage id={id} watchlist={watchlist} toggleEditor={this.toggleEditor} />
          )}
        </Modal>
        <Button
          alt="edit"
          basic
          compact
          onClick={() => this.toggleEditor()}
          size="tiny"
          content="Edit"
          icon="edit"
          labelPosition="right"
        />
        <br />
        <br />

        <Grid>
          <Grid.Row columns={2}>
            <SearchBar
              onSelect={(newSelectedSymbol) => {
                if (typeof newSelectedSymbol === 'string') {
                  this.newSelection(newSelectedSymbol);
                }
              }}
            />
            {'             '}
            <Button
              alt="add to watchlist"
              className="brandButton"
              compact
              primary
              disabled={!selectedSymbol || Boolean(symbols.find(sym => sym === selectedSymbol))}
              onClick={() => this.addToWatchlist()}
            >
              Add
            </Button>
          </Grid.Row>
        </Grid>
        <Divider />
        {
          <WatchlistTable
            data={data}
            isLoaded={isLoaded}
            watchlist={watchlist}
            onDelete={this.handleDetailDelete}
          />
        }
      </Container>
    );
  }
}

export default WatchlistPage;
