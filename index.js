var size;
var board;
var breakDiv;
var historyDiv;
var a;
var pieceDragged;
var lastX;
var lastY;
var breakEl;
var el1;
var el2;
var el3;
var el4;
var buttonsDiv;
var timeout1;
var timeout2;
var winningDiv;

var name1;
var time1;
var name2;
var time2;
var labelName1;
var labelName2;
var labelTime1;
var labelTime2;
var hours1;
var hours2;
var minutes1;
var minutes2;
var seconds1;
var seconds2;
var player1;
var player2;
var boardRotated;
var muted;

preNewGame();

function preNewGame2(){
  if(board.element) board.element.remove();
  if(detailedDiv) detailedDiv.remove();
  if(breakEl) breakEl.remove();
  if(breakDiv) breakDiv.remove();
  if(buttonsDiv) buttonsDiv.remove();
  board="";
  document.onmouseup=()=>{};
  document.onmousemove=()=>{};
  document.ontouchmove=()=>{};
  document.ontouchend=()=>{};
  document.ontouchstart=()=>{};
  preNewGame();
}

function preNewGame(){
  name1=document.createElement("input");
  name1.id="name1";
  name1.type="text";
  name1.style.width="35%";
  if(player1 && player1.name) name1.value=player1.name;
  else name1.value="Player 1";
  name2=document.createElement("input");
  name2.id="name2";
  name2.type="text";
  name2.style.width="35%"
  if(player2 && player2.name) name2.value=player2.name;
  else name2.value="Player 2";
  name1.style.marginLeft="10%";
  name2.style.marginLeft="5%";
  name1.style.marginRight="5%";
  name2.style.marginRight="10%";
  labelName1=document.createElement("label");
  labelName1.htmlFor="name1";
  labelName2=document.createElement("label");
  labelName2.htmlFor="name2";
  labelName1.innerHTML="White Player: "
  labelName2.innerHTML="Black Player: "
  labelName1.style.width="35%"
  labelName2.style.width="35%"
  labelName1.style.marginLeft="10%";
  labelName2.style.marginLeft="5%";
  labelName1.style.marginRight="5%";
  labelName2.style.marginRight="10%";
  labelName1.style.marginTop="50px";
  labelName2.style.marginTop="50px";
  document.getElementById("body").appendChild(labelName1);
  document.getElementById("body").appendChild(labelName2);
  document.getElementById("body").appendChild(name1);
  document.getElementById("body").appendChild(name2);

  time1=document.createElement("div");
  time1.id="time1";
  time1.style.width="35%";
  time2=document.createElement("div");
  time2.id="time2";
  time2.style.width="35%"
  time1.style.marginLeft="10%";
  time2.style.marginLeft="5%";
  time1.style.marginRight="5%";
  time2.style.marginRight="10%";
  labelTime1=document.createElement("label");
  labelTime1.htmlFor="name1";
  labelTime2=document.createElement("label");
  labelTime2.htmlFor="name2";
  labelTime1.innerHTML="Time (h:m:s)"
  labelTime2.innerHTML="Time (h:m:s)"
  labelTime1.style.width="35%"
  labelTime2.style.width="35%"
  labelTime1.style.marginLeft="10%";
  labelTime2.style.marginLeft="5%";
  labelTime1.style.marginRight="5%";
  labelTime2.style.marginRight="10%";
  labelTime1.style.textAlign="center";
  labelTime2.style.textAlign="center";
  document.getElementById("body").appendChild(labelTime1);
  document.getElementById("body").appendChild(labelTime2);
  document.getElementById("body").appendChild(time1);
  document.getElementById("body").appendChild(time2);


  hours1=document.createElement("input");
  hours1.id="hours1";
  hours1.type="number";
  hours1.style.width="20%";
  hours1.value=0;
  minutes1=document.createElement("input");
  minutes1.id="minutes1";
  minutes1.type="number";
  minutes1.style.width="20%";
  minutes1.value=10;
  seconds1=document.createElement("input");
  seconds1.id="seconds1";
  seconds1.type="number";
  seconds1.style.width="20%";
  seconds1.value=0;
  hours1.style.marginLeft="10%";
  minutes1.style.marginLeft="5%";
  seconds1.style.marginLeft="5%";
  hours1.style.marginRight="5%";
  minutes1.style.marginRight="10%";
  seconds1.style.marginRight="5%";
  document.getElementById("time1").appendChild(hours1);
  document.getElementById("time1").appendChild(minutes1);
  document.getElementById("time1").appendChild(seconds1);

  hours2=document.createElement("input");
  hours2.id="hours2";
  hours2.type="number";
  hours2.style.width="20%";
  hours2.value=0;
  minutes2=document.createElement("input");
  minutes2.id="minutes2";
  minutes2.type="number";
  minutes2.style.width="20%"
  minutes2.value=10;
  seconds2=document.createElement("input");
  seconds2.id="seconds1";
  seconds2.type="number";
  seconds2.style.width="20%"
  seconds2.value=0;
  hours2.style.marginLeft="10%";
  minutes2.style.marginLeft="5%";
  seconds2.style.marginLeft="5%";
  hours2.style.marginRight="5%";
  minutes2.style.marginRight="10%";
  seconds2.style.marginRight="5%";
  seconds2.max="59";
  seconds1.max="59";

  minutes2.max="59";
  minutes1.max="59";

  hours2.max="10";
  hours1.max="10";

  seconds2.min="0";
  seconds1.min="0";

  minutes2.min="0";
  minutes1.min="0";

  hours2.min="0";
  hours1.min="0";
  document.getElementById("time2").appendChild(hours2);
  document.getElementById("time2").appendChild(minutes2);
  document.getElementById("time2").appendChild(seconds2);


  breakDiv=document.createElement("div");
  document.getElementById("body").appendChild(breakDiv);
  breakDiv.id="break-div"
  breakDiv.style.width="100%";
  breakDiv.style.height="1px"

  startGame=document.createElement("button");
  startGame.id="start-game-btn";
  startGame.style.margin="auto";
  startGame.style.marginLeft="40%";
  startGame.style.marginRight="40%";
  startGame.style.marginTop="40px";
  startGame.style.width="20%";
  startGame.style.height="30px";
  startGame.innerHTML="Start a new game";
  startGame.onclick=(e) => {
    if(hours1.value<hours1.min) hours1.value=hours1.min;
    if(hours1.value>hours1.max) hours1.value=hours1.max;

    if(hours2.value<hours2.min) hours2.value=hours2.min;
    if(hours2.value>hours2.max) hours2.value=hours2.max;

    if(minutes1.value<minutes1.min) minutes1.value=minutes1.min;
    if(minutes1.value>minutes1.max) minutes1.value=minutes1.max;

    if(minutes2.value<minutes2.min) minutes2.value=minutes2.min;
    if(minutes2.value>minutes2.max) minutes2.value=minutes2.max;

    if(seconds1.value<seconds1.min) seconds1.value=seconds1.min;
    if(seconds1.value>seconds1.max) seconds1.value=seconds1.max;

    if(seconds2.value<seconds2.min) seconds2.value=seconds2.min;
    if(seconds2.value>seconds2.max) seconds2.value=seconds2.max;

    player1=new Player(name1.value, "w", new Timer(parseInt(hours1.value*3600)+parseInt(minutes1.value*60)+parseInt(seconds1.value), name1.value, "w"));
    player2=new Player(name2.value, "b", new Timer(parseInt(hours2.value*3600)+parseInt(minutes2.value*60)+parseInt(seconds2.value), name2.value, "b"));

    name1.remove();
    name2.remove();
    labelName1.remove();
    labelName2.remove();

    time1.remove();
    time2.remove();
    labelTime1.remove();
    labelTime2.remove();

    breakDiv.remove();
    swapColors.remove();
    startGame.remove();
    el4.remove();
    newGame();
  }
  boardRotated=false;
  swapColors=document.createElement("button");
  swapColors.id="swap-colors-btn";
  swapColors.style.margin="auto";
  swapColors.style.marginLeft="40%";
  swapColors.style.marginRight="40%";
  swapColors.style.marginTop="5px";
  swapColors.style.width="20%";
  swapColors.style.height="30px";
  swapColors.innerHTML="Swap colors";
  document.getElementById("body").appendChild(startGame);
  document.getElementById("body").appendChild(swapColors);
  swapColors.onclick=(e) => {
    if(boardRotated) boardRotated=false;
    else boardRotated=true;
    var temp=name1.value;
    name1.value=name2.value;
    name2.value=temp;
    temp=hours1.value;
    hours1.value=hours2.value;
    hours2.value=temp;
    temp=minutes1.value;
    minutes1.value=minutes2.value;
    minutes2.value=temp;
    temp=seconds1.value;
    seconds1.value=seconds2.value;
    seconds2.value=temp;
    if(boardRotated){
      name1.style.backgroundColor="indianred";
      name2.style.backgroundColor="aqua";
      name1.style.color="#fff";
      name2.style.color="";

      hours1.style.backgroundColor="indianred";
      hours2.style.backgroundColor="aqua";
      minutes1.style.backgroundColor="indianred";
      minutes2.style.backgroundColor="aqua";
      seconds1.style.backgroundColor="indianred";
      seconds2.style.backgroundColor="aqua";
      hours1.style.color="#fff";
      hours2.style.color="";
      minutes2.style.color="";
      minutes1.style.color="#fff";
      seconds2.style.color="";
      seconds1.style.color="#fff";
    }
    else{
      name1.style.backgroundColor="aqua";
      name2.style.backgroundColor="indianred";
      name1.style.color="";
      name2.style.color="#fff";

      hours1.style.backgroundColor="aqua";
      hours2.style.backgroundColor="indianred";
      minutes1.style.backgroundColor="aqua";
      minutes2.style.backgroundColor="indianred";
      seconds1.style.backgroundColor="aqua";
      seconds2.style.backgroundColor="indianred";
      hours1.style.color="";
      hours2.style.color="#fff";
      minutes1.style.color="";
      minutes2.style.color="#fff";
      seconds1.style.color="";
      seconds2.style.color="#fff";
    }
    clearInterval(timeout1);
    clearInterval(timeout2);
    name1.style.transition="all 0.3s";
    name2.style.transition="all 0.3s";


    time1.style.transition="all 0.3s";
    time2.style.transition="all 0.3s";


    hours1.style.transition="all 0.3s";
    hours2.style.transition="all 0.3s";
    minutes1.style.transition="all 0.3s";
    minutes2.style.transition="all 0.3s";
    seconds1.style.transition="all 0.3s";
    seconds2.style.transition="all 0.3s";
    timeout1=setTimeout(()=>{
      name1.style.backgroundColor="";
      name2.style.backgroundColor="";
      name1.style.color="";
      name2.style.color="";
      hours1.style.color="";
      hours2.style.color="";
      minutes1.style.color="";
      minutes2.style.color="";
      seconds1.style.color="";
      seconds2.style.color="";
      hours1.style.backgroundColor="";
      hours2.style.backgroundColor="";
      minutes1.style.backgroundColor="";
      minutes2.style.backgroundColor="";
      seconds1.style.backgroundColor="";
      seconds2.style.backgroundColor="";
      timeout2=setTimeout(()=>{
      name1.style.transition="";
      name2.style.transition="";
      hours1.style.transition="";
      hours2.style.transition="";
      minutes1.style.transition="";
      minutes2.style.transition="";
      seconds1.style.transition="";
      seconds2.style.transition="";
    }, 350)
    }, 1000);
    }
    el4=document.createElement("button");
    el4.innerHTML="Back to home page";
    el4.onclick= () => window.location.href = "http://ammarveljagic.me";
    el4.ontouchend= () => window.location.href = "http://ammarveljagic.me";
    el4.style.height="30px";
    el4.style.margin="auto";
    el4.style.marginLeft="40%";
    el4.style.marginRight="40%";
    el4.style.marginTop="5px";
    el4.style.width="20%";
    document.getElementById("body").appendChild(el4);
}

