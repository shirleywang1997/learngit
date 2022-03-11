var board=new Array();
var score=0;
var hasConflicted=new Array();  //每一个格子，是否已经进行过碰撞

$(document).ready(function(){   //这里的function是匿名函数
    newgame();
});

function newgame(){
    //初始化棋盘格
    init();
    //在随机两个格子生成数字
    generateOneNumber();
    generateOneNumber();
}

function init(){
    for(var i=0;i<4;i++){
    for(var j=0;j<4;j++){
        var gridCell=$("#grid-cell-"+i+"-"+j);
        //jQuery,css()方法,把该变量的css的top属性值设为getPosTop函数的返回值
        gridCell.css("top",getPosTop(i,j));   
        gridCell.css("left",getPosLeft(i,j));
      }
    }
    //把一维数组里每个变量再设为一个一维数组，则整体成为二维数组
    for(var i=0;i<4;i++){
        board[i]=new Array();
        hasConflicted[i]=new Array();
        for(var j=0;j<4;j++){ //把16个数据初始值设为0
            board[i][j]=0;
            hasConflicted[i][j]=false;
        }
    }
    updateBoardView(); //根据后端的board变量对前端的html页面进行改变
    score=0;
}

//根据后端数据的更新，去更新前端页面
function updateBoardView(){

    $(".number-cell").remove();
    for(var i=0;i<4;i++){
        for(var j=0;j<4;j++){
            //这单引号双引号的，有点迷
            $("#grid-container").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>');
            var theNumberCell=$("#number-cell-"+i+"-"+j);

            if(board[i][j]==0){
                theNumberCell.css("width","0px");
                theNumberCell.css("height","0px");
                theNumberCell.css("top",getPosTop(i,j)+50);
                theNumberCell.css("left",getPosLeft(i,j)+50);
            }
            else{
                theNumberCell.css("width","100px");
                theNumberCell.css("height","100px");
                theNumberCell.css("top",getPosTop(i,j));
                theNumberCell.css("left",getPosLeft(i,j));
                theNumberCell.css("background-color",getNumberBackgroundColor(board[i][j]));
                theNumberCell.css("color",getNumberColor(board[i][j]));
                theNumberCell.text(board[i][j]);
            }
            hasConflicted[i][j]=false;
        }
    }

}

function generateOneNumber(){

    if(nospace(board))
        return false;

    //随机一个位置
    var randx= parseInt(Math.floor(Math.random()*4));
    var randy= parseInt(Math.floor(Math.random()*4));
    while(true){
        if(board[randx][randy]==0)
        break;

       randx= parseInt(Math.floor(Math.random()*4));
       randy= parseInt(Math.floor(Math.random()*4));
    }
    //随机一个数字,50%的概率是2，50%的概率是4
    var randNumber=Math.random()<0.5 ? 2:4;
    //在随机位置显示随机数字
    board[randx][randy]=randNumber;
    showNumberWithAnimation(randx,randy,randNumber);
    return true;
}


$(document).keydown(function(event){  //keydown:按下一个按键，ready：页面准备就绪
    switch(event.keyCode){
        case 37: //left
            if(moveLeft()){
                setTimeout("generateOneNumber()",300);
                setTimeout("isgameover()",350);
            }
            break;
        case 38:   //up
            if(moveUp()){
                setTimeout("generateOneNumber()",300);
                setTimeout("isgameover()",350);
            }
            break;
        case 39:  //right
            if(moveRight()){
                setTimeout("generateOneNumber()",300);
                setTimeout("isgameover()",350);
            }
            break;
        case 40:  //down
            if(moveDown()){
                setTimeout("generateOneNumber()",300);
                setTimeout("isgameover()",350);
            }
            break;
        default:
            break;

    }
});


function isgameover(){
    if(nospace(board) && nomove(board) ){
        gameover();
    }
}

function gameover(){
    alert("gameover");
}


function moveLeft(){
    if( !canMoveLeft(board))
        return false;

    for(var i=0;i<4;i++){
        for(var j=1;j<4;j++){
            if(board[i][j]!=0){
                for(var k=0;k<j;k++){
                    if(board[i][k]==0 && noBlockHorizontal(i,k,j,board)){
                        showMoveAnimation(i,j,i,k);
                        board[i][k]=board[i][j];
                        board[i][j]=0;
                    }
                    else if(board[i][k]==board[i][j] && noBlockHorizontal(i,k,j,board)
                    && !hasConflicted[i][k]){
                        showMoveAnimation(i,j,i,k);
                        board[i][k]+=board[i][j];
                        board[i][j]=0;
                        score+=board[i][k];
                        updateScore(score); //把更新的score数据通知前端
                        hasConflicted[i][k]=true;
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()",200);
    return true;
}


function moveUp(){
    if( !canMoveUp(board))
        return false;

    for(var i=1;i<4;i++){
        for(var j=0;j<4;j++){
            if(board[i][j]!=0){
                for(var k=0;k<i;k++){
                    if(board[k][j]==0 && noBlockVertical(k,i,j,board)){
                        showMoveAnimation(i,j,k,j);
                        board[k][j]=board[i][j];
                        board[i][j]=0;                     
                    }
                    else if(board[k][j]==board[i][j] && noBlockVertical(k,i,j,board)
                    && !hasConflicted[k][j]){
                        showMoveAnimation(i,j,k,j);
                        board[k][j]+=board[i][j];
                        board[i][j]=0;    
                        score+=board[k][j];
                        updateScore(score);  
                        hasConflicted[k][j]=true;                
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()",200);
    return true;
}


function moveRight(){
    if( !canMoveRight(board))
        return false;
                                                                   
    for(var i=0;i<4;i++){
        for(var j=0;j<3;j++){
            if(board[i][j]!=0){
                for(var k=3;k>j;k--){
                    if(board[i][k]==0 && noBlockHorizontal(i,j,k,board)){
                        showMoveAnimation(i,j,i,k);
                        board[i][k]=board[i][j];
                        board[i][j]=0;
                    }
                    else if(board[i][k]==board[i][j] && noBlockHorizontal(i,j,k,board)
                    && !hasConflicted[i][k]){
                        showMoveAnimation(i,j,i,k);
                        board[i][k]+=board[i][j];
                        board[i][j]=0;
                        score+=board[i][k];
                        updateScore(score); 
                        hasConflicted[i][k]=true;
                     }
                }
            }
        }
    }
    setTimeout("updateBoardView()",200);
    return true;
}


function moveDown(){
    if( !canMoveDown(board))
        return false;

    for(var i=0;i<3;i++){
        for(var j=0;j<4;j++){
            if(board[i][j]!=0){
                for(var k=3;k>i;k--){
                    if(board[k][j]==0 && noBlockVertical(i,k,j,board)){
                        showMoveAnimation(i,j,k,j);
                        board[k][j]=board[i][j];
                        board[i][j]=0;                     
                    }
                    else if(board[k][j]==board[i][j] && noBlockVertical(i,k,j,board)
                    && !hasConflicted[k][j]){
                        showMoveAnimation(i,j,k,j);
                        board[k][j]+=board[i][j];
                        board[i][j]=0;  
                        score+=board[k][j];
                        updateScore(score);          
                        hasConflicted[k][j]=true;          
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()",200);
    return true;
}

