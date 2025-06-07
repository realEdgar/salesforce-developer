import { LightningElement, api } from 'lwc';

const COLS_CHILDRELATED = [
    { label: 'Child Object', fieldName: 'childObjectApiName', type: 'text' },
    { label: 'Field Api Name', fieldName: 'fieldName', type: 'text' },
    { label: 'Relationship Name', fieldName: 'relationshipName', type: 'text' },
];

export default class ObjectDetails extends LightningElement {
    @api objectDetails;
    childObjectsColumns = COLS_CHILDRELATED;

    get theme(){
        return `background-color: #${this.objectDetails.themeInfo?.color ?? 'fff'}`;
    }
}