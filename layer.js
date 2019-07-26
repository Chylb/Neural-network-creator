class Layer {

    constructor(numberOfInputs, numberOfOutputs) {

        this.numberOfInputs = numberOfInputs; //number of neurons in the previous layer
        this.numberOfOutputs = numberOfOutputs; //number of neurons in the current layer

        //initilize data structures
        this.outputs = []; //outputs of this layer
        this.inputs = []; //inputs in into this layer
        this.weights = []; //weights of this layer 
        this.weightsDelta = []; //deltas of this layer
        this.gamma = []; //gamma of this layer
        this.error = []; //error of the output layer

        this.InitilizeWeights(); //initilize weights

    }

    InitilizeWeights() {
        for (let i = 0; i < this.numberOfOutputs; i++) {
            this.weights.push([]); //weights[numberOfOutputs][]
            this.weightsDelta.push([]); //weightsDelta[numberOfOutputs][]
            for (let j = 0; j < this.numberOfInputs; j++) 
                this.weights[i][j] = (Math.random() - 0.5);
        }
    }

    FeedForward(inputs) {
        this.inputs = inputs; //shallow copy which can be used for back propagation

        //feed forwards
        for (let i = 0; i < this.numberOfOutputs; i++) {
            this.outputs[i] = 0;

            for (let j = 0; j < this.numberOfInputs; j++) 
                this.outputs[i] += this.inputs[j] * this.weights[i][j];
            
            this.outputs[i] = (Math.tanh(this.outputs[i]));
        }
        return this.outputs;
    }

    //TanH derivative
    TanHDer(value) {
        return 1 - (value * value);
    }

    //Back propagation for the output layer
    BackPropOutput(expected) {
        //Error dervative of the cost function
        for (let i = 0; i < this.numberOfOutputs; i++)
            this.error[i] = this.outputs[i] - expected[i];

        //Gamma calculation
        for (let i = 0; i < this.numberOfOutputs; i++)
            this.gamma[i] = this.error[i] * this.TanHDer(this.outputs[i]);

        //Caluclating detla weights
        for (let i = 0; i < this.numberOfOutputs; i++) 
            for (let j = 0; j < this.numberOfInputs; j++) 
                this.weightsDelta[i][j] = this.gamma[i] * this.inputs[j];              
    }

    //Back propagation for the hidden layers
    BackPropHidden(gammaForward, weightsFoward) {
        //Caluclate new gamma using gamma sums of the forward layer
        for (let i = 0; i < this.numberOfOutputs; i++) {
            this.gamma[i] = 0;

            for (let j = 0; j < gammaForward.length; j++) 
                this.gamma[i] += gammaForward[j] * weightsFoward[j][i];
            
            this.gamma[i] *= this.TanHDer(this.outputs[i]);
        }

        //Calculating detla weights
        for (let i = 0; i < this.numberOfOutputs; i++) 
            for (let j = 0; j < this.numberOfInputs; j++) 
                this.weightsDelta[i][j] = this.gamma[i] * this.inputs[j];
    }

    UpdateWeights() {
        for (let i = 0; i < this.numberOfOutputs; i++) 
            for (let j = 0; j < this.numberOfInputs; j++) 
                this.weights[i][j] -= this.weightsDelta[i][j] * 0.033;    
    }
}