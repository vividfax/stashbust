class Stitch {

    constructor(x, y) {

        this.x = x;
        this.y = y;

        this.stitchSize = (gridBounds-10)/gridSize;
        this.colour = color(0, 0, 0, 0);

        let scale = 0.08;
        this.perlin = noise(this.x*scale, this.y*scale);
    }

    getColour() {

        for (let i = 0; i < sliders.length; i++) {
            if (this.perlin < ratios[i]) {
                stitchesCounts[i]++;
                break;
            }
        }
    }

    display() {

        let stitchSize = (gridBounds-10)/gridSize;
        let colour = this.colour;

        for (let i = 0; i < sliders.length; i++) {
            if (this.perlin < ratios[i]) {
                colour = sliderColourPickers[i].value();
                break;
            }
        }

        push();
        translate(width/2, height/2);
        translate(-gridSize*stitchSize/2, -gridSize*stitchSize/2);
        translate(this.x*stitchSize, this.y*stitchSize);

        stroke(palette.white);
        strokeWeight(stitchSize*.4);
        line(stitchSize*.85, stitchSize*.15, stitchSize*.15, stitchSize*.85);
        stroke(colour);
        strokeWeight(stitchSize*.35);
        line(stitchSize*.85, stitchSize*.15, stitchSize*.15, stitchSize*.85);
        stroke(palette.white);
        strokeWeight(stitchSize*.4);
        line(stitchSize*.15, stitchSize*.15, stitchSize*.85, stitchSize*.85);
        stroke(colour);
        strokeWeight(stitchSize*.35);
        line(stitchSize*.15, stitchSize*.15, stitchSize*.85, stitchSize*.85);
        pop();
    }
}