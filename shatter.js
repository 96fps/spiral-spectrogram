var song, mic, fft;

function setup() {
   createCanvas(512,512);
   noFill();
   song = loadSound('zgr.mp3');
  
   mic = new p5.AudioIn();
   mic.start();
   fft = new p5.FFT(0.3);
   fft.setInput(mic);
}

function draw() {
   background(0);

   var spectrum = fft.analyze();
     var unit = height/4;
     var cx = width/2;
     var cy= height/2;
  from = color(0, 0, 0, 255);
  to = color(127, 0, 255, 255);
  var step = 3.1415/4;
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
     var oct = log(i,2)*9.0;
     var octv = oct/(2*3.1415);
     var octmax = log(spectrum.length,2)*9.0;
     var octvmax = octmax/(2*3.1415);
     
     var x = sin(oct);
     var y = cos(oct);
     var oct2 = log(i+1,2)*9.0;
     var x2 = sin(oct2);
     var y2 = cos(oct2);
     var sw = unit/8;
     var bmax=(octvmax);
     var ratio = 2*unit/bmax;
     
     var b1=(octv)*ratio;
     var b2=(octv-1)*ratio;
     var spec = map(spectrum[i], 0, 255, 0, 1);
     var mag= map(spec, 0, 1, b1, b2);
     
      c = lerpColor(from, to, spec);
      stroke(c);
     fill(c);
     beginShape();
    vertex(b1*x+width/2, b1*y+height/2);
    vertex(b2*x+width/2, b2*y+height/2);
    vertex(b2*x2+width/2, b2*y2+height/2);
    vertex(b1*x2+width/2, b1*y2+height/2);
     endShape();
   }
  // endShape();
}

function mousePressed() {
  if ( song.isPlaying() ) { // .isPlaying() returns a boolean
    song.pause(); // .play() will resume from .pause() position
    // background(255,0,0);
   fft = new p5.FFT();
   fft.setInput(mic);
  } else {
    song.play();
    // background(0,255,0);
   fft = new p5.FFT();
   fft.setInput(song);
  }
}

