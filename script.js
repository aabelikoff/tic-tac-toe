const p1 = document.getElementById('player1');
const p2 = document.getElementById('player2');
const AI1 = document.getElementById('AI1');
const AI2 = document.getElementById('AI2');

//responsible for Game fields and analysis
const gameBoard = (function (){
    const size = 3;//size of board
    const itemX = 'X';
    const itemO = 'O';
    let fields = [];//2-dimension array
  
    let winnerFields = { //contains information about winner lines
        item: null,
        row: null,
        nRow: null,
        col: null,
        nCol: null,
        diag: null,
        nDiag: null,
        winnerLine: [],
    };
    //Initialisation of 2-dimension array
    const initialiseFields = () => {
        for (let i=0; i < size; i++){
            fields.push([]);
            for (let j=0; j < size; j++){
                fields[i].push(null);
            }
        }
    };
    initialiseFields();
    //indexes in plain array
    const fillIndexes = () =>{
        let indexes = [];
        for (let i=0; i < size; i++){
            for (let j=0; j < size; j++){
                if (fields[i][j] === null){
                    indexes.push(indexes.length);
                }
                else {
                    indexes.push(fields[i][j]);
                }
            }
        }
        return indexes;
    };
    //reset all fields to null
    const resetFields = () => {
        for (let i=0; i < size; i++){
            for (let j=0; j < size; j++){
                fields[i][j] = null;
            }
        }
        for (let key in winnerFields){
            winnerFields[key] = key === 'winnerLine'? []:null;
        }
    };
    //set particular mark to field
    const setField = (i, j, mark) => {
        if (fields[i][j] === null){
            fields[i][j] = mark;
            return true;
        }
        return false;
    };
    //analyse winner rows
    analiseRows = () => {
        for (let i = 0; i < size; i++){
            if (fields[i].filter(elem => elem === itemX).length === size || fields[i].filter(elem => elem === itemO).length === size){
                winnerFields.item = fields[i][0] === itemX ? itemX : itemO;
                winnerFields.nRow = i;
                winnerFields.row = true;
                return true;
            }
        }
        return false;
    };
    //analyse winner columns
    const analiseColumns = () => {
        let arr =[];
        for (let j=0; j < size; j++){
            for (let i=0; i < size; i++){
               arr.push(fields[i][j]); 
            }
            if (arr.filter(elem => elem === itemX).length === size || arr.filter(elem => elem === itemO).length === size) {
                winnerFields.item = arr[0][j] === itemX ? itemX : itemO;
                winnerFields.col = true;
                winnerFields.nCol = j;
                return true;
            }
            arr =[];
        }
        return false;
    };
    //analyse winner diagonals
    const analiseDiagonals = () => {
        let arr1 =[];
        let arr2 = [];
        for (let i=0; i < size; i++) {
            arr1.push(fields[i][i]);
            for (let j=size-1; j >=0; j--){
                if (i+j === 2){
                    arr2.push(fields[i][j]);
                }
            }
        }
        if (arr1.filter(elem => elem === itemX).length === size || arr1.filter(elem => elem === itemO).length === size){
            winnerFields.item = arr1[0];
            winnerFields.diag = true;
            winnerFields.nDiag = 0;
            return true;
        }
        else if (arr2.filter(elem => elem === itemX).length === size || arr2.filter(elem => elem === itemO).length === size){
            winnerFields.item = arr2[0];
            winnerFields.diag = true;
            winnerFields.nDiag = 2;
            return true;
        }
        return false;
    };
    //sets winner line adreses
    const setWinnerLine = () => {
        if (winnerFields.row) {
            for (let j = 0; j < size; j++){
                winnerFields.winnerLine.push(`${winnerFields.nRow}${j}`);
            }
        }
        else if (winnerFields.col) {
            for (let i=0; i < size; i++){
                winnerFields.winnerLine.push(`${i}${winnerFields.nCol}`);
            }
        }
        else if (winnerFields.diag && winnerFields.nDiag === 0) {
            for (let i=0; i < size; i++){
                winnerFields.winnerLine.push (`${i}${i}`);
            }
        }
        else if (winnerFields.diag && winnerFields.nDiag === 2)
            for (let i=0; i < size; i++){
                for (let j=0; j < size; j++){
                    if (i+j ===2){
                        winnerFields.winnerLine.push (`${i}${j}`);
                    }
                }
            }
    };
    //analyse all
    const analise = () => {
        if (analiseRows() || analiseColumns() || analiseDiagonals()){
            setWinnerLine();
            return true;
        }
        return false;
    }
  
    return {
        size, fields, initialiseFields, resetFields, setField, itemX, itemO, winnerFields, analise,
        fillIndexes
    }
})();
//Module responsible for visualisation
const displayController = (function (){
    const content = document.querySelector('.content');
    //Creation one visual field
    const createDiv = (i, j, size) => {
        let div = document.createElement('div');
        let styleStr = `width: ${size/gameBoard.size}px; height: ${size/gameBoard.size}px;`;
        div.setAttribute('data-ij',`${i}${j}`);
        div.classList.add('null-background');
        div.style.cssText = styleStr;
        return div;
    };
    //Insert divs into content field
    const initialiseDivs = () =>{
        for (let i=0; i<gameBoard.size; i++){
            for (let j=0; j<gameBoard.size; j++){
                content.appendChild( createDiv( i, j, content.clientWidth));
            }
        }
    };
    initialiseDivs ();
    //Drowing one div element
    const drawOne = (element, symbol) => {
        if (symbol === gameBoard.itemX){
            element.classList.add('x-background');
        }
        else if (symbol === gameBoard.itemO) {
            element.classList.add('o-background');
        }
        else {
            element.classList.add('null-background');
            if (element.classList.contains('x-background')){
                element.classList.remove('x-background');
            }
            if (element.classList.contains('o-background')){
                element.classList.remove('o-background');
            }
            if (element.classList.contains('winner-field')){
                element.classList.remove('winner-field');
            }
        }
    };
    //Get array of div elements
    const getArrayOfElements = () => {
        return Array.from(document.querySelectorAll ('.content div'));
    };
    //Get one div element 
    const getElement = (i, j) => {
        let elements = getArrayOfElements();
        let findElement = null;
        elements.forEach((elem) => {
            if (elem.getAttribute('data-ij') === `${i}${j}`){
                findElement = elem;
            }
        })
        return findElement;
    };
    //Parcing all divs and drawing
    const drawing = () => {
        for (let i=0; i < gameBoard.size; i++){
            for (let j=0; j < gameBoard.size; j++) {
                drawOne (getElement(i,j),gameBoard.fields[i][j]);
            }
        }
    };
    //enlighting winner lines
    const enlightWinnerDivs = () => {
        if (gameBoard.winnerFields.winnerLine.length > 0) {
            let i,j;
            gameBoard.winnerFields.winnerLine.forEach((elem) =>{
                i = parseInt(elem.substr(0,1));
                j = parseInt(elem.substr(1,1));
                getElement(i,j).classList.add('winner-field');
                getElement(i,j).classList.remove('null-background')
            })
        }
    };
    //Toggles items if items coinside
    const toggleSelectedItems = (selectElem) => {
        if (selectElem === p1 && p1.selectedIndex === p2.selectedIndex){
            p2.selectedIndex = p1.selectedIndex === 0 ? 1:0;
        }
        if (selectElem === p2 && p2.selectedIndex === p1.selectedIndex){
            p1.selectedIndex = p2.selectedIndex === 0 ? 1:0;
        }
    };
    p1.addEventListener('change',(e) => {
        toggleSelectedItems(e.target);
    });
    p2.addEventListener('change',(e) => {
        toggleSelectedItems(e.target);
    });

    //toggling checkboxes
    let firstMoveCheckboxes = document.querySelectorAll('input[name="firstmove"]'); 
    let aiCheckboxes = document.querySelectorAll('input[name="AI"]');
    const toggleCheckboxes = (elem,checkboxes) =>{
        if (elem === checkboxes[0] && checkboxes[0].checked && checkboxes[1].checked){
            checkboxes[1].checked = false;
        }
        else if (elem === checkboxes[1] && checkboxes[1].checked && checkboxes[0].checked){
            checkboxes[0].checked = false;
        }
        else if (elem === checkboxes[0] && !checkboxes[0].checked && !checkboxes[1].checked){
            checkboxes[1].checked = true;
        }
        else if (elem === checkboxes[1] && !checkboxes[1].checked && !checkboxes[0].checked){
            checkboxes[0].checked = true;
        }
    };
    firstMoveCheckboxes.forEach (elem => {
        elem.addEventListener('change', e =>{toggleCheckboxes(e.target,firstMoveCheckboxes);})
    });
    
    aiCheckboxes.forEach (elem => {
        elem.addEventListener('change', e => {
            if (aiCheckboxes[0].checked && aiCheckboxes[1].checked){
                e.target === aiCheckboxes[0] ? aiCheckboxes[1].checked = false : aiCheckboxes[0].checked = false;
            }
        })
    });
    //showing result
    let alertDiv = document.querySelector('.alert');
    const showResult = (addCl) => {
        alertDiv.classList.add(addCl);
        alertDiv.textContent = addCl === 'tie' ? "It's tie":`The winner is ${addCl}`;
    };

    //hiding result
    const hideResult = () => {
        alertDiv.classList.remove('tie');
        alertDiv.classList.remove('player1');
        alertDiv.classList.remove('player2');
        alertDiv.textContent = '';
    };
    //Green background for player's move
    const makeGreeny = (elem) => {
        elem.classList.add('greeny');
    };
    //Remove green background
    const remGreeny = (elem) => {
        if(elem.classList.contains('greeny')){
            elem.classList.remove('greeny');
        }
    };
    //Toggle green background
    const switchGreeny = (elemFrom, elemTo) => {
        remGreeny(elemFrom);
        makeGreeny(elemTo);
    };
    //Drawing choose items indicating for moving
    const drawChoose = (status) => {
        let cp = document.querySelectorAll('.choose > div');
        if (!status) {
            cp.forEach (elem => {remGreeny(elem);});
        }
        else {
            gamePlay.getCurrentItem() === gamePlay.player1.item ? switchGreeny(cp[1],cp[0]) : switchGreeny(cp[0],cp[1]);
        }
    };

    return {
        initialiseDivs, content, drawing, enlightWinnerDivs, toggleSelectedItems,firstMoveCheckboxes, aiCheckboxes,
        showResult, hideResult, drawChoose
    }
})();

