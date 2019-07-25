var neuralNetwork;

const WIDTH = 1400
const HEIGHT = 900;
var neuronColor;
var neuronRadius = 30;

async function setup() {
    createCanvas(WIDTH, HEIGHT);
    neuronColor = color(0, 0, 0, 255);

    //neuralNetwork = new NeuralNetwork([1,2,3,4,5,6,7,8,9,10]);
    neuralNetwork = new NeuralNetwork([3, 5, 4, 1]);

    var button = createButton('Do 500 cycles of learning');
    button.position(10 , 10);
    button.mousePressed(train);

    //dataSet[0] is input and dataSet[1] is expected output
    neuralNetwork.trainingDataSet.push([[0, 0, 0],[0]]);
    neuralNetwork.trainingDataSet.push([[0, 0, 1],[1]]);
    neuralNetwork.trainingDataSet.push([[0, 1, 0],[1]]);
    neuralNetwork.trainingDataSet.push([[0, 1, 1],[0]]);
    neuralNetwork.trainingDataSet.push([[1, 0, 0],[1]]);
    neuralNetwork.trainingDataSet.push([[1, 0, 1],[0]]);
    neuralNetwork.trainingDataSet.push([[1, 1, 0],[0]]);
    neuralNetwork.trainingDataSet.push([[1, 1, 1],[1]]);
	
    neuralNetwork.show();
}

async function train() {
for (let i = 0; i < 500; i++) {
        for (trainingData of neuralNetwork.trainingDataSet) {
            neuralNetwork.FeedForward(trainingData[0]);
            neuralNetwork.BackProp(trainingData[1]);
        }
        
        neuralNetwork.show();
        await sleep(0.5);
    }

    //printing results of trained network
    for (trainingData of neuralNetwork.trainingDataSet) {
        print(neuralNetwork.FeedForward(trainingData[0]));
    }

}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}