function newGame(){
  size=1000;
  board = new Board(player1,player2,size);

  if(boardRotated) board.rotate();

  breakDiv=document.createElement("div");
  document.getElementById("body").appendChild(breakDiv);
  breakDiv.id="break-div";

  for(var j=0; j<8; j++){
    var coordinate=document.createElement("div");
    coordinate.classList.add("coordinate-y");
    coordinate.innerHTML=j+1;
    coordinate.style.height=size/8;
    coordinate.style.width="10px";
    if(board.rotated) var rotate=" rotate(180deg)";
    else rotate=" rotate(0deg)"
    var y=size/16-8;
    coordinate.style.transform="translate(-10px, "+y+"px)"+rotate;
    board.element.appendChild(coordinate);
  }
  for(var j=0; j<8; j++){
    var coordinate=document.createElement("div");
    coordinate.classList.add("coordinate-x");
    coordinate.innerHTML=8-j;
    coordinate.style.position="absolute";
    board.element.appendChild(coordinate);
  }

  detailedDiv=document.createElement("div");
  detailedDiv.id="detailed-div"
  document.getElementById("body").appendChild(detailedDiv);
  if(boardRotated) document.getElementById("detailed-div").appendChild(board.whitePlayer.timer.element);
  else document.getElementById("detailed-div").appendChild(board.blackPlayer.timer.element);

  historyDiv=document.createElement("div");
  document.getElementById("detailed-div").appendChild(historyDiv);
  historyDiv.id="history";
  historyDiv.innerHTML="<p>History: </p>"
  if(boardRotated) document.getElementById("detailed-div").appendChild(board.blackPlayer.timer.element);
  else document.getElementById("detailed-div").appendChild(board.whitePlayer.timer.element);

  boardRotated=false;


  a=document.createElement("div");
  a.classList.add("last-move");
  document.getElementById("board").appendChild(a);
  a=document.createElement("div");
  a.classList.add("last-move");
  document.getElementById("board").appendChild(a);


  pieceDragged=false;
  lastX="";
  lastY="";
  updateSize();
  window.onresize = () => updateSize();

  function updateSize(){
    size=1000;
    const maxSize = Math.min(window.innerHeight, window.innerWidth);
    if(maxSize<350){
      size=240;
    }
    else if(maxSize<450){
      size=320;
    }
    else if(maxSize<520){
      size=400;
    }
    else if(maxSize<650){
      size=480;
    }
    else if(maxSize<700){
      size=560;
    }
    else if(maxSize<780){
      size=640;
    }
    else if(maxSize<880){
      size=720;
    }
    else if(maxSize<1050){
      size=800;
    }
    if(board.element){
      board.setSize(size);
      if(board.selectedPiece){
        var selectedPieceDiv=document.getElementsByClassName("selected-piece")[0];
        selectedPieceDiv.style.width=size/8+"px";
        selectedPieceDiv.style.height=size/8+"px";
        selectedPieceDiv.style.transform="translate("+board.selectedPiece[1]*size/8+"px, "+board.selectedPiece[0]*size/8+"px)"
      }
      lastMoveDivs=document.getElementsByClassName("last-move");
      var i=-1;
      while(++i<lastMoveDivs.length){
          if(board.lastMove){
          lastMoveDivs[i].style.width=size/8+"px";
          lastMoveDivs[i].style.height=size/8+"px";
          lastMoveDivs[i].style.transform="translate("+board.lastMove[i][1]*size/8+"px, "+board.lastMove[i][0]*size/8+"px)"
        }
      }
      var promotionElement2=document.getElementsByClassName("promotion-div2")[0];
      if(promotionElement2){
        promotionElement2.style.width=window.innerWidth-20;
        promotionElement2.style.height=window.innerHeight+scrollY-5;
        promotionElement2.style.position="absolute";
        promotionElement2.style.top="-20px"
        if(board.rotated){
          promotionElement2.style.bottom="-"+board.element.offsetTop;
          promotionElement2.style.right="-"+board.element.offsetLeft;
          promotionElement2.style.left="";
        }
        else {
          promotionElement2.style.left="-"+board.element.offsetLeft;
          promotionElement2.style.right="";
          promotionElement2.style.bottom="";
        }
      }
      var promotionElement=document.getElementsByClassName("promotion-div")[0];
      if(promotionElement){
        promotionElement.style.width=size/2;
        promotionElement.style.height=size/8;
        var rotate=board.rotated ? " rotate(180deg)" : " rotate(0deg)";
        var translateX=size/4;
        var translateY=size/2-size/16;
        promotionElement.style.transform="translate("+translateX+"px, "+translateY+"px)"+rotate;
      }
      if(screen.width<800 || window.innerWidth<800){
        breakDiv.style.width="100%";
        breakDiv.style.height="1px"
        detailedDiv.style.marginLeft="auto";
        detailedDiv.style.marginTop="25px";
        historyDiv.style.width="350px";
        historyDiv.style.height="450px";
        board.element.style.marginRight="auto";
      }
      else{
        breakDiv.style.width="";
        breakDiv.style.height=""
        detailedDiv.style.marginLeft="";
        detailedDiv.style.marginTop="";
        historyDiv.style.width="";
        historyDiv.style.height="";
        board.element.style.marginRight="";
      }
    }
    var coordinate=document.getElementsByClassName("coordinate-y");
    for(var j=0; j<8; j++){
      if(!coordinate[j]) continue;
      coordinate[j].innerHTML=8-j;
      coordinate[j].style.height=size/8;
      coordinate[j].style.width="10px";
      if(board.rotated) var rotate=" rotate(180deg)";
      else rotate=" rotate(0deg)"
      var x=-10;
      y=size/16-8;
      if(board.rotated){
        x=size;
        y=-size/16+8;
      }
      coordinate[j].style.transform="translate("+x+"px, "+y+"px)"+rotate;
    }
    coordinate=document.getElementsByClassName("coordinate-x");
    for(j=0; j<8; j++){
      if(!coordinate[j]) continue;
      coordinate[j].innerHTML=String.fromCharCode('a'.charCodeAt(0)+j);
      coordinate[j].style.height="15px";
      coordinate[j].style.width=size/8;
      if(board.rotated) var rotate=" rotate(180deg)";
      else rotate=" rotate(0deg)"
      x=j*size/8+size/16-4;
      y=0
      if(board.rotated){
        x=j*size/8-size/16+4;
        y=-size-15;
      }
      coordinate[j].style.transform="translate("+x+"px, "+y+"px)"+rotate;
    }
    if(winningDiv){
      winningDiv.style.height=size/4;
      winningDiv.style.top=size/2;
      winningDiv.style.lineHeight=size/4+"px";
      winningDiv.style.fontSize=size/8;
    }
  }

  document.onmouseup=(e)=>{
    e.preventDefault();
    var elements=document.getElementsByClassName("figure");
    i=-1;
    while(++i<elements.length) elements[i].style.zIndex="";
    var newField=[Math.floor((e.y-board.element.offsetTop+scrollY)*8/board.size), Math.floor((e.x-board.element.offsetLeft)*8/board.size)];
    if(board.rotated){
      newField[0]=7-newField[0];
      newField[1]=7-newField[1];
    }
    if(newField[0]<0 || newField[0]>7 || newField[1]>7 || newField[1]<0) var newPiece="";
    else newPiece=board.fields[newField[0]][newField[1]]+"";
    var resetPiece=true;
    if(board.selectedPiece){
      if(board.pieceCanMove){
        resetPiece=false;
        if(board.move([[parseInt(board.selectedPiece[0]), parseInt(board.selectedPiece[1])], newField, newPiece])) board.selectedPiece="";
        else resetPiece=true;
      }
      if(resetPiece){
        var element=document.getElementById(board.selectedPiece[0]+"-"+board.selectedPiece[1]);
        var translateX = board.selectedPiece[1]*board.size/8;
        var translateY = board.selectedPiece[0]*board.size/8;
        var rotate=board.rotated ? " rotate(180deg)" : " rotate(0deg)";
        element.style.transform="translate("+translateX+"px, "+translateY+"px)"+rotate;
      }
    }

    if(!pieceDragged) {board.selectedPiece=""; board.hideMoves();}
    else{pieceDragged=false;}
    var selectedPieceDiv=document.getElementsByClassName("selected-piece")[0];
    if(selectedPieceDiv) selectedPieceDiv.remove();
    if(board.selectedPiece){
      selectedPieceDiv=document.createElement("div");
      selectedPieceDiv.classList.add("selected-piece");
      document.getElementById("board").appendChild(selectedPieceDiv);
      selectedPieceDiv.style.width=size/8+"px";
      selectedPieceDiv.style.height=size/8+"px";
      selectedPieceDiv.style.transform="translate("+board.selectedPiece[1]*size/8+"px, "+board.selectedPiece[0]*size/8+"px)"
    }
  }

  document.onmousemove=(e)=>{
    e.preventDefault();
    if(pieceDragged){
      var element=document.getElementById(board.selectedPiece[0]+"-"+board.selectedPiece[1]);
      var translateX = e.x-board.element.offsetLeft-board.size/16+scrollX;
      if(board.rotated) translateX=board.size-translateX-board.size/8;
      if(translateX<-board.size/16) translateX=-board.size/16+scrollX
      if(translateX>board.size-board.size/16) translateX=board.size-board.size/16+scrollX
      var translateY = e.y-board.element.offsetTop-board.size/16+scrollY;
      if(board.rotated) translateY=board.size-translateY-board.size/8;
      if(translateY<-board.size/16) translateY=-board.size/16+scrollY
      if(translateY>board.size-board.size/16) translateY=board.size-board.size/16+scrollY
      var rotate=board.rotated ? " rotate(180deg)" : " rotate(0deg)";
      element.style.transform="translate("+translateX+"px, "+translateY+"px)"+rotate;
    }
  }

  document.ontouchmove=(e)=>{
    e.preventDefault();
    if(pieceDragged){
      var element=document.getElementById(board.selectedPiece[0]+"-"+board.selectedPiece[1]);
      var translateX = e.touches[0].clientX-board.element.offsetLeft-board.size/16+scrollX;
      if(board.rotated) translateX=board.size-translateX-board.size/8;
      if(translateX<-board.size/16) translateX=-board.size/16+scrollX
      if(translateX>board.size-board.size/16) translateX=board.size-board.size/16+scrollX
      var translateY = e.touches[0].clientY-board.element.offsetTop-board.size/16+scrollY;
      if(board.rotated) translateY=board.size-translateY-board.size/8;
      if(translateY<-board.size/16) translateY=-board.size/16+scrollY
      if(translateY>board.size-board.size/16) translateY=board.size-board.size/16+scrollY
      var rotate=board.rotated ? " rotate(180deg)" : " rotate(0deg)";
      element.style.transform="translate("+translateX+"px, "+translateY+"px)"+rotate;
      lastX=e.touches[0].clientX;
      lastY=e.touches[0].clientY;
    }
  }

  document.ontouchend=(e)=>{
    e.preventDefault();
    var elements=document.getElementsByClassName("figure");
    i=-1;
    while(++i<elements.length) elements[i].style.zIndex="";
    var newField=[Math.floor((lastY-board.element.offsetTop)*8/board.size), Math.floor((lastX-board.element.offsetLeft)*8/board.size)];
    if(board.rotated){
      newField[0]=7-newField[0];
      newField[1]=7-newField[1];
    }
    if(newField[0]<0 || newField[0]>7 || newField[1]>7 || newField[1]<0) var newPiece="";
    else newPiece=board.fields[newField[0]][newField[1]]+"";
    var resetPiece=true;
    if(board.selectedPiece){
      if(board.pieceCanMove){
        resetPiece=false;
        if(board.move([[parseInt(board.selectedPiece[0]), parseInt(board.selectedPiece[1])], newField, newPiece])) board.selectedPiece="";
        else resetPiece=true;
      }
      if(resetPiece){
        var element=document.getElementById(board.selectedPiece[0]+"-"+board.selectedPiece[1]);
        var translateX = board.selectedPiece[1]*board.size/8;
        var translateY = board.selectedPiece[0]*board.size/8;
        var rotate=board.rotated ? " rotate(180deg)" : " rotate(0deg)";
        element.style.transform="translate("+translateX+"px, "+translateY+"px)"+rotate;
      }
    }

    if(!pieceDragged) {board.selectedPiece=""; board.hideMoves();}
    else{pieceDragged=false;}
    var selectedPieceDiv=document.getElementsByClassName("selected-piece")[0];
    if(selectedPieceDiv) selectedPieceDiv.remove();
    if(board.selectedPiece){
      selectedPieceDiv=document.createElement("div");
      selectedPieceDiv.classList.add("selected-piece");
      document.getElementById("board").appendChild(selectedPieceDiv);
      selectedPieceDiv.style.width=size/8+"px";
      selectedPieceDiv.style.height=size/8+"px";
      selectedPieceDiv.style.transform="translate("+board.selectedPiece[1]*size/8+"px, "+board.selectedPiece[0]*size/8+"px)"
    }
  }

  document.ontouchstart=(e)=>{
    e.preventDefault();
    lastX=e.touches[0].clientX;
    lastY=e.touches[0].clientY;
  }

  breakEl=document.createElement("div");
  breakEl.classList.add("break");
  document.getElementById("body").appendChild(breakEl);

  buttonsDiv=document.createElement("div");
  buttonsDiv.id="buttons-div"
  document.getElementById("body").appendChild(buttonsDiv);

  el1=document.createElement("button");
  el1.innerHTML="Switch sides";
  el1.onclick=()=>board.rotate();
  el1.ontouchend=()=>board.rotate();
  el1.style.height="30px";
  document.getElementById("buttons-div").appendChild(el1);
  el2=document.createElement("button");
  el2.innerHTML="New game";
  el2.onclick=()=>preNewGame2();
  el2.ontouchend=()=>preNewGame2();
  el2.style.height="30px";
  document.getElementById("buttons-div").appendChild(el2);
  el3=document.createElement("button");
  el3.innerHTML=muted?el3.innerHTML="Unmute sounds":el3.innerHTML="Mute sounds";
  el3.onclick=()=>{muted?muted=false:muted=true;
  muted?el3.innerHTML="Unmute sounds":el3.innerHTML="Mute sounds"}
  el3.ontouchend=()=>{muted?muted=false:muted=true;
  muted?el3.innerHTML="Unmute sounds":el3.innerHTML="Mute sounds"}
  el3.style.height="30px";
  document.getElementById("buttons-div").appendChild(el3);
  el4=document.createElement("button");
  el4.innerHTML="Back to home page";
  el4.onclick= () => window.location.href = "http://ammarveljagic.me";
  el4.ontouchend= () => window.location.href = "http://ammarveljagic.me";
  el4.style.height="30px";
  document.getElementById("buttons-div").appendChild(el4);
  }