const player = function () {
    let item;
    let firstmove;
    let AI = false;
    const getPlayerItem = () => {
        return item;
    };
    const getPlayerAi = () => {
        return AI;
    };
    return {item,firstmove, AI, getPlayerItem, getPlayerAi}
};

const gamePlay = (function(){
    let player1 = player ();
    let player2 = player ();
    let currentItem = gameBoard.itemX;
    let gameStatus = false; //false - game is stopped
    let moveCounter = 0;
//Assigns item to player
    const setPlayersItem = () => {
        player1.item = p1.options[p1.selectedIndex].value;
        player2.item = p2.options[p2.selectedIndex].value;
     };
//Setting first move to player
    const setPlayersFirstMove = () => {
        player1.firstmove = displayController.firstMoveCheckboxes[0].checked;
        player2.firstmove = displayController.firstMoveCheckboxes[1].checked;
    };
//Setting AI to players
    const setPlayerAI = () => {
        player1.AI = AI1.checked;
        player2.AI = AI2.checked;
    };
//setting current item for first move
    const setCurrentItem = () => {
        currentItem = player1.firstmove ? player1.item : player2.item;
    };
 //getting current item
    const getCurrentItem = () => {
        return currentItem;
    };
//Starting new game
    const startGame = () => {
        setPlayersItem ();
        setPlayerAI();
        gameBoard.resetFields ();
        gameStatus = true;
        setPlayersFirstMove ();
        setCurrentItem ();
        moveCounter = 0;
        displayController.drawing ();
        displayController.drawChoose(gameStatus);
        if (player1.firstmove && player1.AI ||
            player2.firstmove && player2.AI){
            window.setTimeout(aiMove(), 1500);
        }
    };
    const startBtn = document.querySelector('#start');
    startBtn.addEventListener('click', () =>{
        startGame();
    });
//Stopping the game
    const stopGame = () =>{
        gameStatus = false;
        displayController.showResult(setWinner());
        displayController.drawChoose(gameStatus);
        window.setTimeout(displayController.hideResult,1500);
    };

    const setWinner = () => {
        if (gameBoard.winnerFields.item === null) {
            return 'tie';
        }
        return gameBoard.winnerFields.item === player1.item ? 'player1' : 'player2';
    }
//Changing Item
    const changeCurrentItem = () => {
        currentItem = currentItem === gameBoard.itemX ? gameBoard.itemO : gameBoard.itemX;
    };
    //Function for AI move
    
    const aiMove = () => {
        if (!gameStatus){
            return;
        }
        if ((player1.item === currentItem && !player1.AI) ||
            (player2.item === currentItem && !player2.AI)) {
            return;
        }
        let moveStr = AI.getPosition(AI.minimax(gameBoard.fillIndexes(), currentItem));
        let i = parseInt(moveStr.substring(0,1));
        let j = parseInt(moveStr.substring(1));
        gameBoard.setField(i,j,currentItem);
        displayController.drawing();
        changeCurrentItem();
        moveCounter++;
        if (gameBoard.analise() || moveCounter === 9){
            displayController.enlightWinnerDivs();
            stopGame();
        }
        displayController.drawChoose(gameStatus);
    };
    
    // Function for Addeventlistener for "click" event
    const oneMove = function (elem){
        if (!gameStatus){
            return;
        }
        if ((player1.item === currentItem && player1.AI) ||
            (player2.item === currentItem && player2.AI)) {
            return;
        }
        let i = parseInt(elem.getAttribute('data-ij').substr(0,1));
        let j = parseInt(elem.getAttribute('data-ij').substr(1,1));
        if (gameBoard.setField(i,j,currentItem)){
            displayController.drawing();
            changeCurrentItem();
            moveCounter++;
        }
        if (gameBoard.analise() || moveCounter === 9){
            displayController.enlightWinnerDivs();
            stopGame();
        }
        displayController.drawChoose(gameStatus);
        window.setTimeout(aiMove,1500);
    };

    let arr = Array.from(document.querySelectorAll ('.content div'));
    arr.forEach((elem) =>{
        elem.addEventListener('click', (e) =>{
            oneMove(e.target);
        });
    });

    const getGameStatus = () => {return gameStatus};
    
    return {player1, player2, setPlayersItem, getCurrentItem, getGameStatus, aiMove}
})();

