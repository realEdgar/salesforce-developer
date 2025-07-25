import { LightningElement } from 'lwc';

const STEPS = [
    { label: 'Define Main SObject Details', value: 1 },
    { label: 'Select Child Objects', value: 2 },
    { label: 'Step 3', value: 3 },
    { label: 'Step 4', value: 4 },
    { label: 'Step 5', value: 5 },
    { label: 'Step 6', value: 6 },
];

export default class DataManagement extends LightningElement {
    isData;
    currentStep = 1;

    steps = STEPS;

    get isFirstStep(){
        return this.currentStep === 1;
    }

    get isLastStep(){
        return this.currentStep === this.steps.length;
    }

    handleNext(){
        this.currentStep++;
    }

    handlePrevious(){
        this.currentStep--;
    }

    handleCompleteDataManagement(){
        // TBD
    }
}