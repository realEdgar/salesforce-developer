import { LightningElement } from 'lwc';

const STEPS = [
    { label: 'Define Main SObject Details', value: 1 },
    { label: 'Select Child Objects', value: 2 },
    { label: 'Validate Super Query', value: 3 },
    { label: 'Step 4', value: 4 },
    { label: 'Step 5', value: 5 },
    { label: 'Step 6', value: 6 },
];

export default class DataManagement extends LightningElement {
    currentStep = 1;
    steps = STEPS;

    fields;
    selectedSObject;
    filters;
    limitOfRecords;

    subqueries;

    get isFirstStep(){
        return this.currentStep === 1;
    }

    get isStep2(){
        return this.currentStep === 2;
    }

    get isLastStep(){
        return this.currentStep === this.steps.length;
    }

    handleNext(){
        this.currentStep++;
        if(this.currentStep === 3){
            this.fields = this.fields + ', ' + this.subqueries;
        }
    }

    handlePrevious(){
        this.currentStep--;
    }

    handleCompleteDataManagement(){
        // TBD
    }

    handleMainDetails(event){
        for(let key in event.detail){
            this[key] = event.detail[key]
        }
    }

    handleSelectedChilds(event){
        this.subqueries = event.detail.fields.join(',');
    }
}