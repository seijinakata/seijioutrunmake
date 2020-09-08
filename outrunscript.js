const SCREEN_W = 1024;
const SCREEN_H = 768;

let can = document.getElementById("can");
can.width = SCREEN_W;
can.height = SCREEN_H;
let con = can.getContext("2d");

const PART_L = 300;
const STEP_L = 300;
const CAMERA_D = 0.8;
const ROAD_W = 2000;
const ROADMAX = 5600;
const CAMERADISTANCE = 300;
const MAXLAP = 2;

let camH = 2000;
let accel = 0;

let starttime = new Date();
let steptime = 0;
let playsecond = 0;
let playminites = 0;
let playhour = 0;
let lap = 1;

let totaltime = [];
for (let i=0;i<1;i++){
	let part = {};
	part.hour = 0;
	part.minites = 0;
	part.second = 0;
	totaltime.push(part);
}

let centerx =SCREEN_W/2;
let centery =SCREEN_H-1;
let camera = {};
	camera.x = 0;
	camera.y = 0;
	camera.z = 0;

let cameraoffsetx = 0;
let cameraoffsety = 0;
let cameraoffsetz = 0;

let road = [];
let x=0,dx=0

for(let i = 0; i < ROADMAX; i++){
	  //最初と終わり合わせる必要があるcameradistance*2
	  let part = {};
	  part.x = 0;
	  part.y = 0;
	  part.z = i * PART_L;
	  part.curve = 0;
	  part.curvex = 0;
	  //first
	  if(i>CAMERADISTANCE && i<CAMERADISTANCE + 400){
	  part.curve = 0.8;
	  }
	  
	  //second
	  if(i>CAMERADISTANCE+640  && i< CAMERADISTANCE+1020){
 		 part.y = Math.sin(i/30.0)*1500;
	  }
	 
	  if(i>CAMERADISTANCE+1200 && i<CAMERADISTANCE+1600){
		  part.curve = 0.8;
	  }
	  //third
	  if (i>CAMERADISTANCE+1800 && i<=CAMERADISTANCE+2100){
		  dx += 0.8;
		  x += dx;
		  part.x = x;
		  if(i>=CAMERADISTANCE+2100){
			  dx=0;
		  }
	  }
	  if (i>CAMERADISTANCE+2100 && i<=CAMERADISTANCE+2400){
		  dx -= 0.8;
		  x += dx;
		  part.x = x;
		  if(i>=CAMERADISTANCE+2400){
		  	x = 0;
		  	dx = 0;
		  }
	   }
	  if (i>CAMERADISTANCE+2500 && i<=CAMERADISTANCE+2800){
		  dx -= 0.8;
		  x += dx;
		  part.x = x;
		  if(i>=CAMERADISTANCE+2800){
			  dx=0;
		  }
	  }
	  if (i>CAMERADISTANCE+2800 && i<=CAMERADISTANCE+3100){
		  dx += 0.8;
		  x += dx;
		  part.x = x;
		  if(i>=CAMERADISTANCE+3100){
		  	x = 0;
		  	dx = 0;
		  }
	   }
	  if(i>CAMERADISTANCE+3200 && i<CAMERADISTANCE+3600){
		  part.curve = 0.8;
	  }
	  //four
	  if(i>CAMERADISTANCE+3660  && i< CAMERADISTANCE+4410){
 		 part.y = Math.sin(i/30.0)*1500;
	  }
	  if (i>CAMERADISTANCE+3660 && i<=CAMERADISTANCE+4035){
		  dx += 0.7;
		  x += dx;
		  part.x = x;
		  if(i>=CAMERADISTANCE+4035){
			  dx=0;
		  }
	  }
	  if (i>CAMERADISTANCE+4035 && i<=CAMERADISTANCE+4410){
		  dx -= 0.7;
		  x += dx;
		  part.x = x;
		  if(i>=CAMERADISTANCE+4410){
		  	x = 0;
		  	dx = 0;
		  }
	  }
	  if(i>CAMERADISTANCE+4500 && i<CAMERADISTANCE+4900){
		  part.curve = 0.8;
	  }
		  part.treex = x + 6000;
		  part.grassx = x - 6000;
	  road.push(part);
}
// Image オブジェクトを生成
var backgroundimg = new Image();
backgroundimg.src = 'bg.png';
var treeimg = new Image();
treeimg.src = '5.png';
var grassimg = new Image();
grassimg.src = '6.png';

