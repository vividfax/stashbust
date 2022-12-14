let palette = {
    white: "#E0D3DE",
    light: "#D8D0C1",
    mid: "#CBB8A9",
    dark: "#B3B492",
    black: "#6F686D"
};

let gridSize = 400;
let grid = [...Array(gridSize)].map(e => Array(gridSize));
let gridBounds;

let sliders = [];
let sliderLabels = [];
let sliderColourPickers = [];
let ratios = [];
let stitchesPerSlider = [];
let stitchesCounts = [];

function setup() {

    gridBounds = windowWidth > 700 ? 700 : windowWidth - 10;

    createCanvas(gridBounds, gridBounds);

    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {

            grid[i][j] = new Stitch(i, j);
        }
    }

    let addButton = createButton("Add colour");
    addButton.mousePressed(addSlider);

    addSlider();
    addSlider();
}

function draw() {

    background(palette.white);

    let totalStitches = 0;

    for (let i = 0; i < sliders.length; i++) {
        totalStitches += floor(sliders[i].value()/8 * 2295);
        stitchesPerSlider[i] = floor(sliders[i].value()/8 * 2295);
    }

    gridSize = floor(sqrt(totalStitches));

    getRatios();

    display();
}

function addSlider() {

    let parentDiv = createDiv();
    let sliderColourPicker = createColorPicker(color(random(255), random(255), random(255))).parent(parentDiv).style("vertical-align", "middle");
    sliderColourPicker.style("border", "none");
    let newSlider = createSlider(0, 8, 1.5, 0.5).parent(parentDiv).style("vertical-align", "middle");
    let text = createSpan(newSlider.value()).parent(parentDiv).style("vertical-align", "middle");
    createSpan(" m").parent(parentDiv);
    newSlider.style("appearance", "none");
    newSlider.style("border-radius", "4px");
    newSlider.style("height", "8px");

    sliders.push(newSlider);
    sliderLabels.push(text);
    sliderColourPickers.push(sliderColourPicker);
    ratios.push(1);
    stitchesPerSlider.push(0);
}

function getRatios() {

    for (let i = 0; i < sliders.length; i++) {
        ratios[i] = 1;
    }

    let valid = true;

    do {
        valid = true;

        for (let i = 0; i < sliders.length; i++) {
            stitchesCounts[i] = 0;
        }

        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {

                grid[i][j].getColour();
            }
        }

        for (let i = 0; i < sliders.length; i++) {
            if (stitchesCounts[i] > stitchesPerSlider[i]) {
                valid = false;
                ratios[i]-=0.001;
                break;
            }
        }
    } while (valid == false);
}

function display() {

    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {

            grid[i][j].display();
        }
    }

    for (let i = 0; i < sliders.length; i++) {
        sliderLabels[i].html(sliders[i].value());
        sliders[i].style("background", sliderColourPickers[i].value());
    }
}