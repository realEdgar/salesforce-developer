public with sharing class UtilityClass {
    public static Map<String, String> getAssignedPermissionSets(String userId){
        if(String.isBlank(userId)){
            return null;
        }
        
        Map<String, String> assignedPermissionSets = new Map<String, String>();

        List<PermissionSetAssignment> assignments = [
            SELECT PermissionSetId, PermissionSet.Name, PermissionSet.Label
            FROM PermissionSetAssignment
            WHERE AssigneeId = :userId
            AND PermissionSet.IsOwnedByProfile = false
        ];
        
        for (PermissionSetAssignment assignment : assignments) {
            assignedPermissionSets.put(assignment.PermissionSet.Name, assignment.PermissionSet.Label);
        }
        
        return assignedPermissionSets;
    }
    public static String deleteData(String sObjectApiName, Integer quantity){
        if(String.isBlank(sObjectApiName)) { return null; }
        if(quantity == null) { return null; }
        
        String output = '';
        String query = 'SELECT ID FROM ' + sObjectApiName + ' LIMIT ' + quantity;

        try {
            List<SObject> result = Database.query(query);
            delete result;
            output = 'Records deleted ' + result.size();
        } catch(Exception error){
            output = 'Error trying to delete records...';
            System.debug(error.getMessage());
        }
        return output;
    }
}