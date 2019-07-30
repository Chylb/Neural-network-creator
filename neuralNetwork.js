class NeuralNetwork {

    constructor(layersSize) {
        //deep copy layers
        this.layersSize = layersSize; //size of each layer
        this.layers = []; //layers in the network #layer type

        this.trainingDataSet = [];
        this.addNeuronButtons = [];
        this.removeNeuronButtons = [];
        this.addLayerButtons = [];
        this.removeTrainingDataButtons = [];

        for (let i = 0; i < layersSize.length; i++) {
            this.layersSize[i] = layersSize[i];

            let addNeuronButton = createButton('+');
            addNeuronButton.position(this.neuronX(i, -1) - 10, this.neuronY(i, -1));
            addNeuronButton.mousePressed(() => {
                this.addNeuron(i)
            });
            this.addNeuronButtons.push(addNeuronButton);

            let removeNeuronButton = createButton('-');
            removeNeuronButton.position(this.neuronX(i, -1) + 10, this.neuronY(i, -1));
            removeNeuronButton.mousePressed(() => {
                this.removeNeuron(i)
            });
            this.removeNeuronButtons.push(removeNeuronButton);
        }

        //creates neural layers
        for (let i = 0; i < layersSize.length - 1; i++) {
            this.layers.push(new Layer(layersSize[i], layersSize[i + 1]));

            let addLayerButton = createButton('+');
            addLayerButton.position(this.neuronX(i, -2) / 2 + this.neuronX(i + 1, -2) / 2, this.neuronY(i, -2) / 2 + this.neuronY(i + 1, -2) / 2);
            addLayerButton.mousePressed(() => {
                this.addLayer(i)
            });
            this.addLayerButtons.push(addLayerButton);
        }
    }

    FeedForward(inputs) {
        //feed forward
        this.layers[0].FeedForward(inputs);

        for (let i = 1; i < this.layers.length; i++)
            this.layers[i].FeedForward(this.layers[i - 1].outputs);

        return this.layers[this.layers.length - 1].outputs; //return output of last layer
    }

    BackProp(expected) {
        // run over all layers backwards
        for (let i = this.layers.length - 1; i >= 0; i--) {
            if (i == this.layers.length - 1)
                this.layers[i].BackPropOutput(expected); //back prop output
            else
                this.layers[i].BackPropHidden(this.layers[i + 1].gamma, this.layers[i + 1].weights); //back prop hidden
        }

        //Update weights
        for (let i = 0; i < this.layers.length; i++)
            this.layers[i].UpdateWeights();
    }

    show() {
        background(0, 0, 0);
	singleFeedForwardIteration = -1;

        for (let i = 0; i < this.layersSize.length; ++i) {
            for (let j = 0; j < this.layersSize[i]; ++j) {

                let x = this.neuronX(i, j);
                let y = this.neuronY(i, j)

                if (i < this.layersSize.length - 1) {
                    for (let k = 0; k < this.layers[i].numberOfOutputs; ++k) {
                        //drawing each weight as line with the width of weight;
                        strokeWeight(this.layers[i].weights[k][j]);
                        if (this.layers[i].weights[k][j] > 0) stroke(129, 182, 102);
                        else stroke(240, 113, 78);
                        line(x, y, this.neuronX(i + 1, k), this.neuronY(i + 1, k));
                    }
                }
                stroke(255, 255, 255);
                strokeWeight(2);
                fill(neuronColor);
                ellipse(x, y, neuronRadius, neuronRadius);
            }
        }
        this.showTrainingDataset();
	showGUI();
    }

    showActivation(inputs) {
        background(0, 0, 0);

        for (let i = 0; i < this.layersSize.length; ++i) {
            for (let j = 0; j < this.layersSize[i]; ++j) {

                let x = this.neuronX(i, j);
                let y = this.neuronY(i, j)

                if (i < this.layersSize.length - 1) {
                    for (let k = 0; k < this.layers[i].numberOfOutputs; ++k) {
                        //drawing each weight as line with the width of weight;
                        strokeWeight(this.layers[i].weights[k][j]);
                        if (this.layers[i].weights[k][j] > 0) stroke(129, 182, 102);
                        else stroke(240, 113, 78);
                        line(x, y, this.neuronX(i + 1, k), this.neuronY(i + 1, k));
                    }
                }

                if (i == 0) { //input layer
                    stroke(255, 255, 255);
                    strokeWeight(2);
                    fill(255 * inputs[j]);
                    ellipse(x, y, neuronRadius, neuronRadius);
                } else {
                    stroke(255, 255, 255);
                    strokeWeight(2);
                    fill(255 * this.layers[i - 1].outputs[j]);
                    ellipse(x, y, neuronRadius, neuronRadius);
                }
            }
        }
        this.showTrainingDataset();
	showGUI();
    }

    showTrainingDataset() {
        strokeWeight(1);
        stroke('white');
        textSize(32);
        fill('white');
        textAlign(LEFT, TOP);

        text('Training data set', 30, 20);

        textSize(22);

        rectMode(CORNER);
        let i = 0;

        for (let trainingData of this.trainingDataSet) {
            fill(color(0, 0, 0, 0));
            rect(5, i * 30 + 60, 150, 30);
            rect(155, i * 30 + 60, 150, 30);

            if (i == singleFeedForwardIteration) 
                fill('yellow');
            else 
                fill('white');
            
            text(trainingData[0], 10, i * 30 + 65);
            text(trainingData[1], 160, i * 30 + 65);
            i += 1;
        }
        trainingDataInput.position(15, i * 30 + 75);
        addTrainingDataButton.position(265, i * 30 + 75);
    }

    //position of neuron on canvas;
    neuronX(x, y) {
        let layerWidth = (WIDTH - 300 - 20) / this.layersSize.length;
        return 300 + layerWidth / 2 + layerWidth * x;
    }

    neuronY(x, y) {
        let l = this.layersSize[x];
        return 100 + 200 - (l - 1) * 22.5 + 45 * y;
    }

    addNeuron(i) {
        this.layersSize[i] += 1;

        if (i > 0) {
            this.layers[i - 1].numberOfOutputs += 1;
            this.layers[i - 1].weights.push([]);
            this.layers[i - 1].weightsDelta.push([]);

            let k = this.layers[i - 1].numberOfOutputs - 1;
            for (let j = 0; j < this.layers[i - 1].numberOfInputs; j++)
                this.layers[i - 1].weights[k][j] = (Math.random() - 0.5);
        }

        if (i < this.layersSize.length - 1) {
            this.layers[i].numberOfInputs += 1;
            let j = this.layers[i].numberOfInputs - 1;
            for (let k = 0; k < this.layers[i].numberOfOutputs; k++) {
                this.layers[i].weights[k][j] = (Math.random() - 0.5);
            }
        }

        this.addNeuronButtons[i].position(this.neuronX(i, -1) - 10, this.neuronY(i, -1));
        this.removeNeuronButtons[i].position(this.neuronX(i, -1) + 10, this.neuronY(i, -1));

        //reset position of neigbouring addLayerButtons
        if (i > 0)
            this.addLayerButtons[i - 1].position(this.neuronX(i - 1, -2) / 2 + this.neuronX(i, -2) / 2, this.neuronY(i - 1, -2) / 2 + this.neuronY(i, -2) / 2);

        if (i < this.layersSize.length - 1)
            this.addLayerButtons[i].position(this.neuronX(i, -2) / 2 + this.neuronX(i + 1, -2) / 2, this.neuronY(i, -2) / 2 + this.neuronY(i + 1, -2) / 2);

        this.show();
    }

    removeNeuron(i) {
        this.layersSize[i] -= 1;

        if (this.layersSize[i] > 0) {

            if (i > 0) {
                this.layers[i - 1].numberOfOutputs -= 1;
                this.layers[i - 1].weights.pop();
                this.layers[i - 1].weightsDelta.pop();
                this.layers[i - 1].gamma.pop();
            }

            if (i < this.layersSize.length - 1) {
                this.layers[i].numberOfInputs -= 1;
            }

            this.addNeuronButtons[i].position(this.neuronX(i, -1) - 10, this.neuronY(i, -1));
            this.removeNeuronButtons[i].position(this.neuronX(i, -1) + 10, this.neuronY(i, -1));
        } else
            this.removeLayer(i);

        //reset position of neigbouring addLayerButtons
        if (i > 0 && this.layersSize[i] > 0)
            this.addLayerButtons[i - 1].position(this.neuronX(i - 1, -2) / 2 + this.neuronX(i, -2) / 2, this.neuronY(i - 1, -2) / 2 + this.neuronY(i, -2) / 2);

        if (i < this.layersSize.length - 1)
            this.addLayerButtons[i].position(this.neuronX(i, -2) / 2 + this.neuronX(i + 1, -2) / 2, this.neuronY(i, -2) / 2 + this.neuronY(i + 1, -2) / 2);

        this.show();
    }

    addLayer(i) {
        this.layersSize.splice(i + 1, 0, 1);
        this.layers[i].numberOfOutputs = 1;
        this.layers.splice(i + 1, 0, new Layer(1, this.layersSize[i + 2]));

        //Buttons adjustments
        let n = this.layersSize.length;

        let addNeuronButton = createButton('+');
        addNeuronButton.position(0, 0);
        addNeuronButton.mousePressed(() => {
            this.addNeuron(n - 1)
        });
        this.addNeuronButtons.push(addNeuronButton);

        let removeNeuronButton = createButton('-');
        removeNeuronButton.position(0, 0);
        removeNeuronButton.mousePressed(() => {
            this.removeNeuron(n - 1)
        });
        this.removeNeuronButtons.push(removeNeuronButton);

        let addLayerButton = createButton('+');
        addLayerButton.position(0, 0);
        addLayerButton.mousePressed(() => {
            this.addLayer(n - 2)
        });
        this.addLayerButtons.push(addLayerButton);

        for (let j = 0; j < this.layersSize.length - 1; j++) {
            this.addNeuronButtons[j].position(this.neuronX(j, -1) - 10, this.neuronY(j, -1));
            this.removeNeuronButtons[j].position(this.neuronX(j, -1) + 10, this.neuronY(j, -1));
            this.addLayerButtons[j].position(this.neuronX(j, -2) / 2 + this.neuronX(j + 1, -2) / 2, this.neuronY(j, -2) / 2 + this.neuronY(j + 1, -2) / 2);
        }
        let j = this.layersSize.length - 1;
        this.addNeuronButtons[j].position(this.neuronX(j, -1) - 10, this.neuronY(j, -1));
        this.removeNeuronButtons[j].position(this.neuronX(j, -1) + 10, this.neuronY(j, -1));

        this.show();
    }

    removeLayer(i) {
        this.layersSize.splice(i, 1);

        if (i == 0) {
            this.layers.splice(i, 1);
        } else if (i > 0 && i < this.layers.length) {

            this.layers.splice(i, 1);
            let previousNumberOfOutputs = this.layers[i - 1].numberOfOutputs;
            this.layers[i - 1].numberOfOutputs = this.layersSize[i];

            for (let j = previousNumberOfOutputs; j < this.layers[i - 1].numberOfOutputs; ++j) {
                this.layers[i - 1].weights.push([]);
                this.layers[i - 1].weightsDelta.push([]);
                for (let k = 0; k < this.layers[i - 1].numberOfInputs; k++)
                    this.layers[i - 1].weights[j][k] = (Math.random() - 0.5);
            }
        } else {

            this.layers.pop();
            let previousNumberOfOutputs = this.layers[i - 2].numberOfOutputs;
            this.layers[i - 2].numberOfOutputs = this.layersSize[i - 1];

            for (let j = previousNumberOfOutputs; j < this.layers[i - 2].numberOfOutputs; ++j) {
                this.layers[i - 2].weights.push([]);
                this.layers[i - 2].weightsDelta.push([]);
                for (let k = 0; k < this.layers[i - 2].numberOfInputs; k++)
                    this.layers[i - 2].weights[j][k] = (Math.random() - 0.5);
            }
        }

        //Buttons adjustments
        this.addNeuronButtons.pop().remove();
        this.removeNeuronButtons.pop().remove();
        this.addLayerButtons.pop().remove();

        for (let j = 0; j < this.layersSize.length - 1; j++) {
            this.addNeuronButtons[j].position(this.neuronX(j, -1) - 10, this.neuronY(j, -1));
            this.removeNeuronButtons[j].position(this.neuronX(j, -1) + 10, this.neuronY(j, -1));
            this.addLayerButtons[j].position(this.neuronX(j, -2) / 2 + this.neuronX(j + 1, -2) / 2, this.neuronY(j, -2) / 2 + this.neuronY(j + 1, -2) / 2);
        }
        let j = this.layersSize.length - 1;
        this.addNeuronButtons[j].position(this.neuronX(j, -1) - 10, this.neuronY(j, -1));
        this.removeNeuronButtons[j].position(this.neuronX(j, -1) + 10, this.neuronY(j, -1));
    }

    addTrainingData(arg) {
        try {
            let res = arg.split(";");
            let input = JSON.parse("[" + res[0] + "]");
            let output = JSON.parse("[" + res[1] + "]");
            let trainingData = [];
            trainingData.push(input);
            trainingData.push(output);

            this.trainingDataSet.push(trainingData);

            let removeTrainingDataButton = createButton('x');
            removeTrainingDataButton.position(290, 70 + 30 * (this.trainingDataSet.length - 1));
            let n = this.trainingDataSet.length - 1;
            removeTrainingDataButton.mousePressed(() => {
                this.removeTrainingData(n)
            });
            this.removeTrainingDataButtons.push(removeTrainingDataButton);
            this.show();

        } catch (error) {}
    }

    removeTrainingData(i) {
        this.trainingDataSet.splice(i, 1);
        this.removeTrainingDataButtons.pop().remove();
        this.show();
    }
}