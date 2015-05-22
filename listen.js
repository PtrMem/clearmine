//in the range?
function statisfy(h,w){
    if(w<game.map.info.width&&w>=0&&h<game.map.info.height&&h>=0){
            return true;
    }else
        return false;
        
}
//show the tips if not mine
function showTips(h,w){
    if(statisfy(h,w)){
        var table=document.getElementById("map").rows[h].cells;
        //had marked?
        if(game.map.playerMap[h][w]==1)
            return;
        //had showed?
        if(table)
            if(table[w].style.backgroundColor=='white')
                    return;
    
        //is not space
        if(game.map.gameMap[h][w]!=0){
            if(table){
                table[w].style.backgroundColor='white';
                table[w].innerHTML=game.map.gameMap[h][w];
                game.done++;
            }
            return;
        }
        //is space
        if(table)
            table[w].style.backgroundColor='white';
            game.done++;
            showTips(h-1,w-1);
            showTips(h-1,w);
            showTips(h-1,w+1);
            showTips(h,w-1);
            showTips(h,w+1);
            showTips(h+1,w-1);
            showTips(h+1,w);
            showTips(h+1,w+1);                
    }
}
//show playing time
function swpytime(){
    if(game.status==-1)
        return;
    var pt=document.getElementById("gametime");
    pt.innerHTML=parseInt((new Date().getTime()-game.player.time)/1000);
    if(game.status==1)
        setTimeout(swpytime,1000);
}

//set all the mines is boom
function swallboom(){
    var tb=document.getElementById('map');
    var img=document.createElement("img");
    img.src=imgbase+allboom;
    img.alt="X";
    var w,h,tmp,childs;
    for(var i=0;i<game.map.info.mineNum;i++){
            w=parseInt(game.map.minePos[i]%(game.map.info.width));
            h=parseInt(game.map.minePos[i]/(game.map.info.width));
            tmp=tb.rows[h].cells;
            childs=tmp[w].childNodes;
            //alert(tmp[w].nodeName);
            //if had marked then remove the marked and set boom
            if(game.map.playerMap[h][w]==1){
                if(childs.length!=0){
                    for(var j=0;j<childs.length;j++){
                        childs[j].parentNode.removeChild(childs[j]);
                        //stop appendChild move element
                        //real append element with cloneNode(true)
                        tmp[w].appendChild(img.cloneNode(true));
                    }
                }
            }else{
                tmp[w].appendChild(img.cloneNode(true));
            }
    }
    
}
//show the game status:win,fault,and boom 
function show(key){
    var playif=document.getElementById("playerinfo");
    var sw=document.getElementById("gameover");
    var che=document.getElementById("endchoose");
    var alt="";
    var ret='url("';
    var isboom=0;
    switch(key){
        case "boom":
            ret+=(imgbase+boom);
            isboom++;
            break;
        case "fault":
            ret+=(imgbase+fault);
            alt+="<p>不好意思，你输了。Good lucky next time!</p>";
            break;
        case "win":
            ret+=(imgbase+win);
            alt+="<p>恭喜！你赢了！ </p>";
            break;
        default:
            break;           
    }
    ret=ret+'")';

    sw.style.backgroundImage=ret;
    //ret=game.player.time>60?game.player.time>3600?parseInt(game.player.time/3600)+'小时'+parseInt(game.player.time%3600)+'分'+:parseInt(game.player.time/60)+'分':game.player.time+'秒';
    //get game.player.time 
    playif.innerHTML=alt+'<p>时间: '+game.player.time+'秒</p>';   
    document.body.style.backgroundColor="gray";  
    //show the image of boom or win or fault 
    sw.style.display="block";

    //hide the image;
    //display the player score after 2s
    if(isboom==0)
        setTimeout(function(){
            document.getElementById("playerinfo").style.display="block";
            document.getElementById("gameover").style.backgroundImage='';
            document.getElementById("endchoose").style.display="block";
            document.getElementById("over").style.display="block";
        },2000);
}


//listen player clearmine operation
function clearmines(e){
    //if game over undo everything
    if(game.status==-1)
        return;
    
    //target hold the event target
    var target=e.target;
    var ht,wd;
    //mark data
    var setmark=document.createElement("img");
    setmark.src=imgbase+mark;
    setmark.alt="X";
    //update mine number and time on front end
    var swminenum=document.getElementById('minenumber');
    //if happan on td element
    if(target.nodeName.toUpperCase()=="TD"){
        if(game.status==0){
            //set game is start and player data
            game.status=1;
            game.player.time=new Date().getTime();
            game.player.mineNum=game.map.info.mineNum;
            //begin update playing time
            swpytime();
        }
        //get the position
        wd=target.cellIndex;
        ht=target.parentNode.rowIndex;
        //is player mark? 
        //1 mean marked.
        if(game.map.playerMap[ht][wd]!=1){
            //if left button down
            if(e.button==0){
                //is mine? yes show boom
                if(game.map.gameMap[ht][wd]==-1){
                    game.player.time=parseInt((new Date().getTime()-game.player.time)/1000);
                    game.status=-1;
                    swallboom();
                    setTimeout(function(){show("boom");},1000);
                    setTimeout(function(){show("fault");},4000);
                }else{
                    showTips(ht,wd);
                }
                //if right button down
            }else if(e.button==2){
                if(game.map.gameMap[ht][wd]==-1){
                    game.map.info.mineNum--;
                    game.player.mineNum--;
                    //set player mark
                    game.map.playerMap[ht][wd]=1;
                    //show mark
                    if(target.style.backgroundColor!='white')
                        target.appendChild(setmark);
                    swminenum.innerHTML=game.player.mineNum;

                }else{
                    gaem.player.mineNum--;
                    //set player mark
                    game.map.playerMap[ht][wd]=1;
                    //show mark
                    if(target.style.backgroundColor!='white')
                        target.appendChild(setmark);
                    swminenum.innerHTML=game.player.mineNum;
                }

            }

        }
        //really clear all?
        //compare the mine number and the count had opened
        if(game.map.info.mineNum==0&&game.done==game.map.info.height*game.map.info.width-game.map.info.mineNum){
            game.player.time=parseInt((new Date().getTime()-game.player.time)/1000);
            game.status=-1;
            show("win");
            return;
        }
     //unmark
    }else if(target.nodeName=='img'||target.nodeName=='IMG'){
        wd=target.parentNode.cellIndex;
        ht=target.parentNode.parentNode.rowIndex;
        if(game.map.playerMap[ht][wd]==1){
            if(e.button==2){
                game.player.mineNum++;
                game.map.playerMap[ht][wd]=0;
                //remove the marked
                target.parentNode.removeChild(target);
                //plus the player.mine number
                swminenum.innerHTML=game.player.mineNum;
                if(game.map.gameMap[ht][wd]==-1)
                    game.map.info.mineNum++;
            }
        }
    }
}

