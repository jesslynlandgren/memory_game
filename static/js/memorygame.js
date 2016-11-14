
//Card constructor
function Card(num) {
    // this.id = counter++;
    this.num = num;
    this.open = false;
    this.matched = false;
    // this.url = '';
}
// method for getting card image
Card.prototype.getImageUrl = function() {
    if (this.num < 10) {
        return 'static/img/monsters-0' + this.num + '.png';
    } else {
        return 'static/img/monsters-' + this.num + '.png';
    }
    // if (this.open) {
    //     if (this.num < 10) {
    //         return 'static/img/monsters-0' + this.num + '.png';
    //     } else {
    //         return 'static/img/monsters-' + this.num + '.png';
    //     }
    // } else {
    //     return 'static/img/logo-bw.png';
    // }
};

//CardSet constructor (creates array of all cards for game board)
function CardSet(setSize) {
    this.cards = [];
    for (var i=0; i<(setSize/2); i++) {
        num = Math.floor(Math.random()*16)+1;
        this.cards.push(new Card(num));
        this.cards.push(new Card(num));
    }
}
//CardSet shuffle method
CardSet.prototype.shuffle = function() {
    var shuffled = [];
    var setLength = this.cards.length;
    while (setLength > 0) {
        var j = Math.floor(Math.random() * setLength);
        var randCard = this.cards.splice(j, 1);
        shuffled.push(randCard[0]);
        setLength -= 1;
    }
    this.cards = shuffled;
};

CardSet.prototype.draw = function() {
    var card1 = this.cards.pop();
    return card1;
};



var app = angular.module('memorygame', []);
app.controller('MainController', function($scope, $timeout) {

    $scope.range = function(n) {
        return new Array(n);
    };

    $scope.makeGrid = function(){
        $scope.grid = [];
        for (var i=0; i<$scope.rows; i++){
            var empty = [];
            $scope.grid.push(empty);
            for (var j=0; j<$scope.rowLength; j++){
                $scope.grid[i][j] = $scope.cardSet.draw();
            }
        }
    };

    $scope.setEasy = function() {
        $scope.mode="easy";
        $scope.easyActive = true;
        $scope.mediumActive = false;
        $scope.hardActive = false;
        $scope.newGame();
    };
    $scope.setMedium = function() {
        $scope.mode="medium";
        $scope.easyActive = false;
        $scope.mediumActive = true;
        $scope.hardActive = false;
        $scope.newGame();
    };
    $scope.setHard = function() {
        $scope.mode="hard";
        $scope.easyActive = false;
        $scope.mediumActive = false;
        $scope.hardActive = true;
        $scope.newGame();
    };

    $scope.getModeSize = function (){
        switch ($scope.mode) {
            case 'easy':
                $scope.rows = 2;
                $scope.rowLength = 4;
                $scope.numCards = 8;
                break;
            case 'medium':
                $scope.rows = 3;
                $scope.rowLength = 6;
                $scope.numCards = 18;
                break;
            case 'hard':
                $scope.rows = 4;
                $scope.rowLength = 8;
                $scope.numCards = 32;
        }
    };

    $scope.newGame = function () {
        $scope.youWon = false;
        $scope.state = 'first';
        $scope.getModeSize();
        $scope.cardSet = new CardSet($scope.numCards);
        $scope.cardSet.shuffle();
        $scope.makeGrid();
    };

    $scope.flipCard = function (row,col) {
        if ($scope.state === 'first'){
            $scope.firstCard = $scope.grid[row][col];
            $scope.firstCard.open = true;
            $scope.state = 'second';
        } else if ($scope.state==='second'){
            $scope.secondCard = $scope.grid[row][col];
            $scope.secondCard.open = true;
            if ($scope.firstCard.num === $scope.secondCard.num){
                $scope.firstCard.matched = true;
                $scope.secondCard.matched = true;
                $scope.state = 'first';
            } else {
                $scope.state = 'showing-cards';
                $timeout(function() {
                    $scope.firstCard.open = false;
                    $scope.secondCard.open = false;
                    $scope.state = 'first';
                }, 1000);
            }
        } else if($scope.state==='showing-cards') {
            //nothing
        }
        $scope.win = $scope.checkWin();
        if ($scope.win) {
            $scope.youWon = true;
        }
    };

    $scope.checkWin = function () {
        return $scope.grid.every(function (a){
            return a.every(function(b){
                return b.matched;
            });
        });
    };

    $scope.setEasy();
    $scope.newGame();

});
