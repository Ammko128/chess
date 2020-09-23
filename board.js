class Board{
  constructor(p1, p2, size){
    this.whitePlayer=p1;
    this.blackPlayer=p2;
    this.size=size;
    this.enPassant="";
    this.castle=[true,true,true,true];
    this.history=[];
    this.playerToMove="w";
    this.movesPlayed=0;
    this.checkMate=false;
    this.staleMate=false;
    this.check=false;

    this.element=document.createElement("div");
    document.getElementById("body").appendChild(this.element);
    this.element.style.width=size+"px";
    this.element.style.height=size+"px";
    this.element.style.backgroundSize=size+"px";
    this.element.id="board";

    this.fields=[
      ["r","n","b","q","k","b","n","r"],
      ["p","p","p","p","p","p","p","p"],
      ["","","","","","","",""],
      ["","","","","","","",""],
      ["","","","","","","",""],
      ["","","","","","","",""],
      ["P","P","P","P","P","P","P","P"],
      ["R","N","B","Q","K","B","N","R"]
    ];

    this.moves=[];

    this.updateMoves();

    this.renderPieces();

    this.whitePlayer.timer.startTimer();
  }

  rotate(){
    if(this.rotated){
      this.rotated=false;
      this.element.classList.remove("rotated");
      var elements=document.getElementsByClassName("figure");
      for(var i=0; i<elements.length; i++){
        elements[i].style.transform=elements[i].style.transform.replaceAll(" rotate(180deg)", "");
        elements[i].style.transform+=" rotate(0deg)";
      }
    }
    else{
      this.rotated=true;
      this.element.classList.add("rotated");
      elements=document.getElementsByClassName("figure");
      for(var i=0; i<elements.length; i++){
        elements[i].style.transform=elements[i].style.transform.replaceAll(" rotate(0deg)", "");
        elements[i].style.transform+=" rotate(180deg)";
      }
    }
    var promotionElement2=document.getElementsByClassName("promotion-div2")[0];
    if(promotionElement2){
      promotionElement2.style.position="absolute";
      promotionElement2.style.top="-20px"
      if(this.rotated){
        promotionElement2.style.bottom="-"+this.element.offsetTop;
        promotionElement2.style.right="-"+this.element.offsetLeft;
        promotionElement2.style.left="";
      }
      else{
      promotionElement2.style.left="-"+this.element.offsetLeft;
      promotionElement2.style.right="";
      promotionElement2.style.bottom="";
      }
    }
    var coordinate=document.getElementsByClassName("coordinate-y");
    if(this.rotated && coordinate[0]){
      for(var j=0; j<8; j++){
        coordinate[j].innerHTML=8-j
        var rotate=" rotate(180deg)";
        var x=size;
        var y=-size/16+8;
        coordinate[j].style.transform="translate("+x+"px, "+y+"px)"+rotate;
      }
    }
    else if(coordinate[0]){
      for(var j=0; j<8; j++){
        coordinate[j].innerHTML=8-j
        var rotate=" rotate(0deg)";
        var x=-10
        var y=size/16-8;
        coordinate[j].style.transform="translate("+x+"px, "+y+"px)"+rotate;
      }
    }
    var coordinate=document.getElementsByClassName("coordinate-x");
    if(this.rotated && coordinate[0]){
      for(var j=0; j<8; j++){
        String.fromCharCode('a'.charCodeAt(0)+j);
        rotate=" rotate(180deg)";
        x=j*size/8-size/16+4;
        y=-size-15;
        coordinate[j].style.transform="translate("+x+"px, "+y+"px)"+rotate;
      }
    }
    else if(coordinate[0]){
      for(j=0; j<8; j++){
        rotate=" rotate(0deg)";
        x=j*size/8+size/16-4;
        y=0;
        coordinate[j].style.transform="translate("+x+"px, "+y+"px)"+rotate;
      }
    }
    if(!boardRotated) swapElements(this.whitePlayer.timer.element, this.blackPlayer.timer.element);
  }

  setSize(size){
    var oldSize=this.size
    this.size=size;
    this.element.style.width=size+"px";
    this.element.style.height=size+"px";
    this.element.style.backgroundSize=size+"px";
    this.renderPieces();
    var moves=document.getElementsByClassName("available-move");
    for(var i=0; i<moves.length; i++){
      var move=moves[i];
      move.style.width=size/16+"px";
      move.style.height=size/16+"px";
      move.style.backgroundSize=size/8+"px";
      var oldTranslate=move.style.transform.split(/(\Bpx\,\B|\Bpx\)\B|\s|\btranslate\(\b)/g);
      var x=8*(parseInt(oldTranslate[2])-oldSize/32)/oldSize
      var y=8*(parseInt(oldTranslate[6])-oldSize/32)/oldSize
      var translateX = x*size/8+size/32;
      var translateY = y*size/8+size/32;
      var rotate=this.rotated ? " rotate(180deg)" : " rotate(0deg)";
      move.style.transform="translate("+translateX+"px, "+translateY+"px)"+rotate;
    }
  }

  togglePlayerToMove(){
    if(this.playerToMove==="w") {
      this.playerToMove="b";
      this.blackPlayer.timer.startTimer();
      this.whitePlayer.timer.stopTimer();
    }
    else {
      this.playerToMove="w";
      this.whitePlayer.timer.startTimer();
      this.blackPlayer.timer.stopTimer();
    }
    this.movesPlayed++;
  }

  getPiecesByType(type, fields){
    var pieces=[];
    for(var i=0; i<8; i++){
      for(var j=0; j<8; j++){
        if(fields[i][j]===type) pieces.push([i,j]);
      }
    }
    return pieces;
  }

  isChecked(color, fields, moves){
    var king=[];
    if(color==="w") king=this.getPiecesByType("K", fields)[0];
    else king=this.getPiecesByType("k", fields)[0];
    var x=king[1];
    var y=king[0];
    for(var i=0; i<moves.length; i++){
      if(moves[i] && moves[i][1][0]==y && moves[i] && moves[i][1][1]==x) {return true;}
    }
    return false;
  }

  isCheckmated(color){
    if(this.isChecked(color, this.fields, this.updateMoves(true))){
      for(var i=0; i<this.moves.length; i++){
        if(this.moves[i]) return false;
      }
      return true;
    }
    return false;
  }

  isStalemated(color){
    if(!this.isChecked(color, this.fields, this.updateMoves(true))){
      for(var i=0; i<this.moves.length; i++){
        if(this.moves[i]) return false;
      }
      return true;
    }
    return false;
  }

  getMove(move){
    for(var i=0; i<this.moves.length; i++){
      if(this.moves[i] && move[0][0]===(this.moves[i][0][0]) && move[0][1]===(this.moves[i][0][1]) && move[1][0]===(this.moves[i][1][0]) && move[1][1]===(this.moves[i][1][1]) && move[2]===(this.moves[i][2])) return true;
    }
    return false;
  }

  move(move){
    if(!this.getMove(move)) return false;
    this.audioToPlay="move.mp3";
    var startField=move[0];
    var endField=move[1];
    var x1 = startField[0];
    var y1 = startField[1];
    var x2 = endField[0];
    var y2 = endField[1];
    if(this.fields[x1][y1]==="k") {
      this.castle[0]=false;
      this.castle[1]=false;
    }
    if(this.fields[x1][y1]==="K"){
      this.castle[2]=false;
      this.castle[3]=false;
    }
    if(this.fields[x1][y1]==="r"){
      if(y1===0) this.castle[0]=false;
      if(y1===7) this.castle[1]=false;
    }
    if(this.fields[x1][y1]==="R"){
      if(y1===0) this.castle[2]=false;
      if(y1===7) this.castle[3]=false;
    }
    if(this.fields[x1][y1].toUpperCase()==="P" && this.enPassant && move[1][0]===this.enPassant[1][0] && move[1][1]===this.enPassant[1][1]){
      if(this.playerToMove==="w"){
        this.fields[move[1][0]+1][move[1][1]]="";
        var figure=document.getElementById((parseInt(move[1][0])+1)+"-"+move[1][1]);
        if(figure) figure.remove();
      }
      else{
        this.fields[move[1][0]-1][move[1][1]]="";
        figure=document.getElementById((parseInt(move[1][0])-1)+"-"+move[1][1]);
        if(figure) figure.remove();
      }
      this.enPassantMade=true;
    }
    else this.enPassantMade=false;
    if(this.enPassantMade || this.fields[x2][y2]) this.audioToPlay="pieceTaken.mp3"
    var castling="";
    if(this.fields[x1][y1].toUpperCase()==="K" && Math.abs(move[1][1]-y1)>1){
      if(move[1][1]<4){
        castling="O-O-O";
        if(this.playerToMove==="w"){
          this.fields[7][3]=this.fields[7][0];
          this.fields[7][0]="";
          var figure2=document.getElementById("7-0");
          var translateX = 3*size/8;
          var translateY = 7*size/8;
          var rotate=this.rotated ? " rotate(180deg)" : " rotate(0deg)";
          figure2.style.transition="all .3s";
          figure2.style.transform="translate("+translateX+"px, "+translateY+"px)"+rotate;
          var interval2=setInterval(()=>{figure2.style.transition=""; clearInterval(interval2);}, 350)
          figure2.id="7-3";
        }
        else{
          this.fields[0][3]=this.fields[0][0];
          this.fields[0][0]="";
          figure2=document.getElementById("0-0");
          var translateX = 3*size/8;
          var translateY = 0*size/8;
          var rotate=this.rotated ? " rotate(180deg)" : " rotate(0deg)";
          figure2.style.transition="all .3s";
          figure2.style.transform="translate("+translateX+"px, "+translateY+"px)"+rotate;
          interval2=setInterval(()=>{figure2.style.transition=""; clearInterval(interval2);}, 350)
          figure2.id="0-3";
        }
      }
      else{
        castling="O-O";
        if(this.playerToMove==="w"){
          this.fields[7][5]=this.fields[7][7];
          this.fields[7][7]="";
          figure2=document.getElementById("7-7");
          var translateX = 5*size/8;
          var translateY = 7*size/8;
          var rotate=this.rotated ? " rotate(180deg)" : " rotate(0deg)";
          figure2.style.transition="all .3s";
          figure2.style.transform="translate("+translateX+"px, "+translateY+"px)"+rotate;
          interval2=setInterval(()=>{figure2.style.transition=""; clearInterval(interval2);}, 350)
          figure2.id="7-5";
        }
        else{
          this.fields[0][5]=this.fields[0][7];
          this.fields[0][7]="";
          figure2=document.getElementById("0-7");
          var translateX = 5*size/8;
          var translateY = 0*size/8;
          var rotate=this.rotated ? " rotate(180deg)" : " rotate(0deg)";
          figure2.style.transition="all .3s";
          figure2.style.transform="translate("+translateX+"px, "+translateY+"px)"+rotate;
          interval2=setInterval(()=>{figure2.style.transition=""; clearInterval(interval2);}, 350)
          figure2.id="0-5";
        }
      }
    }
    if(this.fields[x1][y1].toLowerCase()==="p" && Math.abs(x1-x2)>1) this.enPassant=[[x1, y1], [x2+(x1-x2)/2, y1], this.fields[x1][y1]];
    else this.enPassant="";
    if(this.fields[x1][y1]==="P" && x2===0){
      this.startPromotion("w", x2, y2);
      this.promotion=true;
    }
    else if(this.fields[x1][y1]==="p" && x2===7){
      this.startPromotion("b", x2, y2);
      this.promotion=true;
    }
    else this.promotion=false;
    this.fields[x2][y2]=this.fields[x1][y1];
    this.fields[x1][y1]="";
    figure=document.getElementById(x2+"-"+y2);
    if(figure) figure.remove();
    figure=document.getElementById(x1+"-"+y1);
    var translateX = y2*size/8;
    var translateY = x2*size/8;
    var rotate=this.rotated ? " rotate(180deg)" : " rotate(0deg)";
    figure.style.transition="all .3s"
    figure.style.transform="translate("+translateX+"px, "+translateY+"px)"+rotate;
    var interval=setInterval(()=>{figure.style.transition=""; clearInterval(interval);}, 350)
    figure.id=x2+"-"+y2;
    this.togglePlayerToMove();
    var fields = this.fields.map(function(arr) {
      return arr.slice();
    });
    if(this.enPassant){
      var enPassantForHistory=this.enPassant.map(function(arr) {
        return arr.slice();
      });
    }
    else enPassantForHistory="";
    var castleForHistory=[...this.castle];
    var moves=this.moves.map(function(arr) {
      return arr.slice();
    });
    this.updateHistory();
    this.addToHistory([...move, this.fields[x2][y2].toUpperCase(), fields, enPassantForHistory, castleForHistory, castling, moves, this.enPassantMade, this.checkMate, this.check, this.staleMate, "", this.whitePlayer.timer.time, this.blackPlayer.timer.time]);
    var prefixForHistory="";
    var letterNotation=false;
    var numberNotation=false;
    var moves=this.moves;
    for(var i=0; i<this.moves.length; i++){
      if(!moves[i]) continue;
      if(moves[i][1][0]===x2 && moves[i][1][1]===y2 && !(moves[i][0][0]===x1 && moves[i][0][1]===y1) && this.fields[x2][y2]===this.fields[moves[i][0][0]][moves[i][0][1]] && this.fields[x2][y2].toUpperCase()!=="P"){
        if(moves[i][0][0]!==y1 && !letterNotation) {if(!numberNotation) {prefixForHistory=String.fromCharCode('a'.charCodeAt(0)+y1); letterNotation=true;} else prefixForHistory=String.fromCharCode('a'.charCodeAt(0)+y1)+prefixForHistory; continue;}
        if(!numberNotation){prefixForHistory+=(7-x1+1)+""; numberNotation=true; continue;}
      }
    }
    this.updateMoves();
    this.hideMoves();
    if(this.isCheckmated(this.playerToMove)) {
      this.checkMate=true;
      this.whitePlayer.timer.stopTimer();
      this.blackPlayer.timer.stopTimer();
      if(this.playerToMove==="w") this.winner="b";
      else this.winner="w";
    }
    else if(this.isChecked(this.playerToMove, this.fields, this.updateMoves(true))) this.check=true;
    else if(this.isStalemated(this.playerToMove)){
      this.staleMate=true;
      this.whitePlayer.timer.stopTimer();
      this.blackPlayer.timer.stopTimer();
      this.winner="d";
    }
    else this.check=false;
    var lastHistory=this.history[this.history.length-1];
    var piece1=lastHistory[3]==="P"?lastHistory[2]||this.enPassantMade?String.fromCharCode('a'.charCodeAt(0)+lastHistory[0][1]):"":lastHistory[3];
    var field2=7-lastHistory[1][0]+1;
    var field1=String.fromCharCode('a'.charCodeAt(0)+lastHistory[1][1]);
    prefixForHistory+=lastHistory[2]||this.enPassantMade?"x":""
    var preprefix=this.history.length%2===1?(this.history.length+1)/2:"";
    if(!castling) historyDiv.insertAdjacentHTML('beforeend', (preprefix?"<p id=\"moveNum-"+this.history.length+"\" style=\"display:inline-block; width:15%; margin:0; margin-left:2px;\">"+preprefix+".</p>":"")+"<p id=\"history-"+this.history.length+"\" class=\"historyStep\" style=\"display:inline-block;\">"+piece1+prefixForHistory+""+field1+""+field2+"</p>"+(this.history.length%2===0?"<br id=\"br-"+this.history.length+"\"/>":""));
    else historyDiv.insertAdjacentHTML('beforeend', (preprefix?"<p id=\"moveNum-"+this.history.length+"\" style=\"display:inline-block; width:15%; margin:0; margin-left:2px;\">"+preprefix+".</p>":"")+"<p id=\"history-"+this.history.length+"\" class=\"historyStep\" style=\"display:inline-block;\">"+castling+"</p>"+(this.history.length%2===0?"<br id=\"br-"+this.history.length+"\"/>":""));
    var historyStep=document.getElementById("history-"+this.history.length);
    if(this.checkMate && !this.promotion) historyStep.insertAdjacentHTML('beforeend', "#");
    if(this.check && !this.promotion && !this.checkMate) historyStep.insertAdjacentHTML('beforeend', "+");
    var historyStepNum=this.history.length;
    historyStep.onclick = (e) => {e.preventDefault(); this.goToMove(historyStepNum,e);}
    historyStep.ontouchstart = (e) => this.touchHistoryMove=e.target.id;
    historyStep.ontouchmove = (e) => this.touchHistoryMove="";
    historyStep.ontouchend = (e) => {if(this.touchHistoryMove) this.goToMove(historyStepNum,e);}
    historyDiv.scrollTop=9999999;
    var selectedMove=document.getElementsByClassName("selected-move")[0];
    if(selectedMove) selectedMove.classList.remove("selected-move");
    selectedMove=document.getElementById("history-"+this.movesPlayed);
    if(selectedMove) selectedMove.classList.add("selected-move");
    this.lastMove=[[x1,y1], [x2,y2]];
    lastMoveDivs=document.getElementsByClassName("last-move");
    i=-1;
    while(++i<lastMoveDivs.length){
      lastMoveDivs[i].style.width=size/8+"px";
      lastMoveDivs[i].style.height=size/8+"px";
      lastMoveDivs[i].style.transform="translate("+this.lastMove[i][1]*size/8+"px, "+this.lastMove[i][0]*size/8+"px)"
    }
    if(castling) this.audioToPlay="castling.mp3";
    if(this.check || this.checkMate) this.audioToPlay="check.mp3";
    var audio = new Audio(this.audioToPlay);
    audio.volume=0.5;
    if(!muted) audio.play();
    if(this.winner){
      winningDiv = document.createElement("div");
      winningDiv.id="winning-div";
      winningDiv.style.width="100%";
      winningDiv.style.height=this.size/4;
      winningDiv.style.top=this.size/2;
      winningDiv.style.lineHeight=this.size/4+"px";
      winningDiv.style.fontSize=this.size/8;
      winningDiv.innerHTML="";
      winningDiv.innerHTML+=(this.winner==="w"?"White ":"Black ")+"won by "+(this.checkMate?"checkmate":"timeout");
      var hideParagraph=document.createElement("p");
      hideParagraph.classList.add("hide");
      hideParagraph.innerHTML="Hide";
      winningDiv.appendChild(hideParagraph);
      hideParagraph.onclick=()=>{if(winningDiv) winningDiv.remove();}
      winningDiv.style.position="absolute";
      winningDiv.style.zIndex=99999999;
      winningDiv.style.textAlign="center";
      winningDiv.style.backgroundColor="rgba(0,100,100,0.9)";
      winningDiv.style.color="#fff";
      document.getElementById("body").appendChild(winningDiv);
    }
    return true;
  }

  goToMove(id){
    if(this.movesPlayed===id) return;
    if(winningDiv) winningDiv.remove();
    this.winner="";
    var renderPiecesBool=false;
    if(Math.abs(this.movesPlayed-id)>1) renderPiecesBool=true;
    var forward=this.movesPlayed-id<0;
    this.movesPlayed=id;
    id=id-1;
    this.fields=this.history[id][4].map(function(arr) {
      return arr.slice();
    });
    this.whitePlayer.timer.setTime(this.history[id][14]);
    this.blackPlayer.timer.setTime(this.history[id][15]);
    this.whitePlayer.timer.element.innerHTML=this.whitePlayer.timer.name+": "+this.whitePlayer.timer.beautifyTime();
    this.blackPlayer.timer.element.innerHTML=this.blackPlayer.timer.name+": "+this.blackPlayer.timer.beautifyTime();
    if(id%2==0) {
      this.playerToMove="b";
      if(this.whitePlayer.timer.timerRunning){
        this.blackPlayer.timer.startTimer();
        this.whitePlayer.timer.stopTimer();
      }
      else if(!this.blackPlayer.timer.timerRunning) this.blackPlayer.timer.startTimer();
    }
    else{
      this.playerToMove="w";
      if(this.blackPlayer.timer.timerRunning){
        this.whitePlayer.timer.startTimer();
        this.blackPlayer.timer.stopTimer();
      }
      else if(!this.whitePlayer.timer.timerRunning) this.whitePlayer.timer.startTimer();
    }
    if(!this.history[id][5]) this.enPassant="";
    else this.enPassant=[...this.history[id][5]]
    this.castle=[...this.history[id][6]];
    this.lastMove=[this.history[id][0], this.history[id][1]];
    lastMoveDivs=document.getElementsByClassName("last-move");
    i=-1;
    this.checkMate=this.history[id][10];
    this.check=this.history[id][11];
    this.staleMate=this.history[id][12];
    while(++i<lastMoveDivs.length){
      lastMoveDivs[i].style.width=size/8+"px";
      lastMoveDivs[i].style.height=size/8+"px";
      lastMoveDivs[i].style.transform="translate("+this.lastMove[i][1]*size/8+"px, "+this.lastMove[i][0]*size/8+"px)"
    }
    if(renderPiecesBool) this.renderPieces();
    else{
      if(forward){
        if(this.history[id][13]){
          var promotionInHistory=this.history[id][13];
          var figure3=document.getElementById(this.history[id][0][0]+"-"+this.history[id][0][1]);
          figure3.classList.remove("wp");
          figure3.classList.remove("bp");
          figure3.classList.add(promotionInHistory[0]+promotionInHistory[3]);
        }
        if(this.history[id][2]){
          var figure2=document.getElementById(this.history[id][1][0]+"-"+this.history[id][1][1]);
          if(figure2) figure2.remove();
        }
        var figure=document.getElementById(this.history[id][0][0]+"-"+this.history[id][0][1]);
        var translateX = this.history[id][1][1]*size/8;
        var translateY = this.history[id][1][0]*size/8;
        var rotate=this.rotated ? " rotate(180deg)" : " rotate(0deg)";
        figure.style.transition="all .3s";
        figure.style.transform="translate("+translateX+"px, "+translateY+"px)"+rotate;
        var interval=setInterval(()=>{figure.style.transition=""; clearInterval(interval);}, 350)
        figure.id=this.history[id][1][0]+"-"+this.history[id][1][1];
        if(this.history[id][9]){
          if(this.playerToMove==="w"){
            var figure2=document.getElementById((this.history[id][1][0]-1)+"-"+this.history[id][1][1]);
            if(figure2) figure2.remove();
          }
          else{
            figure2=document.getElementById((this.history[id][1][0]+1)+"-"+this.history[id][1][1]);
            if (figure2) figure2.remove();
          }
        }
        if(this.history[id][7]){
          if(this.history[id][7]==="O-O"){
            if(this.playerToMove==="w"){
              figure2=document.getElementById("0-7");
              translateX = 5*size/8;
              translateY = 0*size/8;
              rotate=this.rotated ? " rotate(180deg)" : " rotate(0deg)";
              figure2.style.transition="all .3s";
              figure2.style.transform="translate("+translateX+"px, "+translateY+"px)"+rotate;
              var interval2=setInterval(()=>{figure2.style.transition=""; clearInterval(interval2);}, 350)
              figure2.id="0-5";
            }
            else{
              figure2=document.getElementById("7-7");
              translateX = 5*size/8;
              translateY = 7*size/8;
              rotate=this.rotated ? " rotate(180deg)" : " rotate(0deg)";
              figure2.style.transition="all .3s";
              figure2.style.transform="translate("+translateX+"px, "+translateY+"px)"+rotate;
              interval2=setInterval(()=>{figure2.style.transition=""; clearInterval(interval2);}, 350)
              figure2.id="7-5";
            }
          }
          else{
            if(this.playerToMove==="w"){
              figure2=document.getElementById("0-0");
              translateX = 3*size/8;
              translateY = 0*size/8;
              rotate=this.rotated ? " rotate(180deg)" : " rotate(0deg)";
              figure2.style.transition="all .3s";
              figure2.style.transform="translate("+translateX+"px, "+translateY+"px)"+rotate;
              interval2=setInterval(()=>{figure2.style.transition=""; clearInterval(interval2);}, 350)
              figure2.id="0-3";
            }
            else{
              figure2=document.getElementById("7-0");
              translateX = 3*size/8;
              translateY = 7*size/8;
              rotate=this.rotated ? " rotate(180deg)" : " rotate(0deg)";
              figure2.style.transition="all .3s";
              figure2.style.transform="translate("+translateX+"px, "+translateY+"px)"+rotate;
              interval2=setInterval(()=>{figure2.style.transition=""; clearInterval(interval2);}, 350)
              figure2.id="7-3";
            }
          }
        }
      }
      else{
        if(this.history[id+1][13]){
          promotionInHistory=this.history[id+1][13];
          figure3=document.getElementById(promotionInHistory[1]+"-"+promotionInHistory[2]);
          figure3.classList.remove("wq");
          figure3.classList.remove("bq");
          figure3.classList.remove("wb");
          figure3.classList.remove("bb");
          figure3.classList.remove("wr");
          figure3.classList.remove("br");
          figure3.classList.remove("wn");
          figure3.classList.remove("bn");
          if(id%2==0) figure3.classList.add("bp");
          else figure3.classList.add("wp");
        }
        figure=document.getElementById(this.history[id+1][1][0]+"-"+this.history[id+1][1][1]);
        translateX = this.history[id+1][0][1]*size/8;
        translateY = this.history[id+1][0][0]*size/8;
        rotate=this.rotated ? " rotate(180deg)" : " rotate(0deg)";
        figure.style.transition="all .3s";
        figure.style.transform="translate("+translateX+"px, "+translateY+"px)"+rotate;
        interval=setInterval(()=>{figure.style.transition=""; clearInterval(interval);}, 350)
        figure.id=this.history[id+1][0][0]+"-"+this.history[id+1][0][1];
        if(this.history[id+1][2]){
          figure2=document.createElement("div");
          figure2.classList.add("figure");
          figure2.style.width=size/8+"px";
          figure2.style.height=size/8+"px";
          figure2.style.backgroundSize=size/8+"px";
          document.getElementById("board").appendChild(figure2);
          figure2.onmousedown=(e)=>handlePieceMouseDown(e);
          figure2.ontouchstart=(e)=>handlePieceTouchStart(e);
          translateX = this.history[id+1][1][1]*size/8;
          translateY = this.history[id+1][1][0]*size/8;
          rotate=this.rotated ? " rotate(180deg)" : " rotate(0deg)";
          figure2.style.transform="translate("+translateX+"px, "+translateY+"px)"+rotate;
          figure2.id=this.history[id+1][1][0]+"-"+this.history[id+1][1][1];
          if(this.playerToMove==="b"){
            figure2.classList.add("w"+this.history[id+1][2].toLowerCase());
          }
          else{
            figure2.classList.add("b"+this.history[id+1][2].toLowerCase());
          }
        }
        if(this.history[id+1][9]){
          figure2=document.createElement("div");
          figure2.classList.add("figure");
          figure2.style.width=size/8+"px";
          figure2.style.height=size/8+"px";
          figure2.style.backgroundSize=size/8+"px";
          document.getElementById("board").appendChild(figure2);
          figure2.onmousedown=(e)=>handlePieceMouseDown(e);
          figure2.ontouchstart=(e)=>handlePieceTouchStart(e);
          translateX = this.history[id][1][1]*size/8;
          translateY = this.history[id][1][0]*size/8;
          rotate=this.rotated ? " rotate(180deg)" : " rotate(0deg)";
          figure2.style.transform="translate("+translateX+"px, "+translateY+"px)"+rotate;
          figure2.id=(this.history[id][1][0])+"-"+this.history[id][1][1];
          if(this.playerToMove==="b"){
            figure2.classList.add("wp");
          }
          else{
            figure2.classList.add("bp");
          }
        }
        if(this.history[id+1][7]){
          if(this.history[id+1][7]==="O-O"){
            if(this.playerToMove==="b"){
              figure2=document.getElementById("0-5");
              translateX = 7*size/8;
              translateY = 0*size/8;
              rotate=this.rotated ? " rotate(180deg)" : " rotate(0deg)";
              figure2.style.transition="all .3s";
              figure2.style.transform="translate("+translateX+"px, "+translateY+"px)"+rotate;
              interval2=setInterval(()=>{figure2.style.transition=""; clearInterval(interval2);}, 350)
              figure2.id="0-7";
            }
            else{
              figure2=document.getElementById("7-5");
              translateX = 7*size/8;
              translateY = 7*size/8;
              rotate=this.rotated ? " rotate(180deg)" : " rotate(0deg)";
              figure2.style.transition="all .3s";
              figure2.style.transform="translate("+translateX+"px, "+translateY+"px)"+rotate;
              interval2=setInterval(()=>{figure2.style.transition=""; clearInterval(interval2);}, 350)
              figure2.id="7-7";
            }
          }
          else{
            if(this.playerToMove==="b"){
              figure2=document.getElementById("0-3");
              translateX = 0*size/8;
              translateY = 0*size/8;
              rotate=this.rotated ? " rotate(180deg)" : " rotate(0deg)";
              figure2.style.transition="all .3s";
              figure2.style.transform="translate("+translateX+"px, "+translateY+"px)"+rotate;
              interval2=setInterval(()=>{figure2.style.transition=""; clearInterval(interval2);}, 350)
              figure2.id="0-0";
            }
            else{
              figure2=document.getElementById("7-3");
              translateX = 0*size/8;
              translateY = 7*size/8;
              rotate=this.rotated ? " rotate(180deg)" : " rotate(0deg)";
              figure2.style.transition="all .3s";
              figure2.style.transform="translate("+translateX+"px, "+translateY+"px)"+rotate;
              interval2=setInterval(()=>{figure2.style.transition=""; clearInterval(interval2);}, 350)
              figure2.id="7-0";
            }
          }
        }
      }
    }
    this.updateMoves(false, this.fields, this.history[id][8]);
    this.hideMoves();
    var selectedMove=document.getElementsByClassName("selected-move")[0];
    if(selectedMove) selectedMove.classList.remove("selected-move");
    selectedMove=document.getElementById("history-"+this.movesPlayed);
    if(selectedMove) selectedMove.classList.add("selected-move");
  }

  updateHistory(){
    var id=this.movesPlayed-1;
    var maxLength=this.history.length
    for(var i=id; i<maxLength; i++){
      var x=this.history.pop();
    }
    id++;
    var element=document.getElementById("history-"+id);
    var element2=document.getElementById("br-"+id);
    var element3=document.getElementById("moveNum-"+id);
    while(element || element2 || element3){
      if(element) element.remove();
      if(element2) element2.remove();
      if(element3) element3.remove();
      id++;
      element=document.getElementById("history-"+id);
      element2=document.getElementById("br-"+id);
      element3=document.getElementById("moveNum-"+id);
    }
  }

  hideMoves(){
    var elements=document.getElementsByClassName("available-move");
    while(elements[0]) elements[0].remove();
  }

  showMoves(field){
    this.hideMoves();
    var move;
    for(var i=0; i<this.moves.length; i++){
      if(!this.moves[i]) continue;
      if(this.moves[i][0][0]===parseInt(field[0]) && this.moves[i][0][1]===parseInt(field[1])){
        move=document.createElement("div");
        move.classList.add("available-move");
        document.getElementById("board").appendChild(move);
        move.style.width=size/16+"px";
        move.style.height=size/16+"px";
        move.style.backgroundSize=size/8+"px";
        var translateX = this.moves[i][1][1]*size/8+size/32;
        var translateY = this.moves[i][1][0]*size/8+size/32;
        var rotate=this.rotated ? " rotate(180deg)" : " rotate(0deg)";
        move.style.transform="translate("+translateX+"px, "+translateY+"px)"+rotate;
      }
    }
  }

  autoCheckMate(){
    this.move([[6,5], [4,5], ""]);
    this.move([[1,4], [3,4], ""]);
    this.move([[4,5], [3,4], "p"]);
    this.move([[1,3], [2,3], ""]);
    this.move([[3,4], [2,3], "p"]);
    this.move([[0,5], [2,3], "P"]);
    this.move([[7,1], [5,2], ""]);
    this.move([[0,3], [4,7], ""]);
    this.move([[6,6], [5,6], ""]);
    this.move([[4,7], [5,6], "P"]);
    this.move([[6,7], [5,6], "q"]);
  }

  simulateMove(move, fields){
    var startField=move[0];
    var endField=move[1];
    var x1 = startField[0];
    var y1 = startField[1];
    var x2 = endField[0];
    var y2 = endField[1];
    if(!fields){
      fields = this.fields.map(function(arr) {
        return arr.slice();
      });
    }
    fields[x2][y2]=fields[x1][y1];
    fields[x1][y1]="";
    if(move[3] && move[3]==="enpassant"){
      if(this.playerToMove==="b"){
        fields[move[1][0]+1][move[1][1]]="";
      }
      else{
        fields[move[1][0]-1][move[1][1]]="";
      }
    }
    var newMoves=this.updateMoves(true, fields);
    return [newMoves, fields];
  }

  addToHistory(move){
    this.history.push(move);
  }

  checkIfAttacked(y,x, moves, forCastling){
    for(var i=0; i<moves.length; i++){
      if(moves[i]){
        if(this.fields[moves[i][0][0]][moves[i][0][1]]===this.fields[moves[i][0][0]][moves[i][0][1]].toUpperCase() && forCastling && forCastling==="w") continue;
        if(this.fields[moves[i][0][0]][moves[i][0][1]]===this.fields[moves[i][0][0]][moves[i][0][1]].toLowerCase() && forCastling && forCastling==="b") continue;
        if(moves[i][1][0]===y && moves[i][1][1]===x) {return true;}
      }
    }
    return false;
  }

  filterMoves(moves){
    for(var i=0; i<moves.length; i++){
      if(this.playerToMove==="w" && this.fields[moves[i][0][0]][moves[i][0][1]]!==this.fields[moves[i][0][0]][moves[i][0][1]].toUpperCase()) moves[i]="";
      if(this.playerToMove==="b" && this.fields[moves[i][0][0]][moves[i][0][1]]!==this.fields[moves[i][0][0]][moves[i][0][1]].toLowerCase()) moves[i]="";
    }
    this.moves = moves.map(function(arr) {
      return arr.slice();
    });
    var color="w";
    var newMoves;
    var newFields;
    for(var i=0; i<moves.length; i++){
      if(moves[i] && this.fields[moves[i][0][0]][moves[i][0][1]]===this.fields[moves[i][0][0]][moves[i][0][1]].toLowerCase()) color="b";
      else color="w";
      if(moves[i]){
        newMoves=this.simulateMove(moves[i])[0];
        newFields=this.simulateMove(moves[i])[1];
        if(this.isChecked(this.playerToMove, newFields, newMoves)) {this.moves[i]="";}
      }
    }
  }

  updateMoves(simulate, fields, currentMoves){
    if(!currentMoves) {currentMoves=this.moves.map(function(arr) {
      return arr.slice();
    });}
    var moves=[];
    var move;
    if(!fields){
    fields = this.fields.map(function(arr) {
      return arr.slice();
    })}
    for(var i=0; i<8; i++){
      for(var j=0; j<8; j++){
        switch(fields[i][j]){
          case "p":
            if(this.playerToMove==="w" && !simulate) break;
            if(i<7 && !fields[i+1][j]){ move=[[i,j], [i+1, j],""];
            moves.push(move);
            if(i===1 && !fields[i+2][j]){ move=[[i,j], [i+2, j], ""];
            moves.push(move);}}
            if(j<7 && i<7 && fields[i+1][j+1] && fields[i+1][j+1]===fields[i+1][j+1].toUpperCase()){ move=[[i,j], [i+1, j+1], fields[i+1][j+1]];
            moves.push(move);}
            if(j>0 && i<7 && fields[i+1][j-1] && fields[i+1][j-1]===fields[i+1][j-1].toUpperCase()){ move=[[i,j], [i+1, j-1], fields[i+1][j-1]];
            moves.push(move);}
            if(j>0 && i<7 && this.enPassant && this.enPassant[1][0]===i+1 && this.enPassant[1][1]===j-1){ move=[[i,j], [i+1, j-1], "", "enpassant"];
            moves.push(move);}
            if(j<7 && i<7 && this.enPassant && this.enPassant[1][0]===i+1 && this.enPassant[1][1]===j+1){ move=[[i,j], [i+1, j+1], "", "enpassant"];
            moves.push(move);}
            break;
          case "P":
          if(this.playerToMove==="b" && !simulate) break;
            if(i>0 && !fields[i-1][j]){ move=[[i,j], [i-1, j],""];
            moves.push(move);
            if(i===6 && !fields[i-2][j]){ move=[[i,j], [i-2, j], ""];
            moves.push(move);}}
            if(j<7 && i>0 && fields[i-1][j+1] && fields[i-1][j+1]===fields[i-1][j+1].toLowerCase()){ move=[[i,j], [i-1, j+1], fields[i-1][j+1]];
            moves.push(move);}
            if(j>0 && i>0 && fields[i-1][j-1] && fields[i-1][j-1]===fields[i-1][j-1].toLowerCase()){ move=[[i,j], [i-1, j-1], fields[i-1][j-1]];
            moves.push(move);}
            if(j>0 && i>0 && this.enPassant && this.enPassant[1][0]===i-1 && this.enPassant[1][1]===j-1){ move=[[i,j], [i-1, j-1], "", "enpassant"];
            moves.push(move);}
            if(j<7 && i>0 && this.enPassant && this.enPassant[1][0]===i-1 && this.enPassant[1][1]===j+1){ move=[[i,j], [i-1, j+1], "", "enpassant"];
            moves.push(move);}
            break;
          case "r":
          if(this.playerToMove==="w" && !simulate) break;
            for(var k=1; k<8; k++){
              if(i+k>7) break;
              if(!fields[i+k][j]){move=[[i,j], [i+k, j],""]; moves.push(move);}
              else{
                if(fields[i+k][j]===fields[i+k][j].toUpperCase()){
                  move=[[i,j], [i+k, j], fields[i+k][j]];
                  moves.push(move);
                }
                break;
              }
            }
            for(var k=1; k<8; k++){
              if(j+k>7) break;
              if(!fields[i][j+k]){move=[[i,j], [i, j+k],""]; moves.push(move);}
              else{
                if(fields[i][j+k]===fields[i][j+k].toUpperCase()){
                  move=[[i,j], [i, j+k], fields[i][j+k]];
                  moves.push(move);
                }
                break;
              }
            }
            for(var k=1; k<8; k++){
              if(i-k<0) break;
              if(!fields[i-k][j]){move=[[i,j], [i-k, j],""]; moves.push(move);}
              else{
                if(fields[i-k][j]===fields[i-k][j].toUpperCase()){
                  move=[[i,j], [i-k, j], fields[i-k][j]];
                  moves.push(move);
                }
                break;
              }
            }
            for(var k=1; k<8; k++){
              if(j-k<0) break;
              if(!fields[i][j-k]){move=[[i,j], [i, j-k],""]; moves.push(move);}
              else{
                if(fields[i][j-k]===fields[i][j-k].toUpperCase()){
                  move=[[i,j], [i, j-k], fields[i][j-k]];
                  moves.push(move);
                }
                break;
              }
            }
            break;
          case "R":
          if(this.playerToMove==="b" && !simulate) break;
          for(var k=1; k<8; k++){
            if(i+k>7) break;
            if(!fields[i+k][j]){move=[[i,j], [i+k, j],""]; moves.push(move);}
            else{
              if(fields[i+k][j]===fields[i+k][j].toLowerCase()){
                move=[[i,j], [i+k, j], fields[i+k][j]];
                moves.push(move);
              }
              break;
            }
          }
          for(var k=1; k<8; k++){
            if(j+k>7) break;
            if(!fields[i][j+k]){move=[[i,j], [i, j+k],""]; moves.push(move);}
            else{
              if(fields[i][j+k]===fields[i][j+k].toLowerCase()){
                move=[[i,j], [i, j+k], fields[i][j+k]];
                moves.push(move);
              }
              break;
            }
          }
          for(var k=1; k<8; k++){
            if(i-k<0) break;
            if(!fields[i-k][j]){move=[[i,j], [i-k, j],""]; moves.push(move);}
            else{
              if(fields[i-k][j]===fields[i-k][j].toLowerCase()){
                move=[[i,j], [i-k, j], fields[i-k][j]];
                moves.push(move);
              }
              break;
            }
          }
          for(var k=1; k<8; k++){
            if(j-k<0) break;
            if(!fields[i][j-k]){move=[[i,j], [i, j-k],""]; moves.push(move);}
            else{
              if(fields[i][j-k]===fields[i][j-k].toLowerCase()){
                move=[[i,j], [i, j-k], fields[i][j-k]];
                moves.push(move);
              }
              break;
            }
          }
          break;
        case "b":
        if(this.playerToMove==="w" && !simulate) break;
          for(var k=1; k<8; k++){
            if(i+k>7 || j+k>7) continue;
            if(!fields[i+k][j+k]){move=[[i,j], [i+k, j+k],""]; moves.push(move);}
            else{
              if(fields[i+k][j+k]===fields[i+k][j+k].toUpperCase()){
                move=[[i,j], [i+k, j+k], fields[i+k][j+k]];
                moves.push(move);
              }
              break;
            }
          }
          for(var k=1; k<8; k++){
            if(i+k>7 || j-k<0) break;
            if(!fields[i+k][j-k]){move=[[i,j], [i+k, j-k],""]; moves.push(move);}
            else{
              if(fields[i+k][j-k]===fields[i+k][j-k].toUpperCase()){
                move=[[i,j], [i+k, j-k], fields[i+k][j-k]];
                moves.push(move);
              }
              break;
            }
          }
          for(var k=1; k<8; k++){
            if(i-k<0 || j-k<0) break;
            if(!fields[i-k][j-k]){move=[[i,j], [i-k, j-k],""]; moves.push(move);}
            else{
              if(fields[i-k][j-k]===fields[i-k][j-k].toUpperCase()){
                move=[[i,j], [i-k, j-k], fields[i-k][j-k]];
                moves.push(move);
              }
              break;
            }
          }
          for(var k=1; k<8; k++){
            if(i-k<0 || j+k>7) break;
            if(!fields[i-k][j+k]){move=[[i,j], [i-k, j+k],""]; moves.push(move);}
            else{
              if(fields[i-k][j+k]===fields[i-k][j+k].toUpperCase()){
                move=[[i,j], [i-k, j+k], fields[i-k][j+k]];
                moves.push(move);
              }
              break;
            }
          }
          break;
        case "B":
        if(this.playerToMove==="b" && !simulate) break;
          for(var k=1; k<8; k++){
            if(i+k>7 || j+k>7) continue;
            if(!fields[i+k][j+k]){move=[[i,j], [i+k, j+k],""]; moves.push(move);}
            else{
              if(fields[i+k][j+k]===fields[i+k][j+k].toLowerCase()){
                move=[[i,j], [i+k, j+k], fields[i+k][j+k]];
                moves.push(move);
              }
              break;
            }
          }
          for(var k=1; k<8; k++){
            if(i+k>7 || j-k<0) break;
            if(!fields[i+k][j-k]){move=[[i,j], [i+k, j-k],""]; moves.push(move);}
            else{
              if(fields[i+k][j-k]===fields[i+k][j-k].toLowerCase()){
                move=[[i,j], [i+k, j-k], fields[i+k][j-k]];
                moves.push(move);
              }
              break;
            }
          }
          for(var k=1; k<8; k++){
            if(i-k<0 || j-k<0) break;
            if(!fields[i-k][j-k]){move=[[i,j], [i-k, j-k],""]; moves.push(move);}
            else{
              if(fields[i-k][j-k]===fields[i-k][j-k].toLowerCase()){
                move=[[i,j], [i-k, j-k], fields[i-k][j-k]];
                moves.push(move);
              }
              break;
            }
          }
          for(var k=1; k<8; k++){
            if(i-k<0 || j+k>7) break;
            if(!fields[i-k][j+k]){move=[[i,j], [i-k, j+k],""]; moves.push(move);}
            else{
              if(fields[i-k][j+k]===fields[i-k][j+k].toLowerCase()){
                move=[[i,j], [i-k, j+k], fields[i-k][j+k]];
                moves.push(move);
              }
              break;
            }
          }
          break;
        case "q":
        if(this.playerToMove==="w" && !simulate) break;
        for(var k=1; k<8; k++){
          if(i+k>7) break;
          if(!fields[i+k][j]){move=[[i,j], [i+k, j],""]; moves.push(move);}
          else{
            if(fields[i+k][j]===fields[i+k][j].toUpperCase()){
              move=[[i,j], [i+k, j], fields[i+k][j]];
              moves.push(move);
            }
            break;
          }
        }
        for(var k=1; k<8; k++){
          if(j+k>7) break;
          if(!fields[i][j+k]){move=[[i,j], [i, j+k],""]; moves.push(move);}
          else{
            if(fields[i][j+k]===fields[i][j+k].toUpperCase()){
              move=[[i,j], [i, j+k], fields[i][j+k]];
              moves.push(move);
            }
            break;
          }
        }
        for(var k=1; k<8; k++){
          if(i-k<0) break;
          if(!fields[i-k][j]){move=[[i,j], [i-k, j],""]; moves.push(move);}
          else{
            if(fields[i-k][j]===fields[i-k][j].toUpperCase()){
              move=[[i,j], [i-k, j], fields[i-k][j]];
              moves.push(move);
            }
            break;
          }
        }
        for(var k=1; k<8; k++){
          if(j-k<0) break;
          if(!fields[i][j-k]){move=[[i,j], [i, j-k],""]; moves.push(move);}
          else{
            if(fields[i][j-k]===fields[i][j-k].toUpperCase()){
              move=[[i,j], [i, j-k], fields[i][j-k]];
              moves.push(move);
            }
            break;
          }
        }
        for(var k=1; k<8; k++){
          if(i+k>7 || j+k>7) continue;
          if(!fields[i+k][j+k]){move=[[i,j], [i+k, j+k],""]; moves.push(move);}
          else{
            if(fields[i+k][j+k]===fields[i+k][j+k].toUpperCase()){
              move=[[i,j], [i+k, j+k], fields[i+k][j+k]];
              moves.push(move);
            }
            break;
          }
        }
        for(var k=1; k<8; k++){
          if(i+k>7 || j-k<0) break;
          if(!fields[i+k][j-k]){move=[[i,j], [i+k, j-k],""]; moves.push(move);}
          else{
            if(fields[i+k][j-k]===fields[i+k][j-k].toUpperCase()){
              move=[[i,j], [i+k, j-k], fields[i+k][j-k]];
              moves.push(move);
            }
            break;
          }
        }
        for(var k=1; k<8; k++){
          if(i-k<0 || j-k<0) break;
          if(!fields[i-k][j-k]){move=[[i,j], [i-k, j-k],""]; moves.push(move);}
          else{
            if(fields[i-k][j-k]===fields[i-k][j-k].toUpperCase()){
              move=[[i,j], [i-k, j-k], fields[i-k][j-k]];
              moves.push(move);
            }
            break;
          }
        }
        for(var k=1; k<8; k++){
          if(i-k<0 || j+k>7) break;
          if(!fields[i-k][j+k]){move=[[i,j], [i-k, j+k],""]; moves.push(move);}
          else{
            if(fields[i-k][j+k]===fields[i-k][j+k].toUpperCase()){
              move=[[i,j], [i-k, j+k], fields[i-k][j+k]];
              moves.push(move);
            }
            break;
          }
        }
        break;
        case "Q":
        if(this.playerToMove==="b" && !simulate) break;
          for(var k=1; k<8; k++){
            if(i+k>7) break;
            if(!fields[i+k][j]){move=[[i,j], [i+k, j],""]; moves.push(move);}
            else{
              if(fields[i+k][j]===fields[i+k][j].toLowerCase()){
                move=[[i,j], [i+k, j], fields[i+k][j]];
                moves.push(move);
              }
              break;
            }
          }
          for(var k=1; k<8; k++){
            if(j+k>7) break;
            if(!fields[i][j+k]){move=[[i,j], [i, j+k],""]; moves.push(move);}
            else{
              if(fields[i][j+k]===fields[i][j+k].toLowerCase()){
                move=[[i,j], [i, j+k], fields[i][j+k]];
                moves.push(move);
              }
              break;
            }
          }
          for(var k=1; k<8; k++){
            if(i-k<0) break;
            if(!fields[i-k][j]){move=[[i,j], [i-k, j],""]; moves.push(move);}
            else{
              if(fields[i-k][j]===fields[i-k][j].toLowerCase()){
                move=[[i,j], [i-k, j], fields[i-k][j]];
                moves.push(move);
              }
              break;
            }
          }
          for(var k=1; k<8; k++){
            if(j-k<0) break;
            if(!fields[i][j-k]){move=[[i,j], [i, j-k],""]; moves.push(move);}
            else{
              if(fields[i][j-k]===fields[i][j-k].toLowerCase()){
                move=[[i,j], [i, j-k], fields[i][j-k]];
                moves.push(move);
              }
              break;
            }
          }
          for(var k=1; k<8; k++){
            if(i+k>7 || j+k>7) continue;
            if(!fields[i+k][j+k]){move=[[i,j], [i+k, j+k],""]; moves.push(move);}
            else{
              if(fields[i+k][j+k]===fields[i+k][j+k].toLowerCase()){
                move=[[i,j], [i+k, j+k], fields[i+k][j+k]];
                moves.push(move);
              }
              break;
            }
          }
          for(var k=1; k<8; k++){
            if(i+k>7 || j-k<0) break;
            if(!fields[i+k][j-k]){move=[[i,j], [i+k, j-k],""]; moves.push(move);}
            else{
              if(fields[i+k][j-k]===fields[i+k][j-k].toLowerCase()){
                move=[[i,j], [i+k, j-k], fields[i+k][j-k]];
                moves.push(move);
              }
              break;
            }
          }
          for(var k=1; k<8; k++){
            if(i-k<0 || j-k<0) break;
            if(!fields[i-k][j-k]){move=[[i,j], [i-k, j-k],""]; moves.push(move);}
            else{
              if(fields[i-k][j-k]===fields[i-k][j-k].toLowerCase()){
                move=[[i,j], [i-k, j-k], fields[i-k][j-k]];
                moves.push(move);
              }
              break;
            }
          }
          for(var k=1; k<8; k++){
            if(i-k<0 || j+k>7) break;
            if(!fields[i-k][j+k]){move=[[i,j], [i-k, j+k],""]; moves.push(move);}
            else{
              if(fields[i-k][j+k]===fields[i-k][j+k].toLowerCase()){
                move=[[i,j], [i-k, j+k], fields[i-k][j+k]];
                moves.push(move);
              }
              break;
            }
          }
          break;
        case "n":
        if(this.playerToMove==="w" && !simulate) break;
          if(i+1<8 && j+2<8 && fields[i+1][j+2]===fields[i+1][j+2].toUpperCase()){ move=[[i,j], [i+1, j+2], fields[i+1][j+2]];
            moves.push(move);}
          if(i+1<8 && j-2>=0 && fields[i+1][j-2]===fields[i+1][j-2].toUpperCase()){ move=[[i,j], [i+1, j-2], fields[i+1][j-2]];
            moves.push(move);}
          if(i-1>=0 && j+2<8 && fields[i-1][j+2]===fields[i-1][j+2].toUpperCase()){ move=[[i,j], [i-1, j+2], fields[i-1][j+2]];
            moves.push(move);}
          if(i-1>=0 && j-2>=0 && fields[i-1][j-2]===fields[i-1][j-2].toUpperCase()){ move=[[i,j], [i-1, j-2], fields[i-1][j-2]];
            moves.push(move);}
          if(i+2<8 && j+1<8 && fields[i+2][j+1]===fields[i+2][j+1].toUpperCase()){ move=[[i,j], [i+2, j+1], fields[i+2][j+1]];
            moves.push(move);}
          if(i-2>=0 && j-1>=0 && fields[i-2][j-1]===fields[i-2][j-1].toUpperCase()){ move=[[i,j], [i-2, j-1], fields[i-2][j-1]];
            moves.push(move);}
          if(i-2>=0 && j+1<8 && fields[i-2][j+1]===fields[i-2][j+1].toUpperCase()){ move=[[i,j], [i-2, j+1], fields[i-2][j+1]];
            moves.push(move);}
          if(i+2<8 && j-1>=0 && fields[i+2][j-1]===fields[i+2][j-1].toUpperCase()){ move=[[i,j], [i+2, j-1], fields[i+2][j-1]];
            moves.push(move);}
          break;
        case "N":
        if(this.playerToMove==="b" && !simulate) break;
          if(i+1<8 && j+2<8 && fields[i+1][j+2]===fields[i+1][j+2].toLowerCase()){ move=[[i,j], [i+1, j+2], fields[i+1][j+2]];
            moves.push(move);}
          if(i+1<8 && j-2>=0 && fields[i+1][j-2]===fields[i+1][j-2].toLowerCase()){ move=[[i,j], [i+1, j-2], fields[i+1][j-2]];
            moves.push(move);}
          if(i-1>=0 && j+2<8 && fields[i-1][j+2]===fields[i-1][j+2].toLowerCase()){ move=[[i,j], [i-1, j+2], fields[i-1][j+2]];
            moves.push(move);}
          if(i-1>=0 && j-2>=0 && fields[i-1][j-2]===fields[i-1][j-2].toLowerCase()){ move=[[i,j], [i-1, j-2], fields[i-1][j-2]];
            moves.push(move);}
          if(i+2<8 && j+1<8 && fields[i+2][j+1]===fields[i+2][j+1].toLowerCase()){ move=[[i,j], [i+2, j+1], fields[i+2][j+1]];
            moves.push(move);}
          if(i-2>=0 && j-1>=0 && fields[i-2][j-1]===fields[i-2][j-1].toLowerCase()){ move=[[i,j], [i-2, j-1], fields[i-2][j-1]];
            moves.push(move);}
          if(i-2>=0 && j+1<8 && fields[i-2][j+1]===fields[i-2][j+1].toLowerCase()){ move=[[i,j], [i-2, j+1], fields[i-2][j+1]];
            moves.push(move);}
          if(i+2<8 && j-1>=0 && fields[i+2][j-1]===fields[i+2][j-1].toLowerCase()){ move=[[i,j], [i+2, j-1], fields[i+2][j-1]];
            moves.push(move);}
          break;
        case "K":
        if(this.payerToMove==="b" && !simulate) break;
          if(this.castle[2] && !fields[7][1] && !fields[7][2] && !fields[7][3] && !this.isChecked("w", fields, !simulate?this.updateMoves(true):currentMoves) && !this.checkIfAttacked(7,3,!simulate?this.updateMoves(true):currentMoves, "w")){
            move=[[i,j], [7,2], "", "castleqs"];
            moves.push(move);
          }
          if(this.castle[3] && !fields[7][5] && !fields[7][6] && !this.isChecked("w", fields, !simulate?this.updateMoves(true):currentMoves) && !this.checkIfAttacked(7,5, !simulate?this.updateMoves(true):currentMoves, "w")){
            move=[[i,j], [7,6], "", "castleks"];
            moves.push(move);
          }
          if(i+1<8 && j+1<8 && fields[i+1][j+1]===fields[i+1][j+1].toLowerCase()){ move=[[i,j], [i+1, j+1], fields[i+1][j+1]];
            moves.push(move);}
          if(i+1<8 && j-1>=0 && fields[i+1][j-1]===fields[i+1][j-1].toLowerCase()){ move=[[i,j], [i+1, j-1], fields[i+1][j-1]];
            moves.push(move);}
          if(i-1>=0 && j+1<8 && fields[i-1][j+1]===fields[i-1][j+1].toLowerCase()){ move=[[i,j], [i-1, j+1], fields[i-1][j+1]];
            moves.push(move);}
          if(i-1>=0 && j-1>=0 && fields[i-1][j-1]===fields[i-1][j-1].toLowerCase()){ move=[[i,j], [i-1, j-1], fields[i-1][j-1]];
            moves.push(move);}
          if(j+1<8 && fields[i][j+1]===fields[i][j+1].toLowerCase()){ move=[[i,j], [i, j+1], fields[i][j+1]];
            moves.push(move);}
          if(j-1>=0 && fields[i][j-1]===fields[i][j-1].toLowerCase()){ move=[[i,j], [i, j-1], fields[i][j-1]];
            moves.push(move);}
          if(i+1<8 && fields[i+1][j]===fields[i+1][j].toLowerCase()){ move=[[i,j], [i+1, j], fields[i+1][j]];
            moves.push(move);}
          if(i-1>=0 && fields[i-1][j]===fields[i-1][j].toLowerCase()){ move=[[i,j], [i-1, j], fields[i-1][j]];
            moves.push(move);}
          break;
        case "k":
        if(this.payerToMove==="w" && !simulate) break;
          if(this.castle[0] && !fields[0][1] && !fields[0][2] && !fields[0][3] && !this.isChecked("b", fields, !simulate?this.updateMoves(true):currentMoves) && !this.checkIfAttacked(0,3, !simulate?this.updateMoves(true):currentMoves, "b")){
            move=[[i,j], [0,2], "", "castleqs"];
            moves.push(move);
          }
          if(this.castle[1] && !fields[0][5] && !fields[0][6] && !this.isChecked("b", fields, !simulate?this.updateMoves(true):currentMoves) && !this.checkIfAttacked(0,5, !simulate?this.updateMoves(true):currentMoves, "b")){
            move=[[i,j], [0,6], "", "castleks"];
            moves.push(move);
          }
          if(i+1<8 && j+1<8 && fields[i+1][j+1]===fields[i+1][j+1].toUpperCase()){ move=[[i,j], [i+1, j+1], fields[i+1][j+1]];
            moves.push(move);}
          if(i+1<8 && j-1>=0 && fields[i+1][j-1]===fields[i+1][j-1].toUpperCase()){ move=[[i,j], [i+1, j-1], fields[i+1][j-1]];
            moves.push(move);}
          if(i-1>=0 && j+1<8 && fields[i-1][j+1]===fields[i-1][j+1].toUpperCase()){ move=[[i,j], [i-1, j+1], fields[i-1][j+1]];
            moves.push(move);}
          if(i-1>=0 && j-1>=0 && fields[i-1][j-1]===fields[i-1][j-1].toUpperCase()){ move=[[i,j], [i-1, j-1], fields[i-1][j-1]];
            moves.push(move);}
          if(j+1<8 && fields[i][j+1]===fields[i][j+1].toUpperCase()){ move=[[i,j], [i, j+1], fields[i][j+1]];
            moves.push(move);}
          if(j-1>=0 && fields[i][j-1]===fields[i][j-1].toUpperCase()){ move=[[i,j], [i, j-1], fields[i][j-1]];
            moves.push(move);}
          if(i+1<8 && fields[i+1][j]===fields[i+1][j].toUpperCase()){ move=[[i,j], [i+1, j], fields[i+1][j]];
            moves.push(move);}
          if(i-1>=0 && fields[i-1][j]===fields[i-1][j].toUpperCase()){ move=[[i,j], [i-1, j], fields[i-1][j]];
            moves.push(move);}
          break;
        default:
        }
      }
    }
    if(!simulate) this.filterMoves(moves);
    return moves;
  }

  renderPieces(){
    var figures=document.getElementsByClassName("figure");
    while(figures[0]) figures[0].remove();
    var figure;
    for(var i=0; i<8; i++){
      for(var j=0; j<8; j++){
        if(!this.fields[i][j]) continue;
        figure=document.createElement("div");
        figure.classList.add("figure");
        figure.id=i+"-"+j;
        document.getElementById("board").appendChild(figure);
        figure.style.width=size/8+"px";
        figure.style.height=size/8+"px";
        figure.style.backgroundSize=size/8+"px";
        var translateX = j*size/8;
        var translateY = i*size/8;
        var rotate=this.rotated ? " rotate(180deg)" : " rotate(0deg)";
        figure.style.transform="translate("+translateX+"px, "+translateY+"px)"+rotate;
        if(this.fields[i][j]==this.fields[i][j].toUpperCase()) figure.classList.add("w"+this.fields[i][j].toLowerCase());
        else figure.classList.add("b"+this.fields[i][j]);
        figure.onmousedown=(e)=>handlePieceMouseDown(e);
        figure.ontouchstart=(e)=>handlePieceTouchStart(e);
      }
    }
  }

  startPromotion(color, y, x){
    var promotionElement=document.createElement("div");
    promotionElement.classList.add("promotion-div");
    promotionElement.style.width=size/2;
    promotionElement.style.height=size/8;
    var rotate=this.rotated ? " rotate(180deg)" : " rotate(0deg)";
    var translateX=size/4;
    var translateY=size/2-size/16;
    promotionElement.style.transform="translate("+translateX+"px, "+translateY+"px)"+rotate;
    promotionElement.style.zIndex="9999";
    promotionElement.style.position="absolute";
    promotionElement.style.backgroundColor="#808080";
    document.getElementById("board").appendChild(promotionElement);
    if(color==="w" || (this.rotated && color==="b")) promotionElement.style.top="10px";
    else promotionElement.style.top="-10px";


    var promotionElement2=document.createElement("div");
    promotionElement2.classList.add("promotion-div2");
    promotionElement2.style.width=window.innerWidth-20;
    promotionElement2.style.height=window.innerHeight+scrollY-5;
    promotionElement2.style.position="absolute";
    promotionElement2.style.top="-20px"
    if(this.rotated){
      promotionElement2.style.bottom="-"+this.element.offsetTop;
      promotionElement2.style.right="-"+this.element.offsetLeft;
      promotionElement2.style.left="";
    }
    else {
      promotionElement2.style.left="-"+this.element.offsetLeft;
      promotionElement2.style.right="";
      promotionElement2.style.bottom="";
    }
    promotionElement2.style.zIndex="999";
    promotionElement2.style.position="absolute";
    promotionElement2.style.backgroundColor="rgba(30,30,30,0.6)";
    document.getElementById("board").appendChild(promotionElement2);

    var knight=document.createElement("div");
    knight.classList.add("promotion-knight");
    knight.classList.add(color+"n");
    knight.style.width="25%";
    knight.style.height="100%";
    knight.style.left="0%";
    knight.onclick=()=>this.promote(color,y,x,"n");
    knight.ontouchstart = (e) => {e.preventDefault(); this.promote(color,y,x,"n");}
    promotionElement.appendChild(knight);
    var bishop=document.createElement("div");
    bishop.classList.add("promotion-bishop");
    bishop.classList.add(color+"b");
    bishop.style.width="25%";
    bishop.style.height="100%";
    bishop.style.left="25%";
    bishop.onclick=()=>this.promote(color,y,x,"b");
    bishop.ontouchstart = (e) => {e.preventDefault(); this.promote(color,y,x,"b");}
    promotionElement.appendChild(bishop);
    var rook=document.createElement("div");
    rook.classList.add("promotion-rook");
    rook.classList.add(color+"r");
    rook.style.width="25%";
    rook.style.height="100%";
    rook.style.left="50%";
    rook.onclick=()=>this.promote(color,y,x,"r");
    rook.ontouchstart = (e) => {e.preventDefault(); this.promote(color,y,x,"r");}
    promotionElement.appendChild(rook);
    var queen=document.createElement("div");
    queen.classList.add("promotion-queen");
    queen.classList.add(color+"q");
    queen.style.width="25%";
    queen.style.height="100%";
    queen.style.left="75%";
    queen.style.backgroundColor="indianred";
    queen.onclick=()=>this.promote(color,y,x,"q");
    queen.ontouchstart = (e) => {e.preventDefault(); this.promote(color,y,x,"q");}
    promotionElement.onmouseover=()=>queen.style.backgroundColor="";
    promotionElement.appendChild(queen);
  }

  promote(color,y,x,pieceType, promotionInHistory){
    var promotionElement=document.getElementsByClassName("promotion-div")[0];
    if(promotionElement) promotionElement.remove();
    var promotionElement2=document.getElementsByClassName("promotion-div2")[0];
    if(promotionElement2) promotionElement2.remove();
    if(color==="w") this.fields[y][x]=pieceType.toUpperCase()
    else this.fields[y][x]=pieceType
    var figure=document.getElementById(y+"-"+x);
    if(figure) figure.remove();
    figure=document.createElement("div");
    figure.classList.add("figure");
    figure.style.width=size/8+"px";
    figure.style.height=size/8+"px";
    figure.style.backgroundSize=size/8+"px";
    document.getElementById("board").appendChild(figure);
    figure.onmousedown=(e)=>handlePieceMouseDown(e);
    figure.ontouchstart=(e)=>handlePieceTouchStart(e);
    var translateX = x*size/8;
    var translateY = y*size/8;
    var rotate=this.rotated ? " rotate(180deg)" : " rotate(0deg)";
    figure.style.transform="translate("+translateX+"px, "+translateY+"px)"+rotate;
    figure.id=y+"-"+x;
    figure.classList.add(color+pieceType);
    var historyStep=document.getElementById("history-"+this.history.length);
    historyStep.insertAdjacentHTML('beforeend', "="+pieceType.toUpperCase());
    this.history[this.history.length-1][13]=[color,y,x,pieceType];
    var fields = this.fields.map(function(arr) {
      return arr.slice();
    });
    this.history[this.history.length-1][4]=fields;
    this.history[this.history.length-1][3]=pieceType.toUpperCase();
    this.updateMoves();
    this.hideMoves();
    if(this.isCheckmated(this.playerToMove)) {
      this.checkMate=true;
      this.whitePlayer.timer.stopTimer();
      this.blackPlayer.timer.stopTimer();
      if(this.playerToMove==="w") this.winner="b";
      else this.winner="w";
    }
    else if(this.isChecked(this.playerToMove, this.fields, this.updateMoves(true))) this.check=true;
    else if(this.isStalemated(this.playerToMove)){
      this.staleMate=true;
      this.whitePlayer.timer.stopTimer();
      this.blackPlayer.timer.stopTimer();
      this.winner="d";
    }
    else this.check=false;
    if(this.checkMate) historyStep.insertAdjacentHTML('beforeend', "#");
    if(this.check && !this.checkMate) historyStep.insertAdjacentHTML('beforeend', "+");
    if(this.winner){
      winningDiv = document.createElement("div");
      winningDiv.id="winning-div";
      winningDiv.style.width="100%";
      winningDiv.style.height=this.size/4;
      winningDiv.style.top=this.size/2;
      winningDiv.style.lineHeight=this.size/4+"px";
      winningDiv.style.fontSize=this.size/8;
      winningDiv.innerHTML="";
      if(this.winner==="d") winningDiv.innerHTML+="Drawn by "+(this.staleMate?"stalemate":"repetition");
      else winningDiv.innerHTML+=(this.winner==="w"?"White ":"Black ")+"won by "+(this.checkMate?"checkmate":"timeout");
      var hideParagraph=document.createElement("p");
      hideParagraph.classList.add("hide");
      hideParagraph.innerHTML="Hide";
      winningDiv.appendChild(hideParagraph);
      hideParagraph.onclick=()=>{if(winningDiv) winningDiv.remove();}
      winningDiv.style.position="absolute";
      winningDiv.style.zIndex=99999999;
      winningDiv.style.textAlign="center";
      winningDiv.style.backgroundColor="rgba(0,100,100,0.9)";
      winningDiv.style.color="#fff";
      document.getElementById("body").appendChild(winningDiv);
    }
  }

  claimWin(){
    if(this.winner){
      winningDiv = document.createElement("div");
      winningDiv.id="winning-div";
      winningDiv.style.width="100%";
      winningDiv.style.height=this.size/4;
      winningDiv.style.top=this.size/2;
      winningDiv.style.lineHeight=this.size/4+"px";
      winningDiv.style.fontSize=this.size/8;
      winningDiv.innerHTML="";
      if(this.winner==="d") winningDiv.innerHTML+="Drawn by "+(this.staleMate?"stalemate":"repetition");
      else winningDiv.innerHTML+=(this.winner==="w"?"White ":"Black ")+"won by "+(this.checkMate?"checkmate":"timeout");
      var hideParagraph=document.createElement("p");
      hideParagraph.classList.add("hide");
      hideParagraph.innerHTML="Hide";
      winningDiv.appendChild(hideParagraph);
      hideParagraph.onclick=()=>{if(winningDiv) winningDiv.remove();}
      winningDiv.style.position="absolute";
      winningDiv.style.zIndex=99999999;
      winningDiv.style.textAlign="center";
      winningDiv.style.backgroundColor="rgba(0,100,100,0.9)";
      winningDiv.style.color="#fff";
      document.getElementById("body").appendChild(winningDiv);
    }
  }
}
