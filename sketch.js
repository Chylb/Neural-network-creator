var neuralNetwork;

const WIDTH = 1200
const HEIGHT = 900;
var neuronColor;
var neuronRadius = 30;
var learningIterations = 0;

async function setup() {
    var canvas = createCanvas(WIDTH, HEIGHT);
    canvas.parent('sketch-holder');

    neuronColor = color(0, 0, 0, 255);

    //neuralNetwork = new NeuralNetwork([1,2,3,4,5,6,7,8,9,10]);
    neuralNetwork = new NeuralNetwork([3, 5, 4, 1]);

    var button = createButton('Do 500 cycles of learning');
    button.position(10, 10);
    button.mousePressed(train);

    //dataSet[0] is input and dataSet[1] is expected output
    neuralNetwork.trainingDataSet.push([
        [0, 0, 0],
        [0]
    ]);
    neuralNetwork.trainingDataSet.push([
        [0, 0, 1],
        [1]
    ]);
    neuralNetwork.trainingDataSet.push([
        [0, 1, 0],
        [1]
    ]);
    neuralNetwork.trainingDataSet.push([
        [0, 1, 1],
        [0]
    ]);
    neuralNetwork.trainingDataSet.push([
        [1, 0, 0],
        [1]
    ]);
    neuralNetwork.trainingDataSet.push([
        [1, 0, 1],
        [0]
    ]);
    neuralNetwork.trainingDataSet.push([
        [1, 1, 0],
        [0]
    ]);
    neuralNetwork.trainingDataSet.push([
        [1, 1, 1],
        [1]
    ]);

    neuralNetwork.show();
}

async function train() {
    for (let i = 0; i < 500; i++) {
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
	if(learningIterations % 10 == 0) //sleep sleeps longer that I order to
            await sleep(0.1);
    }

    //printing results of trained network
    for (trainingData of neuralNetwork.trainingDataSet) {
        print(neuralNetwork.FeedForward(trainingData[0]));
    }

}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}