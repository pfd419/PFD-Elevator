import { winCombos } from '../statics/winCombos';

export const checkWin = (board, piece) => {
    let winningCombo = [];
    let winner = winCombos.some(combo => {
        let winning = true;
        for (var i = 0; i < combo.length - 1; i++) {
            if (board[combo[i]] !== piece) {
                winning = false;
            }
        }
        if (winning) {
            winningCombo = combo;
        }
        return winning;
    });
    return [winner, winningCombo];
};