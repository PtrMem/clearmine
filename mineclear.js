 //hold the map information
var mapinfo=new MapInfo(9,9,10);
/**
 * hold the player data 
 */
var player=new Object();
player.name="";
player.time=0;
player.mineNum=0;

//is game start?
//0 mean not start
//1 mean game have started
//-1 mean game over
var gamestatus=0;
//hold the count had opened
var opencnt=0;
var allmines=mapinfo.mineNum;

//set the game images
var imgbase='imgs/';
var boom="boom.jpg";
var win="win.jpg";
var fault="fault.jpg";
var mark="mark.jpg";
var allboom="allboom.jpg";

//the maps 
gamemap=new Array();
playermap=new Array();
minepos=new Array();


//set gamemap and playermap to 0
var arr=new Array();
for(var i=0;i<mapinfo.width;i++){
    arr[i]=0;
}
for(var i=0;i<mapinfo.height;i++){
    //deep copy
    gamemap[i]=arr.slice(0);
    playermap[i]=arr.slice(0);
}

//create mines position
//-1 mean it is a mine
for(var i=0;i<mapinfo.mineNum;i++){
    var k=parseInt(Math.random()*(mapinfo.height*mapinfo.width));
    //is exist?
    if(minepos[k]!=-1){
        minepos[k]=-1;
        arr[i]=k;
    }else{
        --i;
    }
}

//set minepos to the length is mapinfo.mineNum
minepos=arr.slice(0);
//create game map
//array[] transform to array[][]
for(var i=0;i<mapinfo.mineNum;i++){
        var w=parseInt(minepos[i]%(mapinfo.width));
        var h=parseInt(minepos[i]/(mapinfo.width));
        gamemap[h][w]=-1;
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
for(var i=0;i<mapinfo.mineNum;i++){
        var wd=parseInt(minepos[i]%(mapinfo.width));
        var ht=parseInt(minepos[i]/(mapinfo.width));
        setTips(ht,wd-1);
        setTips(ht,wd+1);
        setTips(ht-1,wd);
        setTips(ht-1,wd-1);
        setTips(ht-1,wd+1);
        setTips(ht+1,wd);
        setTips(ht+1,wd-1);
        setTips(ht+1,wd+1);
}

//set the  game doesnot start information to front end 
var swminenum=document.getElementById('minenumber');
var swtime=document.getElementById("gametime");
swminenum.innerHTML=mapinfo.mineNum;
swtime.innerHTML='0';
//listen player operations
//listen the clearing  mines operations
document.getElementById("mainer").addEventListener("mousedown",clearmines,false);
//listen the game over operations
document.getElementById("gameover").addEventListener("click",listenchse,false);
document.getElementById("gameover").addEventListener("mouseout",hidemodes,false);
document.getElementById("newgame").addEventListener("mouseover",swbynewg,false);
document.getElementById("modes").addEventListener("mouseover",swmodesinfo,false);
document.getElementById("modes").addEventListener("mouseout",hidetxt,false);
document.getElementById("close").addEventListener("mouseover",hdbyexit,false);

