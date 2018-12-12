var song, mic, fft;
var cells, fsl, fval = 0.1;
var cnf;
var pos, dur, perc;
var haveSong;
var statusText, hint;
var fin;
var sel;
var mic_active;
var unit, cx, cy;
var pi = 3.141592;
var polar = 1;

function preload() {
    song = loadSound("samples/off.mp3");
    havesong = 1;
}

function setup() {
    pos = song.currentTime();
    dur = song.duration();
    perc = pos / dur;
    
    setup_sources();
    createP("");
    
    var c = createCanvas(256, 256);
    c.drop(gotFile);
    c.mouseClicked(playPause);
    onResize();

    statusText = createElement("h4", "Ready to go, click/tap the dark box to play overtones");
    hint = createP("The dropdown menu above has more samples to try.");
 
    setup_config();
    setup_fft();

}
function setup_fft(){
    fft = new p5.FFT(fval);
    fft.setInput(song);
}
function setup_config(){
    createElement("h6", "Number of cells to draw");
    cells = createSlider(0, 2048, 1024);
    createSpan("Show more rings/octaves");

    createElement("h6", "FFT Smoothing");
    fsl = createSlider(0, 100, fval * 100);
    createSpan("Lower for more responsive, High for less flicker");
}
function setup_sources(){
    mic_active = 0;

    createSpan("Select Track:");
    sel = createSelect();
    sel.option("off.mp3");
    sel.option("kzk.mp3");
    sel.option("zgr.mp3");
    sel.option("microphone");
    sel.changed(mySelectEvent);
    fin = createFileInput(gotFile);
}

function mySelectEvent() {
    var item = sel.value();
    song.stop();
    if (item != "microphone") {
        mic_active = 0;
        statusText.html("Playing sample: " + item);
        hint.html("You can select files from your device with the \"browse\" button above, or by dragging and dropping the file onto the plot.");
        song = loadSound("samples/" + item);
        fft.setInput(song);
        if (mic.enabled) {
            mic.stop();
        }
    } else {
        mic_active = 1;
        statusText.html("Source = Microphone");
        hint.html("I can't sing overtones either, but you can try wistling. *shrug*");
        mic = new p5.AudioIn();
        mic.start();
        fft.setInput(mic);
    }
}

function playPause() {
    if (song.isPlaying()) {
        song.pause();
    } else if (!mic_active) {
        song.play();
    }
}

function gotFile(file) {
    statusText.html("Playing file: " + file.name);

    song.stop();
    song = loadSound(file);
    song.playMode("restart");

    fft.setInput(song);
}

function onResize(){
    unit = height / 2;
    cx = width / 2;
    cy = height / 2;
}