function handlePieceMouseDown(e){
  e.preventDefault();
  pieceDragged=true;
  var translateX = e.x-board.element.offsetLeft-board.size/16+scrollX;
  if(board.rotated) translateX=board.size-translateX-board.size/8+scrollX;
  var translateY = e.y-board.element.offsetTop-board.size/16+scrollY;
  if(board.rotated) translateY=board.size-translateY-board.size/8+scrollY;
  var rotate=board.rotated ? " rotate(180deg)" : " rotate(0deg)";
  e.target.style.transform="translate("+translateX+"px, "+translateY+"px)"+rotate;
  e.target.style.zIndex="999";
  var y=e.target.id.split("-")[0];
  var x=e.target.id.split("-")[1];
  var piece=e.target.classList[1][1];
  piece = board.playerToMove==="b" ? piece.toUpperCase() : piece;
  if(e.target.classList[1][0]===board.playerToMove) {board.selectedPiece=[y,x]; board.showMoves([y,x]); board.pieceCanMove=true;}
  else{
    board.hideMoves();
    board.pieceCanMove=false;
    if(board.selectedPiece){
      if(!board.move([[parseInt(board.selectedPiece[0]), parseInt(board.selectedPiece[1])], [parseInt(y),parseInt(x)], piece])) board.selectedPiece=[y,x];
      else{
        board.selectedPiece="";
        pieceDragged=false;
      }
    }
    else{
      board.selectedPiece=[y,x];
    }
  }

  var selectedPieceDiv=document.getElementsByClassName("selected-piece")[0];
  if(selectedPieceDiv) selectedPieceDiv.remove();
  if(board.selectedPiece){
    selectedPieceDiv=document.createElement("div");
    selectedPieceDiv.classList.add("selected-piece");
    document.getElementById("board").appendChild(selectedPieceDiv);
    selectedPieceDiv.style.width=size/8+"px";
    selectedPieceDiv.style.height=size/8+"px";
    selectedPieceDiv.style.transform="translate("+board.selectedPiece[1]*size/8+"px, "+board.selectedPiece[0]*size/8+"px)"
  }
}