function drawRoad(col,mx,my,mw,px,py,pw){
	 con.fillStyle = col;
	 con.beginPath();
	 con.moveTo(mx-mw,my);
	 con.lineTo(px-pw,py);
	 con.lineTo(px+pw,py);
	 con.lineTo(mx+mw,my);
	 con.closePath();
	 con.fill();

}
let culx;
let culy;
let culw;
let scale
let treex;
let grassx;
function project(object,currentpoint,camera,curvex){
	  let r = object[currentpoint%ROADMAX];
	  let dist = r.z - camera.z;
	  if (dist<=0) return false;
	  scale = CAMERA_D / dist;

	  culx = (1 + (r.x - camera.x-curvex) * scale) * SCREEN_W / 2;
	  culy = (1 - (r.y - camera.y) * scale) * SCREEN_H / 2;
	  treex = (1 + (r.treex - camera.x-curvex) * scale) * SCREEN_W / 2;
	  grassx = (1 + (r.grassx - camera.x-curvex) * scale) * SCREEN_W / 2;
	  culw = ROAD_W * scale * SCREEN_W;
	  culx = Math.floor(culx);
	  culy = Math.floor(culy);
	  culw = Math.floor(culw);
	//document.write("px1 = " + py);
}

function drawTexture(img,mx,my,scaleX,scaleY){
	con.drawImage(img, mx-(img.width+scaleX)*scale * SCREEN_W/2, my-(img.height+scaleY)*scale*SCREEN_H,
	(img.width+scaleX)*scale * SCREEN_W,(img.height+scaleY)*scale*SCREEN_H);
}
pressedKeys = [];

onkeydown = function(e){
	switch(e.keyCode){

		case 37://左
			pressedKeys[0] = true;
		break;
		case 38://上
			pressedKeys[1] = true;
		break;
		case 39://右
			pressedKeys[3] = true;
		break;
		case 40://下
			pressedKeys[5] = true;
		break;
		case 85://up
			pressedKeys[7] = true;
		break;
		case 68://down
			pressedKeys[8] = true;
		break;
		case 65://A
			pressedKeys[9] = true;
		break;
	}
}
onkeyup = function(e){
	switch(e.keyCode){
		case 37://左
			pressedKeys[0] = false;
		break;
		case 38://上
			pressedKeys[1] = false;
		break;
		case 39://右
			pressedKeys[3] = false;
		break;
		case 40://下
			pressedKeys[5] = false;
		break;
		case 85://up
			pressedKeys[7] = false;
		break;
		case 68://down
			pressedKeys[8] = false;
		break;
		case 65://A
			pressedKeys[9] = false;
		break;
	}
}
function playermove(){
	//左
	if(pressedKeys[0]){
		cameraoffsetx -= STEP_L;
	}
	//上
	if(pressedKeys[1]){
		cameraoffsetz += STEP_L;
	}
	//右
	if(pressedKeys[3]){
		cameraoffsetx += STEP_L;
	}
	//下
	if(pressedKeys[5]){
		cameraoffsetz -= STEP_L;
	}
	//up
	if(pressedKeys[7]){
		camH += STEP_L;
	}
	//down
	if(pressedKeys[8]){
		camH -= STEP_L;
	}
	//A
	if(pressedKeys[9]){
		accel += 1;
		if(accel >= 200){
			accel = 200;
		}
	}
}

let gameoverflag = false;
let precameraz = 0;

