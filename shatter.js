var song, mic, fft;
var slider, fsl, fval;
var cnf;
var pos, dur, perc;
var haveSong;
var filename, hint;
var fin;
var sel;
var mactive;
//var button;

function preload(){
    song = loadSound("samples/off.mp3");
}

function setup() {
   mactive = 0;
   pos = song.currentTime();
   dur = song.duration();
   perc = pos/dur;
   havesong=1;
   createSpan("Select Track:");
   sel = createSelect();
   sel.option("kzk.mp3");
   sel.option("zgr.mp3");
   sel.option("off.mp3");
   // sel.option("atp.mp3");
   // sel.option("atp_instrumental.mp3");
   // sel.option("atp_vocals.mp3");
   // sel.option("The Next Day-Sings'N'Things.mp3");
   sel.option("microphone");
   sel.changed(mySelectEvent);
   fin = createFileInput(gotFile);
//   filename = createSpan("Playing Demo");
   //filename.position("max","max");
   createP("");
   var c = createCanvas(256,256);
   c.drop(gotFile);
   c.mouseClicked(playPause);
   noFill();
   //song.play();
   //song.loop();
   fval =0.1;
   fft = new p5.FFT(fval);
   fft.setInput(song);
//   button = createButton("Play/Pause",0);
  // button.size(200,50);
   //button.mousePressed(playPause);
   filename=createElement("h4","Ready to go, click/tap the dark box to play overtones");
   hint = createP("The dropdown menu above has more samples to try.");
   createElement("h6","Number of cells to draw");
   slider = createSlider(0,2048,512);
   createSpan("Show more rings/octaves");
   //createP("");
   createElement("h6","FFT Smoothing");
   fsl = createSlider (0, 100, fval*100);
   createSpan("Lower for more responsive, High for less flicker");
   fval = fsl.value()*0.01;
//   createFileInput(gotFile);
}
function mySelectEvent(){
   var item = sel.value();
   song.stop();
   if(item!="microphone"){
     mactive = 0;
     filename.html("Playing sample: "+item);
     hint.html("You can select files from your device with the \"browse\" button above, or by dragging and dropping the file onto the plot.");
     song=loadSound("samples/"+item);
     fft.setInput(song);
     if(mic.enabled){
        mic.stop();
     }
   }
   else{
     mactive = 1;
      filename.html("Source = Microphone");
      hint.html("I can't sing overtones either, but you can try wistling. *shrug*");
        mic = new p5.AudioIn();
     mic.start();
     fft.setInput(mic);
   }
}
function playPause(){
   if(song.isPlaying()){
   song.pause();
   }
   else if(!mactive){
   song.play();
   }
}
function gotFile(file){
//fin.remove();
filename.html("Playing file: "+file.name);
//console.log(file.name);

	song.stop();
	song= loadSound(file);
        song.playMode("restart");

    fft.setInput(song);
//	song.loop();
    //fsl.remove();
    //fsl = createSlider (0, 100, 8);
}

function draw() {
  dur = song.duration();
  if (dur==0) havesong = 0;

  if(song.isPlaying()){
    pos = song.currentTime();
    perc = pos/dur;
    //if(dur != 0){
    //  havesong = 1;
    //  if(!song.isPlaying()){
    //  song.play();
    //  }
    //}
  }
  else if(havesong ==0 ){
    perc = -1;
    if(dur!=0){
      havesong = 1;
      if(!song.isPlaying()){
        song.play();
      }
    }
  }

  //console.log("ct"+song.currentTime());
  //console.log("time-"+pos+" of "+ dur);
  //console.log(perc);
      fval = fsl.value()*0.01;
   background(0);
   //background(color("#202026"));
   //background(255,255,255);
   var spectrum = fft.analyze();
   var unit = height/4;
     var cx = width/2;
     var cy= height/2;
    var cov = 0.9;
    var cov2 =0.99;
  from = color(0, 0, 32, 255);
  to = color(255, 0, 255, 255);
  var invis = color (127,0,127,0);
  var step = 3.1415/4;
  var scv=9.05;
  //fill(255,255,255);
  //ellipse(cx,cy, 460, 460);
  //stroke(0);
//  beginShape();
 // vertex(0+cx,0+cy);
  //vertex(sin(step)*unit+cx,cos(step)*unit+cy);
  //endShape();
  // beginShape();
  var amount = slider.value()/2048*spectrum.length;
  for (i = 0; i<amount; i++) {
  // for (i = 0; i<100; i++) {
//     var mag= map(spectrum[i], 0, 255, 0, 1);
     var prog = i / spectrum.length;
     var oct = log(i,2)*scv;
     var octv = oct/(2*3.1415);
     var octmax = log(spectrum.length,2)*scv;
     var octvmax = octmax/(2*3.1415);
     var x = sin(oct);
     var y = cos(oct);
     var oct2 = log(i+cov,2)*scv;
     var x2 = sin(oct2);
     var y2 = cos(oct2);
     var oct3 = log(i+cov*0.5,2)*scv;
     var x3 = sin(oct3);
     var y3 = cos(oct3);
     var sw = unit/8;
     var bmax=(octvmax);
     var ratio = 2*unit/bmax;
     var b1=(octv)*ratio;
     var b2=(octv-cov2)*ratio;
     var b3=(octv-0.1)*ratio;
     var b4=(octv-0.1-cov2)*ratio;
     var spec = map(spectrum[i], 0, 255, 0, 1);
     //spec = map(i, 0, amount,0,1); 
     var spec0 = spec;
     spec*=spec*0.8 + 0.2;
     spec=2*spec-0.8;
     var mag= map(spec, 0, 1, b1, b2);
     //spec += 0.1;
     var spec2=spec*spec;
     var spec3=1-spec;
      spec3=spec3*spec3*spec3;
     var ahr=spec*3;
      //ahr =0;
     var bee=(spec3*3-2)*(10*spec);
     var gee=spec2*3-0.5;
     //gee = 0;
     if (ahr < 0) ahr = 0;
     if (spec < 0) gee = 0;
     //spec -= 0.01;
      c = lerpColor(from, to, spec0*1);
      	noStroke();
     var d = color(255*ahr, 255*gee, 255*bee);
     c = lerpColor(c,d,.6);
     fill(c);
     beginShape();
    vertex(b1*x+width/2, b1*y+height/2);
    vertex(b2*x+width/2, b2*y+height/2);
    vertex(b2*x2+width/2, b2*y2+height/2);
    vertex(b1*x2+width/2, b1*y2+height/2);
    vertex(b1*x3+width/2, b1*y3+height/2);
     endShape();
   }
  // endShape();
//  var prog = 100* song.currentTime()/song.duration();
  if(!(song.isPlaying() && perc==0)){
    var bar = document.getElementById("progressbar").children[0]
    bar.style["width"]=perc*100+"%";
    if(perc == -1){
      bar.style["background-color"]="grey";
    }
    else{
      bar.style["background-color"]="orange";
    }
  }
}
function mouseReleased(){
   fft.smooth(fval);
}
function mouseDragged(){
   //fft = new p5.FFT(fval);
   fft.smooth(fval);
}
function mousePressed() {
//  active =1;
//    if(button){
  //    playPause();
    //}
    if ( song.isPlaying() ) { // .isPlaying() returns a boolean
//    song.pause(); // .play() will resume from .pause() position
//    // background(255,0,0);
    }
    else {
//    song.play();
//    // background(0,255,0);
    }
}
function keyPressed() {
  switch (keyCode) {
    case 80:
      playPause();
      break;
    case 83:
      if(song.isPlaying()){
        song.pause();
      }
      break
   }
}