//listen the click when game over
function listenchse(e){
    var etarget=e.target;
    var gameover=document.getElementById("gameover")
    var curmode=game.map.info.mode;
    if(etarget.nodeName.toUpperCase()=='A'){
        if(etarget.id=="close"){
            gameover.style.display="none"; 
        }else if(etarget.id=="newgame"){
            newGame(game.map.info);
            gameover.style.display="none";                
        }else if(etarget.parentNode.id=="modes"){
            gameover.style.display="none";
            if(etarget.innerHTML=="初级")
                newGame(easy);
            else if(etarget.innerHTML=="中级")
                newGame(normal);
            else if(etarget.innerHTML=="高级")
                newGame(hard);
            gameover.style.display="none";
        }       
    }
}

function newGame(mapinfo){
    resetGame();
    document.getElementById("playerinfo").style.display="none";
    document.getElementById("endchoose").style.display="none";
    document.getElementById("modesinfo").style.display="none";
    document.body.style.backgroundColor="white";
    //create new game data 
    //mines position,game map and player map
    game.createBgData(mapinfo);
    //create the game front-end 
    game.createFrontEnd(mapinfo);
}

function resetGame(){
    game.done=0;
    game.status=0;
    game.player.time=0;
    game.player.mode="";
}

//hidden the modestxt when onmouseout happan on modes area
function hidetxt(e){
    document.getElementById("modetxt").innerHTML='';
    e.stopPropagation();
}

//show modes by the newgame when mouse  on it
function swbynewg(){
   var sw=document.getElementById("modesinfo");
   sw.style.display="block";
}

//mouseout on over function  
function hidemodes(e){
    var target=e.target;
    var destTarget=e.relatedTarget;
    //element id
    var mdsif="modesinfo";
    var mds="modes";
    var newg="newgame";
    var hd=document.getElementById(mdsif);
    if(target.id=="endchoose"&&(destTarget.id=="modesinfo"||destTarget.parentNode.id=="modes"))
        //if mouse in modesinfo or modes stop hidden modesinfo
        clearTimeout(hidemdif);
    else if(target.id=="newgame"&&destTarget.id=="endchoose"){
        //if mouse doesnot in modesinfo or modes hidden modesinfo after 800ms
            hidemdif=setTimeout(function(){document.getElementById("modesinfo").style.display="none";},800);
    }else if(target.id=="over"){
        document.getElementById("modesinfo").style.display="none";
    }
}

//show modes informations on over
function swOverModeif(e){
    if(e.target.nodeName.toUpperCase()=='A')
    modesInfo(e,"modetxt");
    e.stopPropagation();
}


//show modes infomations
function modesInfo(e,id){
    var target=e.target;
    var txt=document.getElementById(id);
    var esy="10个雷，9X9网格"
    var normal="40个雷，16x16网格"
    var hard="99个雷，16x30网格"
    var contx=target.innerHTML;
    txt.innerHTML=modeContx(contx);
    txt.style.display="list-item";
};
//return the mode infomation
function modeContx(key){
    var esy="10个雷，9X9网格"
    var normal="40个雷，16x16网格"
    var hard="99个雷，16x30网格"
    var ret;
    switch(key){
        case "初级":
            ret=esy;
            break;
        case "中级":
            ret=normal;
            break;
        case "高级":
            ret=hard;
            break;
        default:
            break;
    }  
    return ret;
}

//listen options funcitons
function optionCk(e){
   var target=e.target;
   var ret;
    if(target.nodeName.toUpperCase()=="A"){
        switch(target.innerHTML){
            case "初级":
                ret=easy;
                break;
            case "中级":
                ret=normal;
                break;
            case "高级":
                ret=hard;
                break;
        }
        
        newGame(ret);
    }
}

function swOpMdif(e){
    var target=e.target;
    var pos=target.parentNode.getBoundingClientRect();
    var dest=document.getElementById('popup');
    dest.style.left=pos.right;
    dest.style.top=pos.top;
    if(target.nodeName.toUpperCase()=="A"){
        modesInfo(e,"popup");
        dest.style.display="block";
    }

}

function hdOpMdif(e){
    var dest=document.getElementById('popup');
    var target=e.target;
    if(target.nodeName.toUpperCase()=="LI"||target.nodeName.toUpperCase()=="A"||target.nodeName.toUpperCase()=="UL")
        dest.style.display="none";
}
