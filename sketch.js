var neuralNetwork;

const WIDTH = 1200
const HEIGHT = 900;
var neuronColor;
var neuronRadius = 30;
var learningIterations = 0;
var singleFeedForwardIteration = -1;

var trainingDataInput;
var learnButton;
var addTrainingDataButton;
var singleFeedForwardButton;
var learningRateSlider;
var cyclesInput;
var networkSelect;

async function setup() {
    var canvas = createCanvas(WIDTH, HEIGHT);
    canvas.parent('sketch-holder');

    learnButton = createButton('Learn!');
    learnButton.position(670, 560);
    learnButton.mousePressed(train);

    singleFeedForwardButton = createButton('Single feedforward');
    singleFeedForwardButton.position(350, 585);
    singleFeedForwardButton.mousePressed(singleFeedForward);

    trainingDataInput = createInput('Enter training data, example: 1,0,1;0');
    trainingDataInput.size(240);

    cyclesInput = createInput('100');
    cyclesInput.size(40);
    cyclesInput.position(620, 560);

    addTrainingDataButton = createButton('Add');
    addTrainingDataButton.mousePressed(() => {
        neuralNetwork.addTrainingData(trainingDataInput.value())
    });

    learningRateSlider = createSlider(0, 1, 0.3, 0.001);
    learningRateSlider.position(350, 640);
    learningRateSlider.style('width', '300px');
    learningRateSlider.input(() => {
        neuralNetwork.show();
    });

    networkSelect = createSelect();
    networkSelect.position(350, 700);
    networkSelect.option('XOR problem');
    networkSelect.option('3-input XOR');
    networkSelect.option('Custom network');
    networkSelect.changed(selectNetwork);

    neuronColor = color(0, 0, 0, 255);

    selectNetwork();
    neuralNetwork.show();
}

async function train() {
    singleFeedForwardIteration = -1;
    for (let i = 0; i < cyclesInput.value(); i++) {
        MSE = 0;
        for (trainingData of neuralNetwork.trainingDataSet) {
            let outputs = neuralNetwork.FeedForward(trainingData[0]);
            for (let j = 0; j < trainingData[1].length; ++j) {
                MSE += (outputs[j] - trainingData[1]) * (outputs[j] - trainingData[1]);
            }

            neuralNetwork.BackProp(trainingData[1]);
        }
        MSE /= neuralNetwork.trainingDataSet.length;

        myChart.data.datasets.forEach(function(dataset) {
            dataset.data.push({
                x: learningIterations,
                y: MSE
            });
            learningIterations++;
            myChart.update();
        });

        neuralNetwork.show();
        if (learningIterations % 10 == 0) //sleep sleeps longer that I order to
            await sleep(0.1);
    }

    //printing results of trained network
    for (trainingData of neuralNetwork.trainingDataSet) {
        print(neuralNetwork.FeedForward(trainingData[0]));
    }
}

function singleFeedForward() {
    singleFeedForwardIteration++;
    singleFeedForwardIteration %= neuralNetwork.trainingDataSet.length;
    neuralNetwork.FeedForward(neuralNetwork.trainingDataSet[singleFeedForwardIteration][0]);
    neuralNetwork.showActivation(neuralNetwork.trainingDataSet[singleFeedForwardIteration][0]);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function showGUI() {
    fill('white');
    strokeWeight(0.5);
    text('Cycles of backpropagation:', 345, 550);
    text('Learning rate: ' + learningRateSlider.value(), 345, 610);
}

function selectNetwork() {
    try {
        neuralNetwork.destructor();
    } catch (e) {}

    if (networkSelect.value() == "XOR problem") {
        neuralNetwork = new NeuralNetwork([2, 2, 1]);
        neuralNetwork.addTrainingData("0,0;0");
        neuralNetwork.addTrainingData("0,1;1");
        neuralNetwork.addTrainingData("1,0;1");
        neuralNetwork.addTrainingData("1,1;0");
    } else if (networkSelect.value() == "3-input XOR") {
        neuralNetwork = new NeuralNetwork([3, 3, 1]);
        neuralNetwork.addTrainingData("0,0,0;0");
        neuralNetwork.addTrainingData("0,0,1;1");
        neuralNetwork.addTrainingData("0,1,0;1");
        neuralNetwork.addTrainingData("1,0,0;1");
        neuralNetwork.addTrainingData("1,0,1;0");
        neuralNetwork.addTrainingData("1,1,0;0");
        neuralNetwork.addTrainingData("1,1,1;1");
    } else if (networkSelect.value() == "Custom network") {
        neuralNetwork = new NeuralNetwork([2, 3, 1]);
    }
    neuralNetwork.show();
}