import React, {
  AppRegistry,
  Component,
  TouchableHighlight,
  StyleSheet,
  Text,
  View
} from 'react-native';

const Square = require('./square.ios');
const Piece = require('./piece.ios');
const CONSTANTS = require('./constants.ios');

var keys = [
            [0, 1, 2, 3, 4, 5, 6, 7],
            [8, 9, 10, 11, 12, 13, 14, 15],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [16, 17, 18, 19, 20, 21, 22, 23],
            [24, 25, 26, 27, 28, 29, 30, 31]
          ];

const Board = React.createClass({
  getInitialState() {
    return { selectedPiece: null }
  },

  render() {
    let tiles = this.createTiles()

    return (
      <View style={styles.container}>
        {tiles}
      </View>
    );
  },

  createTiles() {
    let squares = [],
        pieces = [],
        moves = [],
        currentColor = (this.props.turn === "#FFFFFF") ? "white" : "black",
        player = this.props.game.currentPlayer
    const selectedPiece = this.state.selectedPiece
    const board = this.props.game.board.grid

    if (selectedPiece !== null) {
      let row = selectedPiece.row,
          col = selectedPiece.column,
          moves = []

      const currentSquare = {
        square: CONSTANTS.COLUMNS[col] + CONSTANTS.ROWS[row]
      };

      this.startPos = [row, col]
      moves.push(currentSquare.square)
      this.props.game.history.push(currentSquare.square)
    }

    board.forEach((row, rowIndex) => {
      row.forEach((piece, colIndex) => {
        let key = parseInt((rowIndex + 1).toString() + (colIndex + 1).toString())

        squares.push(
          <Square
            column={colIndex}
            row={rowIndex}
            selectable={selectedPiece !== null &&
                        this.state.piece.validMove([rowIndex, colIndex])
                       }
            selected={selectedPiece !== null &&
                      selectedPiece.row === rowIndex &&
                      selectedPiece.column === colIndex}
            onSquareSelect={this.onSquareSelected}
            key={key}/>
        )

        if ( piece !== null) {
          let type = piece.toString().toLowerCase(),
              color = piece.color

          pieces.push(
            <Piece
              piece={type}
              key={key * 100}
              color={color}
              column={colIndex}
              row={rowIndex}
              selectable={currentColor === color ||
                (selectedPiece !== null && this.state.piece.validMove([rowIndex, colIndex])) }
              onPieceSelect={this.onPieceSelected}/>
          )
        }
      })
    })
    return [...squares, ...pieces]
  },

  onPieceSelected(row, column, color) {
    let currentColor = (this.props.turn === "#FFFFFF") ? "white" :       "black"
    let selectedPiece = this.state.selectedPiece


    if (selectedPiece !== null) {
      if (currentColor !== color) {
        this.onSquareSelected(row, column)
      } else {
        if (selectedPiece.row !== row || selectedPiece.column !== column) {
          this.setState({ selectedPiece: {row: row, column: column} })
        } else {
          this.setState({ selectedPiece: null })
        }
      }
    } else {
      this.setState({ selectedPiece: {row: row, column: column}, piece: this.props.game.board.grid[row][column] });
    }
  },

  onSquareSelected(row, column) {
    if (this.state.selectedPiece === null) {
      return;
    }

    this.endPos = [row, column]
    this.props.game.move(this.startPos, this.endPos)
    // if (this.props.game.move(this.startPos, this.endPos)) {
    //   keys[row][column] = keys[this.state.selectedPiece.row][this.state.selectedPiece.column];
    //   keys[this.state.selectedPiece.row][this.state.selectedPiece.column] = null;
    // }
    this.turnComplete();
  },

  turnComplete() {
    this.startPos = null
    this.endPos = null
    this.props.turnComplete()
    this.setState({selectedPiece: null})
  }
});

const styles = StyleSheet.create({
  container: {
    width: 375,
    height: 375,
    backgroundColor: '#F5FCFF',
    flexDirection: 'row',
    flexWrap: 'wrap',
  }
});

module.exports = Board;


// pieces.push(
//   <Piece
//     piece={row.charAt(i).toLowerCase()}
//     key={keys[rowIndex][column]}
//     color={color}
//     column={column}
//     row={rowIndex}
//     selectable={this.props.turn === color ||
//                 moves.indexOf(CONSTANTS.COLUMNS[column] + CONSTANTS.ROWS[rowIndex]) !== -1 }
//     onPieceSelect={this.onPieceSelected}/>
// );