function draw() {

    playbackMonitor();
    d_progressbar();
    fval = fsl.value() * 0.01;

    background(colorramp(0));
    drawSpectograph();
}
function drawSpectograph(){

    var spectrum = fft.analyze();
    var amount = cells.value() / 2048 * spectrum.length;

    // var cell_width = 0.9;
    // var cell_width = .1;
    var cell_width = 1.0;
    // var cell_depth = 0.99;
    var cell_depth = 1.0;
    // var cell_depth = 1.0;
    var calibration = 9.065;
    var match = calibration / (2* pi);
    var rmin = note(0);
    var rmax = note(spectrum.length)+1;
    var sw = unit /rmax;

    var spec = map(spectrum[0], 0, 255, 0, 1);
    fill(colorramp(spec));
    // var r_null = log(4,2)*match*sw;
    var r_null = 2*match*sw*cell_depth;
    if(polar==1){ellipse(cx, cy, r_null, r_null);}
    else{
        background(colorramp(0));
    }

    // for (i = 1; i < amount; i++) {
    for (n = 0; Math.pow(2,n) < amount; n++)
    for (i = Math.pow(2,n); i < Math.pow(2,n+1)&& i< amount; i++) {
    // for (i = amount; i >= 0; i--) {

        var spec = map(spectrum[i], 0, 255, 0, 1);
        // var cell_depth = spec;

        var freq = i;
        var freq2=freq+0.5;        
        var oct  = 2*pi* (note(freq2-0.5*cell_width));
        var oct2 = 2*pi* (note(freq2+0.5*cell_width));
        
        var an  = (note(freq2-0.5*cell_width));
        var an2 = (note(freq2+0.5*cell_width));
        
        var oct3 = 2*pi* (note(freq2));

       
        var octv = octave(freq2-0.5*cell_width) *match;
        var octv2 = octave(freq2+0.5*cell_width) *match;
        var octv3 = octave(freq2) *match;
        // octv = match*octave(freq);
       // var ratio = height / (2* bmax);
       
        var x = sin(oct);
        var y = cos(oct);
        
        var x2 = sin(oct2);
        var y2 = cos(oct2);
        
        var x3 = sin(oct3);
        var y3 = cos(oct3);
        
        
        var ro = sw*(octv+ cell_depth);
        var ri = sw*(octv );
        
        var ro2 = sw*(octv2+ cell_depth);
        var ri2 = sw*(octv2 );
      
        fill(colorramp(spec));

        var minslices = 4;
        // minslices=16;
        var slice_amt_i = Math.pow(2,n-2)/minslices;
        // var slice_amt_i = i/minslices;
        var slice_amt_o = slice_amt_i *0.5;
        if(slice_amt_o>0.5)slice_amt_o=0.5;

        noStroke();
        // stroke(0);
        if(polar==1){
             beginShape();
        vertexPolar(ro,oct);
            for(slice=slice_amt_o; slice<1.0; slice+=slice_amt_o){
              vertexPolar(lerp(ro,ro2,slice),lerp(oct,oct2,slice));
            }
            vertexPolar(ro2,oct2);
            
            vertexPolar(ri2,oct2);
            for(slice=slice_amt_i; slice<1.0; slice+=slice_amt_i){
              vertexPolar(lerp(ri2,ri,slice),lerp(oct2,oct,slice));
            }
            vertexPolar(ri,oct);
        endShape();
        }
        else {
            var wrap = 0;
            if(i +1 >= Math.pow(2,n+1)){
                wrap =0.5;
            }
        // stroke(0);
            beginShape();
            vertexPolarity(ro,an,n+1,0);
            // for(slice=slice_amt_o; slice<1.0; slice+=slice_amt_o){
            //   vertexPolarity(lerp(ro,ro2,slice),lerp(an,an2,slice),n+1);
            // }
            vertexPolarity(ro2,an2,n+1,wrap);
            
            vertexPolarity(ri2,an2,n,wrap);
            // for(slice=slice_amt_i; slice<1.0; slice+=slice_amt_i){
            //   vertexPolarity(lerp(ri2,ri,slice),lerp(an2,an,slice),n);
            // }
            vertexPolarity(ri,an,n,0);
        endShape();
        }

    }
}
function vertexPolar(radius, angle){
    var x = sin(angle);
    var y = cos(angle);
    vertex(radius*x + width/2, radius*y + height/2);
}
function vertexPolarity(radius,angle, n, wrap){
    angle-=wrap;
    angle%=1.0;
    angle+=wrap
    // angle+=1.0;
    // angle%=1.0;
    // angle%=1.0;
    vertex(angle*width,radius*2);
    // console.log(n);
}
function octave(freq){
    return log(freq, 2);
}
function angle(octave){
    return octave * 2*pi;
}
function note(freq){
    var calibration = 9.065;
    var match = calibration / (2* pi);
    return log(freq, 2) * match;
    // return log(freq, 2) * match;
}
function colorramp(val){
        // from = color(0, 0, 32, 255);
        from = color(32, 32, 128, 255);
        to = color(255, 0, 255, 255);
    
        var spec = val;
        var spec0 = spec;
        spec *= spec * 0.8 + 0.2;
        spec = 2 * spec - 0.8;

        var spec2 = spec * spec;
        var spec3 = 1 - spec;
        spec3 = spec3 * spec3 * spec3;
        var ahr = spec * 3;
        var bee = (spec3 * 3 - 2) * (10 * spec);
        var gee = spec2 * 3 - 0.5;
        
        if (ahr < 0) ahr = 0;
        if (spec < 0) gee = 0;
        
        var color1 = lerpColor(from, to, spec0 * 1);
        var color2 = color(255 * ahr, 255 * gee, 255 * bee);
        return lerpColor(color1, color2, .6);
        // return lerpColor(color1, color2, .3);
}
function playbackMonitor(){
    dur = song.duration();
    if (dur == 0) havesong = 0;

    if (song.isPlaying()) {
        pos = song.currentTime();
        perc = pos / dur;
    } else if (havesong == 0) {
        perc = -1;
        if (dur != 0) {
            havesong = 1;
            if (!song.isPlaying()) {
                song.play();
            }
        }
    }
}
function d_progressbar(){
   if (!(song.isPlaying() && perc == 0)) {
        var bar = document.getElementById("progressbar").children[0]
        bar.style["width"] = perc * 100 + "%";
        if (perc == -1) {
            bar.style["background-color"] = "grey";
        } else {
            bar.style["background-color"] = "orange";
        }
    }
}
function mouseReleased() {
    fft.smooth(fval);
}
function mouseDragged() {
    fft.smooth(fval);
}
function mousePressed() {
}
function keyPressed() {
    switch (keyCode) {
        case 79:
            if(polar==0)polar=1;
            else polar = 0;
            break;
        case 80:
            playPause();
            break;
        case 83:
            if (song.isPlaying()) {
                song.pause();
            }
            break;
    }
}