function handlePieceTouchStart(e){
  e.preventDefault();
  pieceDragged=true;
  var translateX = e.touches[0].clientX-board.element.offsetLeft-board.size/16+scrollX;
  if(board.rotated) translateX=board.size-translateX-board.size/8+scrollX;
  var translateY = e.touches[0].clientY-board.element.offsetTop-board.size/16+scrollY;
  if(board.rotated) translateY=board.size-translateY-board.size/8+scrollY;
  var rotate=board.rotated ? " rotate(180deg)" : " rotate(0deg)";
  e.target.style.transform="translate("+translateX+"px, "+translateY+"px)"+rotate;
  e.target.style.zIndex="999";
  var y=e.target.id.split("-")[0];
  var x=e.target.id.split("-")[1];
  var piece=e.target.classList[1][1];
  piece = board.playerToMove==="b" ? piece.toUpperCase() : piece;
  if(e.target.classList[1][0]===board.playerToMove) {board.selectedPiece=[y,x]; board.showMoves([y,x]); board.pieceCanMove=true;}
  else{
    board.hideMoves();
    board.pieceCanMove=false;
    if(board.selectedPiece){
      if(!board.move([[parseInt(board.selectedPiece[0]), parseInt(board.selectedPiece[1])], [parseInt(y),parseInt(x)], piece])) board.selectedPiece=[y,x];
      else{
        board.selectedPiece="";
        pieceDragged=false;
      }
    }
    else{
      board.selectedPiece=[y,x];
    }
  }
  lastX=e.touches[0].clientX;
  lastY=e.touches[0].clientY;

  var selectedPieceDiv=document.getElementsByClassName("selected-piece")[0];
  if(selectedPieceDiv) selectedPieceDiv.remove();
  if(board.selectedPiece){
    selectedPieceDiv=document.createElement("div");
    selectedPieceDiv.classList.add("selected-piece");
    document.getElementById("board").appendChild(selectedPieceDiv);
    selectedPieceDiv.style.width=size/8+"px";
    selectedPieceDiv.style.height=size/8+"px";
    selectedPieceDiv.style.transform="translate("+board.selectedPiece[1]*size/8+"px, "+board.selectedPiece[0]*size/8+"px)"
  }
}

function swapElements(elm1, elm2) {
    var parent1, next1,
        parent2, next2;

    parent1 = elm1.parentNode;
    next1   = elm1.nextSibling;
    parent2 = elm2.parentNode;
    next2   = elm2.nextSibling;

    parent1.insertBefore(elm2, next1);
    parent2.insertBefore(elm1, next2);
}

function randomInt(max){
  return Math.floor(Math.random() * Math.floor(max));
}
