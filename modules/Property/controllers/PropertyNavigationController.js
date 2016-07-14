angular.module('PropertyModule').controller('PropertyNavCtrl', ['navLinks', '$log', 'PropertyResources', '$state','$stateParams', function (navLinks, $log, PropertyResources, $state,$stateParams) {

    var PropertyNavControllerLogger = $log.getInstance('propertynavigation');

    PropertyNavControllerLogger.info(PropertyResources.navcontroller);
    
   this.propertyAddress = "Sample data";
   this.propertyCity = "Sample data";
   this.propertyState = "Sample data";
   this.propertyZip = "Sample data";

    this.links = navLinks;

    this.ChangePropView = function (link) {

        switch (link.featureID) {

            case 181:
                $state.go('Property.Environmental');
                break;
            case 182:
                $state.go('Property.Engineering');
                break;
            case 183:
                $state.go('Property.Valuation');
                break;
            case 184:
                $state.go('Property.AdditionalServices');
                break;
            case 185:
                $state.go('Property.InspectionServices');
                break;
            case 186:
                $state.go('Property.ReportStatus');
                break;
            case 187:
                $state.go('Property.FileManager');
                break;

            default:
                $state.go('Property.Overview');
        }

    }

}]);