const AI = (function(){
    let position = ['00','01','02','10','11','12','20','21','22'];//1-dimension array
        
    function emptyIndexes(board){
        return  board.filter(s => s !== gameBoard.itemX && s !== gameBoard.itemO);
    };

    //all possibles outcome winner situations in one dimension array
    const winning = (board, player) => {
        if(
          (board[0] == player && board[1] == player && board[2] == player) ||
          (board[3] == player && board[4] == player && board[5] == player) ||
          (board[6] == player && board[7] == player && board[8] == player) ||
          (board[0] == player && board[3] == player && board[6] == player) ||
          (board[1] == player && board[4] == player && board[7] == player) ||
          (board[2] == player && board[5] == player && board[8] == player) ||
          (board[0] == player && board[4] == player && board[8] == player) ||
          (board[2] == player && board[4] == player && board[6] == player)
          ) {
            return true;
            }
        else {
            return false;
            }
      };
     
     const minimax = function (newBoard, player){
        let availSpots = emptyIndexes(newBoard);//finding all possible variants to move
       //assign numeric appraisal for all possible ending game outcomes
       let huPlayer, aiPlayer;
       if (gamePlay.player1.AI && !gamePlay.player2.AI){
            aiPlayer = gamePlay.player1.item;
            huPlayer = gamePlay.player2.item;
        }
        else if (gamePlay.player2.AI && !gamePlay.player1.AI){
            aiPlayer = gamePlay.player2.item;
            huPlayer = gamePlay.player1.item;
        }

        if (winning (newBoard,huPlayer)){
            return {score:-10};
        }
        else if (winning (newBoard, aiPlayer)){
            return {score:10};
        }
        else if (availSpots.length === 0) {
            return {score:0};
        }
        // массив для хранения всех объектов
        let moves = [];

        // цикл по доступным клеткам
        for (let i = 0; i < availSpots.length; i++){
            //create an object for each and store the index of that spot
            let move = {};
            move.index = newBoard[availSpots[i]];

            // совершить ход за текущего игрока
            newBoard[availSpots[i]] = player;

            //получить очки, заработанные после вызова минимакса от противника текущего игрока
            if (player === aiPlayer){
                let result = minimax(newBoard, huPlayer);
                move.score = result.score;
            }
            else{
                let result = minimax(newBoard, aiPlayer);
                move.score = result.score;
            }

            // очистить клетку
            newBoard[availSpots[i]] = move.index;

            // положить объект в массив
            moves.push(move);
        }

        // если это ход ИИ, пройти циклом по ходам и выбрать ход с наибольшим количеством очков
        let bestMove;
        if(player === aiPlayer){
            let bestScore = -10000;
            for(let i = 0; i < moves.length; i++){
                if(moves[i].score > bestScore){
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }
        else {
        // иначе пройти циклом по ходам и выбрать ход с наименьшим количеством очков
            let bestScore = 10000;
            for(let i = 0; i < moves.length; i++){
                if(moves[i].score < bestScore){
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }
        // вернуть выбранный ход (объект) из массива ходов
       
        return moves[bestMove];
    };

    //minimax function newBoard - board with current situation on it
    
    const getPosition = (objBestMove) => {
        return position[objBestMove.index];
    };
    return {minimax, getPosition}
})();

