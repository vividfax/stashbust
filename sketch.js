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

let gridSizeSpan;

function setup() {

    gridBounds = windowWidth > 700 ? 700 : windowWidth - 10;

    createCanvas(gridBounds, gridBounds);

    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {

            grid[i][j] = new Stitch(i, j);
        }
    }

    select("#add-colour-button").mousePressed(addSlider);
    gridSizeSpan = select("#grid-size");

    addSlider();
    addSlider();
}

function draw() {

    background(palette.white);

    let totalStitches = 0;

    for (let i = 0; i < sliders.length; i++) {
        totalStitches += floor(sliders[i].value()/8 * 1785);
        stitchesPerSlider[i] = floor(sliders[i].value()/8 * 1785);
    }

    gridSize = floor(sqrt(totalStitches));
    gridSizeSpan.html(gridSize+"x"+gridSize);

    getRatios();

    display();
}

function addSlider() {

    let parentDiv = createDiv();
    parentDiv.id(sliders.length);
    parentDiv.parent("#slider-list")
    parentDiv.attribute("draggable", true);
    parentDiv.attribute("ondragstart", "drag(event)");
    parentDiv.class("slider-holder");
    let colour = color(random(255), random(255), random(255));
    let sliderColourPicker = createColorPicker(colour).parent(parentDiv).style("vertical-align", "middle");
    sliderColourPicker.class("colour-picker");
    let newSlider = createSlider(0, 8, 0.5, 0.5).parent(parentDiv).style("vertical-align", "middle");
    newSlider.class("slider");
    createSpan(" ").parent(parentDiv);
    let text = createSpan(newSlider.value()).parent(parentDiv).style("vertical-align", "middle");
    createSpan(" m").parent(parentDiv);
    newSlider.style("appearance", "none");
    newSlider.style("border-radius", "4px");
    newSlider.style("height", "8px");
    newSlider.attribute("draggable", false);

    sliders.push(newSlider);
    sliderLabels.push(text);
    sliderColourPickers.push(sliderColourPicker);
    ratios.push(1);
    stitchesPerSlider.push(0);

    if (sliders.length >= 10) select("#add-colour-button").style("display", "none");
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

function allowDrop(ev) {

    ev.preventDefault();
}

function drag(ev) {

    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {

    ev.preventDefault();
    let data = ev.dataTransfer.getData("text");
    let parent = document.getElementById("slider-list");
    let dragElement = document.getElementById(data);
    let dropElement = ev.target;
    if (dropElement.parentNode != parent) dropElement = dropElement.parentNode;
    if (dropElement.parentNode != parent) return;

    let dropBox = dropElement.getBoundingClientRect();
    let dropCentreY = dropBox.top + dropBox.height/2;

    let dragIndex = $(dragElement).index();
    let dropIndex = $(dropElement).index();

    if (dropCentreY < event.pageY) {
        parent.insertBefore(dragElement, dropElement.nextSibling);
    } else {
        parent.insertBefore(dragElement, dropElement);
    }

    console.log(dragIndex, dropIndex);

    let dragSlider = sliders.splice(dragIndex, 1);
    let dragLabel = sliderLabels.splice(dragIndex, 1);
    let dragPicker = sliderColourPickers.splice(dragIndex, 1);

    sliders.splice(dropIndex, 0, dragSlider[0]);
    sliderLabels.splice(dropIndex, 0, dragLabel[0]);
    sliderColourPickers.splice(dropIndex, 0, dragPicker[0]);
}