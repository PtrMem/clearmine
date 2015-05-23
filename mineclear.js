function MapInfo(ht,wd,mine,mode){
    this.height=ht;
    this.width=wd;
    this.mineNum=mine;
    this.mode=mode; //game mode:easy,normal,hard or custom
    return this;

};

function Player(){
    this.time=0;
    this.mode=" ";
    this.mineNum=0;
}

function Map(mapinfo){
    this.info=mapinfo;
    this.playerMap=new Array(); //hold the player marked
    this.gameMap=new Array();   
    this.minePos=new Array();   //hold on mines position
    return this;
};


Map.prototype.setTips=function(ht,wd){
        if(ht>=0&&wd>=0&&ht<this.info.height&&wd<this.info.width&&this.gameMap[ht][wd]!=-1){
            this.gameMap[ht][wd]++;
        }
};
//creat the mines position ,set tips around the mines 
//gameMap include mines position and around the mines tips
//init playerMap
Map.prototype.createMap=function(){
    //init gamemap and playermap to 0
    var arr=new Array();
    var i=0;
    for(i=0;i<this.info.width;i++){
        arr[i]=0;
    }
    for(i=0;i<this.info.height;i++){
        //deep copy
        this.gameMap[i]=arr.slice(0);
        this.playerMap[i]=arr.slice(0);
    }
    //create mines position
    //-1 mean it is a mine
    for(i=0;i<this.info.mineNum;i++){
        var k=parseInt(Math.random()*(this.info.height*this.info.width));
        //is exist?
        if(this.minePos[k]!=-1){
            this.minePos[k]=-1;
            arr[i]=k;
        }else{
            --i;
        }
    }
    //set minepos to the length is mapinfo.mineNum
    this.minePos=arr.slice(0);
    for(i=0;i<this.info.mineNum;i++){
        var w=parseInt(this.minePos[i]%(this.info.width));
        var h=parseInt(this.minePos[i]/(this.info.width));
        this.gameMap[h][w]=-1;
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
    
    for(var i=0;i<this.info.mineNum;i++){
        var wd=parseInt(this.minePos[i]%(this.info.width));
        var ht=parseInt(this.minePos[i]/(this.info.width));
        this.setTips(ht,wd-1);
        this.setTips(ht,wd+1);
        this.setTips(ht-1,wd);
        this.setTips(ht-1,wd-1);
        this.setTips(ht-1,wd+1);
        this.setTips(ht+1,wd);
        this.setTips(ht+1,wd-1);
        this.setTips(ht+1,wd+1);
    }
    return this;
}

function ClearMine(mapinfo){
    this.pyTimeHd=0;    // the updata playing time handle 
    this.player=new Player();
    this.status=0;      //game status:0 mean doesnot start ,1 mean playing,-1 mean game over
    this.frontEnds=new Array();
    this.map=new Map(mapinfo); //default map
    this.defmap=3;
    this.done=0;    /*hold the real clear mine times,it mean win,
                      *when it equal to map.info.height*map.info.width-map.info.mineNum*/
    //create default front-end
    //in the frontEnd array
    //index 0 mean easy 9x9 grids 10 mines
    //index 1 mean normal 16x16 grids 40 mines
    //index 2 mean hard 16x30 grids 99 mines
   // function(){
        //var def=document.createElement("table");
        //def.id="map";

        function ctdef(ht,wd){
                var tmp=' ';
                var ret=' ';
                var rets=new Array();
                for(var j=0;j<wd;j++){
                    tmp+='<td></td>';
                }
                for(var k=0;k<ht;k++){
                    ret='<tr>'+tmp+'</tr>';
                    rets[k]=ret;
                } 
                //set the map
                //return def.innerHTML=rets.join(' ');
                return rets.join(' ');
        };
            this.frontEnds[0]=ctdef(9,9);
            this.frontEnds[1]=ctdef(16,16);
            this.frontEnds[2]=ctdef(16,30);
   // };
        return this;
};

//get the default front-end
ClearMine.prototype.getdefFend=function(mode){
    var ret;
    if(mode=="easy")
        ret=this.frontEnds[0];
    if(mode=="normal")
        ret=this.frontEnds[1];
    if(mode=="hard")
        ret=this.frontEnds[2];
    return ret;
};

//create game map data
ClearMine.prototype.createBgData=function(mapinfo){
    //create game map data
    this.player.mode=mapinfo.mode.slice(0);
    this.player.mineNum=mapinfo.mineNum;
    this.map=new Map(mapinfo).createMap();
};

//create game main front end
ClearMine.prototype.createFrontEnd=function(mapinfo){
    var ht=mapinfo.height;
    var wd=mapinfo.width;
    var frontEnd=document.getElementById("map");
    //for setting UI
    var gst=document.getElementById("gamestatus");
    var gstimgrt=document.getElementById("gstrtimg");
    var gstimglt=document.getElementById("gstltimg");
    //for setting the  game doesnot start information to front end     
    //setthe  game doesnot start information to front end 
    document.getElementById('minenumber').innerHTML=mapinfo.mineNum;
    document.getElementById('gametime').innerHTML='0';
    
    //create the grids
    var fd='';
    var tmp=' ';
    var ret=' ';
    var rets=new Array();
    if(mapinfo.mode=="easy")
        fd=this.getdefFend("easy");
    else if(mapinfo.mode=="normal")
        fd=this.getdefFend("normal");
    else if(mapinfo.mode=="hard")
        fd=this.getdefFend("hard");
    else{
        for(var j=0;j<wd;j++){
            tmp+='<td></td>';
        }
        for(var i=0;i<ht;i++){
            ret='<tr>'+tmp+'</tr>';
            rets[i]=ret;
        } 
        //set the map
        fd=rets.join(' ');
    }
    frontEnd.innerHTML=fd;
    //set gamestatus
    //image size of mine number and playing time
    ret=wd>9?16:9;
    tmp=wd>9?'50px':'60px';
    switch(ret){
        case 9:
            //set gamestatus in the center
            gst.style.width=wd*35+'px';
            gst.style.marginLeft=parseInt((980-wd*35)/2)+"px";
            gstimgrt.style.width=tmp;
            gstimgrt.style.height=tmp;
            gstimglt.style.height=tmp;
            gstimglt.style.width=tmp;
            break;
        case 16:
            gst.style.width=wd*25+'px';
            gst.style.marginLeft=parseInt((980-wd*25)/2)+"px";
            gstimgrt.style.width=tmp;
            gstimgrt.style.height=tmp;
            gstimglt.style.height=tmp;
            gstimglt.style.width=tmp;
            var tds=document.getElementsByTagName("td");
            for(var i=0;i<tds.length;i++){
                tds[i].style.width='27px';
                tds[i].style.height='27px';
            }
            break;
    }
};

    //listen player operations
ClearMine.prototype.listenplayer=function(){
    //listen the clearing  mines operations
    document.getElementById("mainer").addEventListener("mousedown",clearmines,false);
    //listen the game over operations
    document.getElementById("gameover").addEventListener("click",listenchse,false);
    document.getElementById("gameover").addEventListener("mouseout",hidemodes,false);
    document.getElementById("newgame").addEventListener("mouseover",swbynewg,false);
    document.getElementById("modes").addEventListener("mouseover",swOverModeif,false);
    document.getElementById("modes").addEventListener("mouseout",hidetxt,false);
    //listen options click
    document.getElementById("options").addEventListener("click",optionCk,false);
    document.getElementById("options").addEventListener("mouseover",swOpMdif,false);
    document.getElementById("options").addEventListener("mouseout",hdOpMdif,false);
};

