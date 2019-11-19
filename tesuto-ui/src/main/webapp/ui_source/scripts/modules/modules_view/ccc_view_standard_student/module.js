/*-------------------------------------------------------------------------------
# Copyright © 2019 by California Community Colleges Chancellor's Office
# 
# Licensed under the Apache License, Version 2.0 (the "License"); you may not
# use this file except in compliance with the License.  You may obtain a copy
# of the License at
# 
#   http://www.apache.org/licenses/LICENSE-2.0
# 
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
# WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  See the
# License for the specific language governing permissions and limitations under
# the License.
#------------------------------------------------------------------------------*/
// SESSION_CONFIGS : assume the jsp loaded some values into a global sessionConfigs object to be turned into a constant later
var sessionConfigs = sessionConfigs || {};

(function () {

    /*========== ENTRY POINT ON DOCUMENT READY FROM THE MAIN TEMPLATE ============*/

    angular.module('CCC.View.Student', [

        // framework dependencies
        'CCC.Assess',

        // standard view common utils, directives, configuration
        'CCC.Components',
        'CCC.View.Layout',
        'CCC.View.Common',

        // Server API modules
        'CCC.API.FakeData',
        'CCC.API.Activations',
        'CCC.API.ActivationSearch',
        'CCC.API.AssessmentSessions',
        'CCC.API.AssessmentMetadata',
        'CCC.API.Students',
        'CCC.API.TestLocations',
        'CCC.API.Placement',
        'CCC.API.SubjectAreas',
        'CCC.API.PlacementColleges',
        'CCC.API.CollegeSubjectAreas',

        // Common Modules
        'CCC.Activations',
        'CCC.Placement'
    ]);


    /*======================== LOAD VALUES/CONSTANTS ========================*/

    angular.module('CCC.View.Student').constant('ASSESSMENTS_DISABLED', sessionConfigs.disableAssessments);
    angular.module('CCC.View.Student').constant('PLACEMENTS_DISABLED', sessionConfigs.disablePlacements);


    /*======================== LOAD CONFIGURATIONS ========================*/

    // INTERNATIONALIZATION CONFIGS
    // Each view will need to load it's own i18n files
    // 1) Global for all of CCC Assess
    // 2) Global for all of CCC Assess components
    // 3) Custom for the view specific phrases or standard view phrases
    angular.module('CCC.View.Student').config([

        'TranslateFileServiceProvider',
        '$translateProvider',

        function (TranslateFileServiceProvider, $translateProvider) {

            // push in files needed within this module
            TranslateFileServiceProvider.addTranslateFile({
                prefix: 'ui/scripts/modules/modules_view/ccc_view_standard_student/i18n/locale-',
                suffix: '.json'
            });

            // now fetch all registered i18n files from all dependent modules
            $translateProvider.useStaticFilesLoader({
                files: TranslateFileServiceProvider.getTranslateFiles()
            });

            // lastly configure language preferences
            $translateProvider.preferredLanguage('en');
            $translateProvider.fallbackLanguage('en');
        }
    ]);


    /*======================== INITIALIZATION ========================*/

    // some tweaks to the route changing in the UI
    angular.module('CCC.View.Student').run([

        '$rootScope',
        '$state',
        'CurrentStudentService',

        function ($rootScope, $state, CurrentStudentService) {

            // jump into the state change hooks
            $rootScope.$on("$stateChangeStart", function (event, nextRoute, currentRoute) {

                // here we make sure that the user is logged in, other wise we send them to the login page
                if (!CurrentStudentService.getStudent().cccId && nextRoute.name !== "login") {
                    event.preventDefault();
                    $state.go('login');
                    return;
                }
            });
        }
    ]);

    // setting the footer directive
    angular.module('CCC.View.Student').run([

        'ViewManagerEntity',

        function (ViewManagerEntity) {

            ViewManagerEntity.setFooterDirective('ccc-view-common-footer');
        }
    ]);

    // disable idle timeout
    angular.module('CCC.View.Student').run([

        'Idle',

        function (Idle) {
            // we disable idle auto logging out for students so they can take long assessments in another window without losing their session
            // todo: maybe use localStorage and storageEvents api to communicate activity and refresh the idel timeout across tabs
            Idle.unwatch();
        }
    ]);

})();
