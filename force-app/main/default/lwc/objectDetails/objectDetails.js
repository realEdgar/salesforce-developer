import { LightningElement, api } from 'lwc';

const COLS_CHILDRELATED = [
    { label: 'Child Object', fieldName: 'childObjectApiName', type: 'text' },
    { label: 'Field Api Name', fieldName: 'fieldName', type: 'text' },
    { label: 'Relationship Name', fieldName: 'relationshipName', type: 'text' },
];
const COLS_FIELDS = [
    { label: 'Field Label', fieldName: 'label', type: 'text' },
    { label: 'Field Api Name', fieldName: 'apiName', type: 'text' },
    { label: 'Field Type', fieldName: 'dataType', type: 'text' },
];

export default class ObjectDetails extends LightningElement {
    @api objectDetails;
    childObjectsColumns = COLS_CHILDRELATED;
    objectFieldColumns = COLS_FIELDS;

    get theme(){
        return `background-color: #${this.objectDetails.themeInfo?.color ?? 'fff'}`;
    }
    
    get fieldsData(){
        let data = [];
        for(let fieldInfo in this.objectDetails.fields){
            data.push(
                this.objectDetails.fields[fieldInfo]
            );
        }
        return data;        
    }
}