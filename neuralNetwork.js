class NeuralNetwork {

    constructor(layersSize) {
        //deep copy layers
        this.layersSize = layersSize; //size of each layer
        this.layers = []; //layers in the network #layer type

        this.trainingDataSet = [];
        this.addButtons = [];
        this.removeButtons = [];

        for (let i = 0; i < layersSize.length; i++) {
            this.layersSize[i] = layersSize[i];
        }

        for (let i = 0; i < layersSize.length; i++) {
            this.layersSize[i] = layersSize[i];

            let addButton = createButton('+');
            addButton.position(this.neuronX(i, -1) - 10, this.neuronY(i, -1));
            addButton.mousePressed(() => {
                this.addButtonFunction(i)
            });
            this.addButtons.push(addButton);

            let removeButton = createButton('-');
            removeButton.position(this.neuronX(i, -1) + 10, this.neuronY(i, -1));
            removeButton.mousePressed(() => {
                this.removeButtonFunction(i)
            });
            this.removeButtons.push(removeButton);
        }

        //creates neural layers
        for (let i = 0; i < layersSize.length - 1; i++)
            this.layers.push(new Layer(layersSize[i], layersSize[i + 1], this, i));

        //this.addButtonFunction(1);
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
        for (let i = 0; i < this.layersSize.length; ++i) {
            for (let j = 0; j < this.layersSize[i]; ++j) {
                strokeWeight(2);
                fill(neuronColor);

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
                ellipse(x, y, neuronRadius, neuronRadius);
            }
        }
    }

    //position of neuron on canvas;
    neuronX(x, y) {
        let layerWidth = (WIDTH - 600) / this.layersSize.length;
        return 100 + layerWidth / 2 + layerWidth * x;
    }

    neuronY(x, y) {
        let l = this.layersSize[x];
        return 100 + 200 - (l - 1) * 22.5 + 45 * y;
    }

    addButtonFunction(i) {
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

	this.addButtons[i].position(this.neuronX(i, -1) - 10, this.neuronY(i, -1));
	this.removeButtons[i].position(this.neuronX(i, -1) + 10, this.neuronY(i, -1));
        this.show();
    }

    removeButtonFunction(i) {
        this.layersSize[i] -= 1;

        if (i > 0) {
            this.layers[i - 1].numberOfOutputs -= 1;
            this.layers[i - 1].weights.pop();
            this.layers[i - 1].weightsDelta.pop();
        }

        if (i < this.layersSize.length - 1) {
            this.layers[i].numberOfInputs -= 1;
        }

	this.addButtons[i].position(this.neuronX(i, -1) - 10, this.neuronY(i, -1));
	this.removeButtons[i].position(this.neuronX(i, -1) + 10, this.neuronY(i, -1));
        this.show();
    }
}
