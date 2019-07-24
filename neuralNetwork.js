class NeuralNetwork {

    constructor(layersSize) {
        //deep copy layers
        this.layersSize = layersSize; //size of each layer
        this.layers = []; //layers in the network #layer type

        this.trainingDataSet = [];

        for (let i = 0; i < layersSize.length; i++)
            this.layersSize[i] = layersSize[i];

        //creates neural layers
        for (let i = 0; i < layersSize.length - 1; i++)
            this.layers.push(new Layer(layersSize[i], layersSize[i + 1]));
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
			if(this.layers[i].weights[k][j] > 0) stroke(129,182,102);
			else stroke(240,113,78);
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
}