function mainLoop(){
	con.clearRect(0,0,SCREEN_W,SCREEN_H);
    con.drawImage(backgroundimg, 0, 0,SCREEN_W,SCREEN_H/1.9);
    displaycurrenttime()
    displaytotaltime();
    displaylap();
    //console.log(accel);

    //奥には行けないで戻る
    if(camera.z+CAMERADISTANCE*PART_L >= ROADMAX*PART_L){
    	let overstep = camera.z+CAMERADISTANCE*PART_L - ROADMAX*PART_L;
    	camera.z = 0 + overstep;
    	totaltime[0].second += playsecond;
    	if(totaltime[0].second >= 60){
    		totaltime[0].minites += 1;
    		totaltime[0].second -= 60;
    	}
    	playsecond =0;
    	totaltime[0].minites += playminites;
    	if(totaltime[0].minites >= 60){
    		totaltime[0].hour += 1;
    		totaltime[0].minites -= 60;
    	}
    	playminites =0;
    	totaltime[0].hour += playhour;
    	starttime = new Date();
    	if(lap <MAXLAP){
    		lap += 1;
    	}else{
    		gameoverflag = true;
    	}
    }
    //後ろに行けないようにする。
    if(camera.z<=0){
    	camera.z = 0;
    }
    //後ろに行きたい場合
    //  if(camera.z<0){
    //	camera.z = ROADMAX*PART_L-CAMERADISTANCE*PART_L;
    //}
	let start = (camera.z+CAMERADISTANCE*PART_L)/PART_L;
	let end = camera.z/PART_L;
	//小数点を丸める。速さを自由にするため。
	let floorend = Math.floor(end);
	let floorstart = Math.floor(start);
	let curvedx = 0;
	let curvex =0;
	let curve = [];
	for(let i=0;i<CAMERADISTANCE;i++){
		curvedx += road[floorend+i].curve;
		curvex += curvedx;
		curve.push(curvex);
	}
	//前の当たり判定のみの作画
	camera.y = camH + road[floorend].y;
	project(road,floorstart,camera,curve[CAMERADISTANCE]);
	let mx = culx;
	let my = culy;
	let mw = culw;
	//奥から作画する方針のためこれ要らない。let maxy = my;
	let curvei = CAMERADISTANCE;
	for(let i = floorstart-1; i > 1; i--){
	  curvei -= 1;
	  let ispaint = project(road,i,camera,curve[curvei]);
	  let px = culx;
	  let py = culy;
	  let pw = culw;
	  //distが０より下ならこれ以上作画要らないから切る。後ろはいらない。
	  if(ispaint === false) break;
	  let roadcollor = "rgb(107,107,107)";
	  drawRoad(roadcollor,mx,my,mw,px,py,pw);
	  mx = px;
	  my = py;
	  mw = pw;
	}
	//色で当たり判定
	let caraisroad = true;
	let nextcenterx = centerx;
	let nextcentery = centery;
	var imagedata = con.getImageData(nextcenterx,nextcentery, 1, 1);

     // RGBAの取得。
        var r = imagedata.data[0];
        var g = imagedata.data[1];
        var b = imagedata.data[2];
        var a = imagedata.data[3];

	if(((r != 107) && (g != 107) && (b != 107))){
		caraisroad = false;
	}

	if(caraisroad == false){
		camera.z  = precameraz;
	}
	
	//acceldown
    if(pressedKeys[9] == false){
    accel -= 1;
	    if(accel <= 0){
	    	accel = 0;
	    }
    }
    //次の上の道路作画で道路を出たら元に戻すため保存
	precameraz = camera.z;
	playermove();
	
	//上書き本当の作画
	project(road,floorstart,camera,curve[CAMERADISTANCE]);
	mx = culx;
	my = culy;
	mw = culw;
	//奥から作画する方針のためこれ要らない。let maxy = my;
	curvei = CAMERADISTANCE;
	for(let i = floorstart-1; i > 1; i--){
	  curvei -= 1;
	  let ispaint = project(road,i,camera,curve[curvei]);
	  let px = culx;
	  let py = culy;
	  let pw = culw;
	  let projecttreex = treex;
	  let projectgrassx = grassx;
	  //distが０より下ならこれ以上作画要らないから切る。後ろはいらない。
	  if(ispaint === false) break;
	  if(i%15 == 0){
	    drawTexture(treeimg,projecttreex,my,1000,1000);
	    drawTexture(grassimg,projectgrassx,my,500,500);
	  }
	  let grass = (i%2)?"rgb(16,200,16)":"rgb(0,154,0)";
	  let rumble = (i%2)?"rgb(255,255,255)":"rgb(0,0,0)";
	  let roadcollor = (i%2)?"rgb(107,107,107)":"rgb(105,105,105)";
	  drawRoad(grass,0,my,SCREEN_W,0,py,SCREEN_W);
	  drawRoad(rumble,mx,my,mw*1.2,px,py,pw*1.2);
	  drawRoad(roadcollor,mx,my,mw,px,py,pw);
	  mx = px;
	  my = py;
	  mw = pw;
	}
	//色で当たり判定
	nextcenterx = centerx + cameraoffsetx;
	nextcentery = centery;
	imagedata = con.getImageData(nextcenterx,nextcentery, 1, 1);

     // RGBAの取得。
        r = imagedata.data[0];
        g = imagedata.data[1];
        b = imagedata.data[2];
        a = imagedata.data[3];
        	//console.log("r="+r+"g="+g+"b="+b);

	if(((r != 107) && (g != 107) && (b != 107)) && ((r != 105) && (g != 105) && (b != 105))){
		caraisroad = false;
	}
	if(gameoverflag == false){
		if(caraisroad == true){
			camera.x += cameraoffsetx;
			camera.y += cameraoffsety;
			camera.z += cameraoffsetz + accel;
		}
	}
	cameraoffsetx = 0;
	cameraoffsety = 0;
	cameraoffsetz = 0;
}
setInterval(mainLoop,1000/60);

//time
function displaycurrenttime() {
	document.getElementById("view_time").innerHTML = getNow();
}
function getNow() {
	steptime = new Date();
	// 経過時間をミリ秒で取得
	let time = steptime.getTime() - starttime.getTime();
	playsecond = Math.floor(time / 1000);
	if(playsecond >= 60){
		playminites += 1;
		playsecond = 0;
		starttime = new Date();
	}
	if(playminites >= 60){
		playhour += 1;
		playminites = 0;
	}

	//出力用
	var s = "TIME<br>"+playhour + "時" + playminites +  "分" + playsecond + "秒"; 
	return s;
}
//totaltime
function displaytotaltime() {
	document.getElementById("total_time").innerHTML = gettotaltime();
}
function gettotaltime(){
	//出力用
	var s = "TOTALTIME<br>"+ totaltime[0].hour + "時" + totaltime[0].minites +  "分" + totaltime[0].second + "秒"; 
	return s;
}
//lap
function displaylap() {
	document.getElementById("html_lap").innerHTML = getlap();
}
function getlap(){
	//出力用
	var s = "LAP" + "<br>" + lap + "/" + MAXLAP + "<br>"; 
	return s;
}