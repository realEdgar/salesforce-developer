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
}