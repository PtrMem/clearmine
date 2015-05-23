//set the game images
var imgbase='imgs/';
var boom="boom.jpg";
var win="win.jpg";
var fault="fault.jpg";
var mark="mark.jpg";
var allboom="allboom.jpg";
//game default modes
var easy=new MapInfo(9,9,10,"easy");
var normal=new MapInfo(16,16,40,"normal");
var hard=new MapInfo(16,30,99,"hard");
//default mode 9x9 grids 10 mines
var game=new ClearMine(cloneObj(easy));
//hold the map information copy
var pyingMapIf=cloneObj(game.map.info);
game.createBgData(game.map.info);
game.createFrontEnd(game.map.info);
game.listenplayer();