class Timer{
  constructor(time, name, color){
    this.name=name;
    this.time=time;
    this.color=color;
    this.interval="";
    this.element=document.createElement("div");
    this.element.innerHTML=this.name+": "+this.beautifyTime();
    this.element.id="timer-"+color;
    this.timerRunning=false;
  }

  setTime(time){
    this.time=time;
  }

  beautifyTime(){
    var newTime="";
    if(this.time>3600){
      newTime+=Math.floor(this.time/3600)+"h, ";
    }
    if(this.time>60){
      if(((this.time%3600)/60)<10) newTime+="0";
      newTime+=Math.floor((this.time%3600)/60)+"m, ";
    }
    if(((this.time%3600)%60)<10) newTime+="0"
    newTime+=Math.floor((this.time%3600)%60)+"s";
    if(this.time<60){
      var rand1=randomInt(9);
      if((this.time*100%100)+rand1>100) rand1=0;
      if(Math.floor(this.time*100%100)+rand1<10) newTime+=", 0";
      else newTime+=", "
      if(this.time===0) newTime+="00ms";
      else newTime+=Math.floor(this.time*100%100)+rand1+""+randomInt(9)+"ms";
    }
    return newTime;
  }

  startTimer(){
    this.timerRunning=true;
    this.interval=setInterval(()=>{if(this.time<=0){this.stopTimer(); this.time=0.05; if(board.playerToMove==="w") board.winner="b"; else board.winner="w"; board.claimWin();} this.time-=.05; this.element.innerHTML=this.name+": "+this.beautifyTime();}, 50);
  }

  stopTimer(){
    this.timerRunning=false;
    clearInterval(this.interval);
  }
}
