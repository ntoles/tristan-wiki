const pairing_s = (sketch) => {
  var easeInOutQuad = function (t, start_t, end_t) {
    elapsed_t = t - start_t;
    total_t = end_t - start_t;
    if (elapsed_t < 0) {
      return 0;
    } else if (elapsed_t > total_t) {
      return 1;
    } else if ((elapsed_t /= total_t / 2) < 1) {
      return 0.5 * elapsed_t * elapsed_t;
    } else {
      return -0.5 * ((--elapsed_t) * (elapsed_t - 2) - 1);
    }
  };

  class Point {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
  }

  class Particle {
    constructor(initpoint, size, color) {
      this.size = size;
      this.color = color;
      this.position = initpoint;
      this.old_position = this.position;
    }
    draw() {
      sketch.fill(this.color);
      sketch.noStroke();
      sketch.circle(this.position.x, this.position.y, this.size);
    }
    moveParticle(t, to, start_t, end_t) {
      if ((t >= start_t) && (t < end_t)) {
        let ease = easeInOutQuad(t, start_t, end_t);
        let from = this.old_position;
        let x_new = from.x + (to.x - from.x) * ease;
        let y_new = from.y + (to.y - from.y) * ease;
        this.position = new Point(x_new, y_new);
        if (ease > 0.999) {
          // finish animation
          this.old_position = this.position;
        }
      }
    }
    appear(t, start_t, end_t) {
      if ((t >= start_t) && (t < end_t)) {
        this.draw();
      }
    }
  }

  class Text {
    constructor(text, position, size, color = 0, alignX = sketch.CENTER, alignY = sketch.CENTER) {
      this.text = text;
      this.position = position;
      this.size = size;
      this.color = color;
      this.alignX = alignX;
      this.alignY = alignY;
    }
    write(opacity = 1.0) {
      sketch.textSize(this.size);
      opacity = sketch.int(opacity * 255);
      this.color.setAlpha(opacity);
      sketch.fill(this.color);
      sketch.noStroke();
      sketch.textAlign(this.alignX, this.alignY);
      sketch.text(this.text, this.position.x, this.position.y);
    }
    appear(text, t, start_t, end_t, fade_t = 0, new_pos = null) {
      this.text = text;
      let alpha;
      if ((t >= start_t) && (t < end_t)) {
        if (new_pos !== null) {
          this.position = new_pos;
        }
        if (t < start_t + fade_t) {
          alpha = (t - start_t) / fade_t;
        } else if (t >= end_t - fade_t) {
          alpha = 1 - (t - end_t + fade_t) / fade_t;
        } else {
          alpha = 1;
        }
        this.write(alpha);
      }
    }
  }

  var frate = 30;
  var global_t = 0, global_dt = 1 / frate;

  var TIMER;

  var text_1, text_1;

  var title;

  var prtl1, prtl2;

  var prtls_1, prtls_2;
  var shuffle_1 = [5, 1, 7, 6, 3, 2, 4];
  var shuffle_2 = [9, 3, 6, 8, 5, 7, 2, 4, 1];
  var connections;

  var sizeX = 400, sizeY = 400;

  var delY = 30;

  sketch.setup = () => {
    var canvasDiv = document.getElementById('sketch-div');
    var width = canvasDiv.clientWidth;
    if (width < 400) {
      sizeX = width; sizeY = sizeX;
      delY = 30 * sizeX / 400.0;
    }
    
    var canvas = sketch.createCanvas(sizeX, sizeY);
    canvas.parent('sketch-div');
    sketch.frameRate(frate);
    sketch.textFont('monospace');
    reset();
  }

  function reset() {
    let LEFT_PRTL_COLOR = sketch.color('red'), RIGHT_PRTL_COLOR = sketch.color('blue');
    let LEFT_PRTL_SIZE_LG = 20, RIGHT_PRTL_SIZE_LG = 20;
    let LEFT_PRTL_SIZE_SM = 15, RIGHT_PRTL_SIZE_SM = 15;

    prtls_1 = []; prtls_2 = [];
    connections = [];

    prtl1 = new Particle(new Point(sizeX * 0.25, sizeY * 0.5), LEFT_PRTL_SIZE_LG, LEFT_PRTL_COLOR);
    prtl2 = new Particle(new Point(sizeX * 0.75, sizeY * 0.5), RIGHT_PRTL_SIZE_LG, RIGHT_PRTL_COLOR);

    TIMER = new Text('', new Point(sizeX * 0.5, sizeY - 40), 30, sketch.color('black'));
    text_1 = new Text('', new Point(40, sizeY * 0.5), 15, sketch.color('black'));
    text_2 = new Text('', new Point(sizeX - 40, sizeY * 0.5), 15, sketch.color('black'));

    title = new Text('', new Point(sizeX * 0.5, 40), 20, sketch.color('black'));

    for (let i = -3; i <= 3; ++i) {
      prtls_1.push(new Particle(new Point(sizeX * 0.25, sizeY * 0.5), LEFT_PRTL_SIZE_SM, LEFT_PRTL_COLOR));
    }
    for (let i = -3; i <= 5; ++i) {
      prtls_2.push(new Particle(new Point(sizeX * 0.75, sizeY * 0.5), RIGHT_PRTL_SIZE_SM, RIGHT_PRTL_COLOR));
    }
    for (let i = -3; i <= 3; ++i) {
      connections.push(new Text('', new Point(sizeX * 0.5, sizeY * 0.5 + i * delY), 15, sketch.color('black')));
    }
  }


  sketch.draw = () => {
    sketch.background(sketch.color('#f2f2f2'));

    sketch.noFill();
    sketch.stroke(sketch.color('black'));
    // rect(0, 0, sizeX, sizeY);
    prtl1.appear(global_t, 0, 2);
    prtl2.appear(global_t, 0, 2);

    // particle mover
    //prtl1.moveParticle(global_t, new Point(10, 10), 2, 5);
    //prtl1.moveParticle(global_t, new Point(250, 170), 7, 12);

    text_1.appear('w1', global_t, 0, 2, 0.5);
    text_2.appear('w2', global_t, 0, 2, 0.5);

    text_1.appear('w1/ceil(w1)', global_t, 3, 12, 0.5, new Point(sizeX * 0.25, 80));
    text_2.appear('w2/ceil(w2)', global_t, 3, 12, 0.5, new Point(sizeX * 0.75, 80));

    title.appear('Pairing weighted particles', global_t, 0, 2);
    title.appear('Split', global_t, 2, 5);
    title.appear('Shuffle', global_t, 5, 8);
    title.appear('Pair', global_t, 8, 12);

    prtls_1.forEach(function(prtl, index) {
      prtl.appear(global_t, 2, 20);
      prtl.moveParticle(global_t, new Point(prtl.position.x, sizeY * 0.5 + (index - 3) * delY), 2, 3);
      prtl.moveParticle(global_t, new Point(prtl.position.x, sizeY * 0.5 + (shuffle_1[index] - 1 - 3) * delY), 5, 6);
    });

    prtls_2.forEach(function(prtl, index) {
      prtl.appear(global_t, 2, 20);
      prtl.moveParticle(global_t, new Point(prtl.position.x, sizeY * 0.5 + (index - 3) * delY), 2, 3);
      prtl.moveParticle(global_t, new Point(prtl.position.x, sizeY * 0.5 + (shuffle_2[index] - 1 - 3) * delY), 5, 6);
    });

    connections.forEach(function(conn, index) {
      conn.appear('<-------------->', global_t, 8, 12, 0.5);
    });

    // TIMER.appear(global_t.toPrecision(5), global_t, 0, 100);

    // counter
    global_t += global_dt;

    if (global_t > 12) {
      global_t = 0;
      reset();
    }
  }
}

let myp5_pairing = new p5(pairing_s);
