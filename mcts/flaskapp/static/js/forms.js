$(document).on('submit','#game-board-form', function(e) {
    e.preventDefault();

    // Play the move locally before the AI starts to think
    const clickedCell = $(document.activeElement);
    if (clickedCell.hasClass('playerCell') || clickedCell.hasClass('aiCell')) {
        return;
    }

    const cellId = clickedCell.attr('id');

    // Let the AI think, then update the UI with the AI's move
    $.ajax({
        type: 'POST',
        url: '/play',
        data: {
            cell: cellId
        },
        success: function(response) {
            const { board, game_state_message } = response;
            let cellPos = 1;
            $("#game-state-info p").text(game_state_message);
            for (let i = 0; i < board.length; i++) { 
                for (let j = 0; j < board[0].length; j++) {
                    const player = board[i][j];
                    let cellOnBoard = $(`#game-board-form button[id='${cellPos}']`);
                    switch (player) {
                        case 1:
                            cellOnBoard.text('O');
                            cellOnBoard.removeClass('blankCell');
                            cellOnBoard.addClass('playerCell');
                            break;
                        case -1:
                            cellOnBoard.text('X');
                            cellOnBoard.removeClass('blankCell');
                            cellOnBoard.addClass('aiCell');
                            break;
                        default:   
                            cellOnBoard.text('');
                            cellOnBoard.removeClass('playerCell');
                            cellOnBoard.removeClass('aiCell');
                            cellOnBoard.addClass('blankCell');
                            cellOnBoard.prop("disabled", false);
                            break;
                    }
                    if (game_state_message !== null) {
                        cellOnBoard.prop("disabled", true);
                    }
                    cellPos += 1;
                }
            }  
        },
        error: function() {
            alert('error');
        }
    })
});