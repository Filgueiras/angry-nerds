var gamecanvas = $('#game-canvas');
var canvasWidth = gamecanvas.attr('width');
var canvasHeight = gamecanvas.attr('height');
var context2d = gamecanvas.get(0).getContext("2d");

function toRadians(degrees){return degrees * Math.PI / 180;}
function toDegrees(radians){return radians / Math.PI * 180;}

var imageScale = canvasWidth / /*bg width*/ 2211;
var resourcesLoaded = 0;
var backgroundImage = new Image();
backgroundImage.loaded = false;
backgroundImage.onload = function () {
  resourcesLoaded += 1;
};
backgroundImage.src = "img/cenario.png";

var schoolImage = new Image();
schoolImage.onload = function () {
  resourcesLoaded += 1;
  schoolImage.width *= imageScale;
  schoolImage.height *= imageScale;
};
schoolImage.src = "img/escola.png";

var forceImage = new Image();
forceImage.onload = function () {
  resourcesLoaded += 1;
  forceImage.width *= imageScale;
  forceImage.height *= imageScale;
};
forceImage.src = "img/barra_de_forca.png";

var cannonBaseImage = new Image();
cannonBaseImage.onload = function () {
  resourcesLoaded += 1;
  cannonBaseImage.width *= imageScale;
  cannonBaseImage.height *= imageScale;
};
cannonBaseImage.src = "img/suporte_canhao.png";

var cannon = {
    imgPath: "img/canhao.png",
    img: new Image(),
    angle: toRadians(-25),
    pivot: {
      x: 0,
      y: 0
    },
    x: 150,
    y: 600,
    load: function(){
      var parent = this;
      this.img.onload = function() {
        resourcesLoaded += 1;
        this.width *= imageScale;
        this.height *= imageScale;
        parent.pivot.x = this.width*0.333;
        parent.pivot.y = this.height*0.5;
      };
      this.img.src = this.imgPath;
    },
    draw: function () {
      context2d.save();
      context2d.setTransform(1, 0, 0, 1, 0, 0);
      context2d.translate(this.x+this.pivot.x, this.y+this.pivot.y);
      var rad = this.angle;
      context2d.rotate(rad);
      context2d.drawImage(this.img, -this.pivot.x, -this.pivot.y,
                          this.img.width, this.img.height);
      context2d.restore();
    }
};
cannon.load();

var forceArrow = {
  imgPath: "img/seta_forca.png",
    img: new Image(),
    x: 50,
    y: canvasHeight * 0.5,
    maxY: 0,
    minY: 0,
    force: 0,
    signal: 1,
    active: false,
    load: function(){
      this.img.onload = function() {
        resourcesLoaded += 1;
        this.width *= imageScale;
        this.height *= imageScale;
      };
      this.img.src = this.imgPath;
    },
    draw: function () {
      if (this.maxY == 0 || this.minY == 0) {
        this.minY = 10+canvasHeight*0.5-forceImage.height*0.5;
        this.maxY = this.minY + forceImage.height-10;
      }
      this.y = this.maxY - (this.maxY - this.minY) * this.force;
      context2d.drawImage(this.img, this.x, this.y-this.img.height*0.5,
                          this.img.width, this.img.height);
    },
    update: function (deltaMillis) {
      if(this.active){
        this.force += deltaMillis/1000 * this.signal;
        if (this.force >= 1 && this.signal > 0){
          this.force = 1;
          this.signal *= -1;
        } else if (this.force <= 0 && this.signal < 0) {
          this.force = 0;
          this.signal *= -1;
        }
      } else {
        this.force = 0;
        this.signal = 1;
      }
    }
};
forceArrow.load();

var mouse = {
  x: 0,
  y: 0
};

document.onmousemove = function(e){
    mouse.x = e.pageX;
    mouse.y = e.pageY;
    cannon.angle = Math.max(toRadians(-90) , Math.min(Math.atan2(mouse.y-(cannon.y+cannon.pivot.y), mouse.x-(cannon.x+cannon.pivot.x)), 0));
}

document.onmousedown = function(e){
    if(e.button == 0){
      forceArrow.active = true;
    }
}

document.onmouseup = function(e){
    if(e.button == 0){
      forceArrow.active = false;
    }
}

var alfredo = {
  imgPath: "img/alfredo.png",
  x: 0,
  y: 0,
};

var lastMillis = new Date().getTime()
function update() {
  var currentMillis = new Date().getTime();
  var deltaMillis = currentMillis - lastMillis;
  lastMillis = currentMillis;

  if(resourcesLoaded >= 6) {
    context2d.drawImage(backgroundImage, 0, 0, canvasWidth, canvasHeight);
    context2d.drawImage(schoolImage, canvasWidth-schoolImage.width, canvasHeight-schoolImage.height,
                        schoolImage.width, schoolImage.height);
    context2d.drawImage(forceImage, 20, canvasHeight*0.5-forceImage.height*0.5,
                        forceImage.width, forceImage.height);
    cannon.draw();
    context2d.drawImage(cannonBaseImage, 160, 620,
                        cannonBaseImage.width, cannonBaseImage.height);
    forceArrow.update(deltaMillis);
    forceArrow.draw();
  }
  else {
    context2d.clearRect(0, 0, canvasWidth, canvasHeight);
    context2d.font = "32px Helvetica bold"
    context2d.textBaseline = "middle";
    context2d.textAlign = "center";
    context2d.fillText("Carregando...", canvasWidth*0.5, canvasHeight*0.5);
  }

}

var loopInterval = setInterval(update, 33);
