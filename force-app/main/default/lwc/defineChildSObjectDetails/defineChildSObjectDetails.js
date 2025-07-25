import { LightningElement, api, wire } from 'lwc';
import { getObjectInfo, getObjectInfos } from 'lightning/uiObjectInfoApi';

const COLS_CHILDRELATED = [
    { label: 'Child Object', fieldName: 'childObjectApiName', type: 'text' },
    { label: 'Field Api Name', fieldName: 'fieldName', type: 'text' },
    { label: 'Relationship Name', fieldName: 'relationshipName', type: 'text' },
];

export default class DefineChildSObjectDetails extends LightningElement {
    @api selectedSObject;
    isLoading = true;

    childObjectsColumns = COLS_CHILDRELATED;
    initChildObjects = [];
    sOjectDetails = [];

    allChildObjects = [];
    validChildObjects = [];

    @wire(getObjectInfo, { objectApiName: '$selectedSObject'})
    handleSelectedObjectInfo({ error, data }){
        if(data){
            this.mainSObjectInfo = data;
            console.log(data);
            const allChilds = data.childRelationships.map(child => child.childObjectApiName);
            this.allChildObjects = allChilds;
            this.initChildObjects = data.childRelationships;
        } else if(error){
            console.error(error);
        }
    }

    @wire(getObjectInfos, { objectApiNames: '$allChildObjects'})
    handleSelectedObjectInfos({ error, data }){
        if(data){
            const validChildObjs = [];
            for(let result of data.results){
                if(result.statusCode === 200){
                    if(result.result.createable && result.result.updateable && result.result.deletable && result.result.layoutable && result.result.queryable){
                        validChildObjs.push({
                            apiName: result.result.apiName,
                            nameField: result.result.nameFields
                        });
                    }
                }
            }
            
            const filteredChildObjs = this.initChildObjects.filter(obj => {
                return validChildObjs.map(valid => valid.apiName).includes(obj.childObjectApiName)
            }).map(obj => {
                const newObj = { ...obj }
                newObj.nameFields = validChildObjs.find(valid => obj.childObjectApiName === valid.apiName).nameField;

                return newObj;
            });
            this.sOjectDetails = filteredChildObjs;
            this.isLoading = false;
        } else if(error){
            console.error(error);
        }
    }
    handleRowSelection(event){
        const selectedRow = event.detail.selectedRows.map(row => {
            return {
                childObjectApiName: row.childObjectApiName,
                fieldName: row.fieldName,
                relationshipName: row.relationshipName,
                asQuery: `SELECT Id, ${row.fieldName},  FROM ${row.childObjectApiName}`,
                asSubquery: `(SELECT Id, ${row.fieldName}, ${row.nameFields.join(', ')} FROM ${row.relationshipName})`
            }
        });
        const selectedChilds = new CustomEvent('selectedchilds', {
            detail: {
                fields: selectedRow.map(row => row.asSubquery)
            }
        });

        this.dispatchEvent(selectedChilds);
    }
}