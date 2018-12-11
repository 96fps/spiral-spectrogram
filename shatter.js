var song, spin, fft;

function preload(){
    song = loadSound('kzk.mp3');
}

function setup() {
   spin=0;
   var c = createCanvas(512,512);
   c.drop(gotFile);
   noFill();
   song.loop();
   fft = new p5.FFT();
   fft.setInput(song);
}

function gotFile(file){
	song.pause();   
	song= loadSound(file);
    fft = new p5.FFT();
    fft.setInput(song);
	song.loop();
}

function draw() {
   background(0);
   if(song.isPlaying()){
	spin-=0.01;
   }
   var spectrum = fft.analyze();
     var unit = height/4;
     var cx = width/2;
     var cy= height/2;
   var cov = 0.9;
    var cov2 =0.99;
  from = color(0, 0, 32, 32);
  to = color(255, 0, 255, 255);
  var invis = color (127,0,127,0);
  var step = 3.1415/4;
  var scv=9.05;
  stroke(0);
  beginShape();
  vertex(0+cx,0+cy);
  vertex(sin(step)*unit+cx,cos(step)*unit+cy);
  endShape();
  // beginShape();
  for (i = 0; i<spectrum.length; i++) {
  // for (i = 0; i<100; i++) {
//     var mag= map(spectrum[i], 0, 255, 0, 1);
     var prog = i / spectrum.length;
     var oct = log(i,2)*scv;
     var octv = oct/(2*3.1415);
     var octmax = log(spectrum.length,2)*scv;
     var octvmax = octmax/(2*3.1415);
     var x = sin(oct+spin);
     var y = cos(oct+spin);
     var oct2 = log(i+cov,2)*scv;
     var x2 = sin(oct2+spin);
     var y2 = cos(oct2+spin);
     var oct3 = log(i+cov*0.5,2)*scv;
     var x3 = sin(oct3+spin);
     var y3 = cos(oct3+spin);
     var sw = unit/8;
     var bmax=(octvmax);
     var ratio = 2*unit/bmax;
     var b1=(octv)*ratio;
     var b2=(octv-cov2)*ratio;
     var b3=(octv-0.1)*ratio;
     var b4=(octv-0.1-cov2)*ratio;
     var spec = map(spectrum[i], 0, 255, 0, 1);
     var mag= map(spec, 0, 1, b1, b2);
      c = lerpColor(from, to, spec*1);
      	stroke(color(32,16,64,32));
     fill(c);
     beginShape();
    vertex(b1*x+width/2, b1*y+height/2);
    vertex(b2*x+width/2, b2*y+height/2);
    vertex(b2*x2+width/2, b2*y2+height/2);
    vertex(b1*x2+width/2, b1*y2+height/2);
    vertex(b1*x3+width/2, b1*y3+height/2);
     endShape();
    beginShape();
    vertex(b3*x+width/2, b3*y+height/2);
    vertex(b4*x+width/2, b4*y+height/2);
    vertex(b4*x2+width/2, b4*y2+height/2);
    vertex(b3*x2+width/2, b3*y2+height/2);
    vertex(b3*x3+width/2, b3*y3+height/2);
    endShape();
   }
  // endShape();
}

function mousePressed() {
  if ( song.isPlaying() ) { // .isPlaying() returns a boolean
    song.pause(); // .play() will resume from .pause() position
    // background(255,0,0);
  } else {
    song.play();
    // background(0,255,0);
  }
}