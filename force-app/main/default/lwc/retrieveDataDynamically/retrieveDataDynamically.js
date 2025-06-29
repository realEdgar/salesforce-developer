import { LightningElement, track } from 'lwc';
import getRecords from '@salesforce/apex/UtilityClass.getRecords';

export default class RetrieveDataDynamically extends LightningElement {
    fields;
    SObjectApiName;
    filters;
    noRecords;

    records = [];
    columns;
    @track childRecords = [];
    childColumns;
    childSObjectApiName;
    hasChildRecords = false;

    isError;
    errorMessage = '';

    get params() {
        return {
            fields: this.fields,
            SObjectApiName: this.SObjectApiName,
            filters: this.filters,
            noRecords: this.noRecords !== '' ? this.noRecords : null,
        }
    };

    handleChange(event){
        const inputName = event.target.name;
        this[inputName] = event.detail.value;
    }

    async handleSubmitQuery(event){
        event.preventDefault();
        this.error = false;
        this.errorMessage = '';
        try{
            const response = await getRecords(
                this.params
            );
            if(response === 'BAD REQUEST') {
                this.isError = true;
                this.errorMessage = BAD_REQUEST;
            } else if(response.includes('ERROR')) {
                this.isError = true;
                this.errorMessage = response;
            } else {
                const childRecords = [];
                this.buildColumns();
                this.records = JSON.parse(response).map(record => {
                    const parentReferences = this.columns.filter(col => col.parentRef) || [];
                    const newRow = { ...record };
                    if(parentReferences.length > 0){
                        for(let ref of parentReferences){
                            let cellValue;
                            const parentValues = ref.label.split('.');
                            parentValues.forEach((value, index) => {
                                if(index === 0) {
                                    cellValue = newRow[value];
                                } else {
                                    cellValue = cellValue[value];
                                }
                            })
                            newRow[ref.fieldName] = cellValue;
                        }
                    }
                    if(this.hasChildRecords){
                        console.log(this.childSObjectApiName, JSON.stringify(newRow[this.childSObjectApiName]));
                        const childRecord = {};
                        childRecord.reference = newRow.Id;
                        childRecord.records = newRow[this.childSObjectApiName]?.records ?? [] ;
                        childRecords.push(childRecord);
                    }
                    return newRow;
                });
                this.childRecords = childRecords;
            }
        } catch(error){
            this.isError = true;
            this.errorMessage = 'ERROR: Unable to submit query';
            console.error(error);
        }
    }

    buildColumns(){
        let startIndex = this.fields.indexOf('(');
        let endIndex = this.fields.indexOf(')');
        let substring = this.fields.substring(startIndex, endIndex + 1);
        let fields = this.fields;
        if(substring){
            this.hasChildRecords = true;
            fields = this.fields.replaceAll(substring, '');
            const queryElements = substring.split('FROM ');
            const leftSide = queryElements[0];
            const rightSide = queryElements[1].replaceAll(')', ' ');
            const end = rightSide.indexOf(' ');
            const childFields = leftSide.replaceAll(' ', '').substring(7);
            this.childSObjectApiName = rightSide.substring(0, end);
            const childCols = childFields.split(',').map(field => {
                return {
                    label: field,
                    fieldName: field,
                }
            });
            this.childColumns = childCols;
        }
        const columns = fields.replaceAll(' ', '').replaceAll(',,', ',').split(',').map(field => {
            
            let isParentReference = field.includes('.');
            return {
                label: field,
                fieldName: isParentReference ? field.split('.').join(''): field,
                parentRef: isParentReference
            }
        });
        this.columns = columns;
    }
}