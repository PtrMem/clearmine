/**
 * MapInfo 
 * the clear mine map information
 * @param height $height 
 * @param width $width 
 * @param mineNum $mineNum 
 */
function MapInfo(heit,wid,mineNum){
    this.height=heit;
    this.width=wid;
    this.mineNum=mineNum;
}

/**
 * setTips 
 * set the number around mine
 * 
 *      x-1,y-1|x,y-1|x+1,y+1
 *      x-1,y  | x,y |x+1,y
 *      x-1,y+1|x,y+1|x+1,y+1
 * 
 * @param ht $ht mean y 
 * @param wd $wd mean x
 */
function setTips(ht,wd){
    if(ht>=0&&wd>=0&&ht<mapinfo.height&&wd<mapinfo.width&&gamemap[ht][wd]!=-1){
            gamemap[ht][wd]++;
    }
}

function statisfy(h,w){
    if(w<mapinfo.width&&w>=0&&h<mapinfo.height&&h>=0){
            return true;
    }else
        return false;
        
}
//show the tips if not mine
function showTips(h,w){
    if(statisfy(h,w)){
        var table=document.getElementById("map").rows[h].cells;
        //had marked?
        if(playermap[h][w]==1)
            return;
        //had showed?
        if(table)
            if(table[w].style.backgroundColor=='white')
                    return;
    
        //is not space
        if(gamemap[h][w]!=0){
            if(table){
                table[w].style.backgroundColor='white';
                table[w].innerHTML=gamemap[h][w];
                opencnt++;
            }
            return;
        }
        //is space
        if(table)
            table[w].style.backgroundColor='white';
            opencnt++;
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
    if(gamestatus==-1)
        return;
    var pt=document.getElementById("gametime");
    pt.innerHTML=parseInt((new Date().getTime()-player.time)/1000);
    if(gamestatus==1)
        setTimeout(swpytime,1000);
}

//set all the mines is boom
function swallboom(){
    var tb=document.getElementById('map');
    var img=document.createElement("img");
    img.src=imgbase+allboom;
    img.alt="X";
    var w,h,tmp,childs;
    //var img=document.createElement("img");
    //img.src=imgbase+allboom;
    //img.alt="X";
    for(var i=0;i<minepos.length;i++){
        if(minepos[i]==-1){
            w=parseInt(i%(mapinfo.width));
            h=parseInt(i/(mapinfo.width));
            tmp=tb.rows[h].cells;
            childs=tmp[w].childNodes;
            //alert(tmp[w].nodeName);
            //if had marked then remove the marked and set boom
            if(playermap[h][w]==1){
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
    
}
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
    ret=player.time>60?player.time>3600?parseInt(player.time/3600)+'小时':parseInt(player.time/60)+'分':player.time+'秒';
    playif.innerHTML=alt+'<p>时间: '+ret+'</p>';
    //show the image of boom or win or fault 
    document.body.style.backgroundColor="gray";  
    sw.style.display="block";

    //hide the image;
    //display the player score after 2s
    if(isboom==0)
        setTimeout(function(){
            sw.style.backgroundImage='';
            playif.style.display="block";
            che.style.display="block";
       
        },2000);
}


//listen player clearmine operation
function clearmines(e){
    //if game over undo everything
    if(gamestatus==-1)
        return;
    
    //target hold the event target
    var target=e.target;
    var ht,wd;
    //mark data
    var setmark=document.createElement("img");
    setmark.src=imgbase+mark;
    setmark.alt="X";
    //set mine number and time to front end
    var swminenum=document.getElementById('minenumber');
    var swtime=document.getElementById("gametime");
    //if happan on td element
    if(target.nodeName.toUpperCase()=="TD"){
        if(gamestatus==0){
            //set game is start and player data
            gamestatus=1;
            player.time=new Date().getTime();
            player.mineNum=mapinfo.mineNum;
            swpytime();
        }
        //get the position
        wd=target.cellIndex;
        ht=target.parentNode.rowIndex;
        //is player mark? 
        //1 mean marked.
        if(playermap[ht][wd]!=1){
            //if left button down
            if(e.button==0){
                //is mine? yes show boom
                if(gamemap[ht][wd]==-1){
                    player.time=parseInt((new Date().getTime()-player.time)/1000);
                    gamestatus=-1;
                    swallboom();
                    setTimeout(function(){show("boom");},2000);
                    setTimeout(function(){show("fault");},2000);
                }else{
                    showTips(ht,wd);
                }
                //if right button down
            }else if(e.button==2){
                if(gamemap[ht][wd]==-1){
                    mapinfo.mineNum--;
                    player.mineNum--;
                    //set player mark
                    playermap[ht][wd]=1;
                    //show mark
                    if(target.style.backgroundColor!='white')
                        target.appendChild(setmark);
                    swminenum.innerHTML=player.mineNum;

                }else{
                    player.mineNum--;
                    //set player mark
                    playermap[ht][wd]=1;
                    //show mark
                    if(target.style.backgroundColor!='white')
                        target.appendChild(setmark);
                    swminenum.innerHTML=player.mineNum;
                }

            }

        }
        //really clear all?
        //compare the mine number and the count had opened
        if(mapinfo.mineNum==0&&opencnt==mapinfo.height*mapinfo.width-allmines){
            player.time=parseInt((new Date().getTime()-player.time)/1000);
            gamestatus=-1;
            show("win");
            return;
        }
     //unmark
    }else if(target.nodeName=='img'||target.nodeName=='IMG'){
        wd=target.parentNode.cellIndex;
        ht=target.parentNode.parentNode.rowIndex;
        if(playermap[ht][wd]==1){
            if(e.button==2){
                player.mineNum++;
                playermap[ht][wd]=0;
                //remove the marked
                target.parentNode.removeChild(target);
                //plus the player.mine number
                swminenum.innerHTML=player.mineNum;
                if(gamemap[ht][wd]==-1)
                    mapinfo.mineNum++;
            }
        }
    }
}

function listenchse(e){
    var etarget=e.target;
    if(etarget.type!="click")
        return;
    if(etarget.nodeName.toUpperCase()=='A'){
        if(etarget.id=="close"){
            etarget.parentNode.parentNode.style.display="none"; 
        }else if(etarget.id=="newgame"){
            etarget.parentNode.parentNode.style.display="none"; 
            location.reload("true");
        }
        
    }
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
    //element id
    var mdsif="modesinfo";
    var mds="modes";
    var newg="newgame";
    var hd=document.getElementById(mdsif);
    if(target.nodeName.toUpperCase()=="A"&&target.parentNode.id==("endchoose")){
        e.stopPropagation();
    }else if(target.id=="over"){
        document.getElementById("modesinfo").style.display="none";
    }
}
function hdbyexit(){
    if(document.getElementById("modesinfo").style.display!="none")
         document.getElementById("modesinfo").style.display="none";
}

function swmodesinfo(e){
    var target=e.target;
    var txt=document.getElementById("modetxt");
    var haddis=0;
    var esy="10个雷，9X9网格"
    var normal="40个雷，16x16网格"
    var hard="99个雷，16x30网格"
    var contx=target.innerHTML;
    if(target.nodeName.toUpperCase()=='A')
    switch(contx){
        case "初级":
            txt.innerHTML=esy;
            haddis++;
            break;
        case "中级":
            txt.innerHTML=normal;
            haddis++;
            break;
        case "高级":
            txt.innerHTML=hard;
            haddis++;
            break;
        default:
            break;
    }
    if(haddis)
        txt.style.display="list-item";
    e.stopPropagation();
}