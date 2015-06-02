/*global $j,require,psData,_,parseFloat*/
(function() {
    'use strict';
    $j('.box-round').html($j('#loading-template').html()); //Show loading image.
    var headHtml = $j($j('#head-scripts-template').html());
    var headSelect = $j('head');
    headSelect.append(headHtml);

    require(['underscore'], function () {

        // Create grades objects that store all grades data for that course in the same object.
        function normalizeGrades(grades) {
            var normalGrades = [];

            // Return true if two classes are the same but take place in a different quarter/term/etc.
            function classEquals(courseA, courseB) {
                return ((courseA.gradeLevel === courseB.gradeLevel) &&
                    (courseA.courseName === courseB.courseName) &&
                    (courseA.yearTerm === courseB.yearTerm))
            }

            _.each(grades, function(grade, index) {

                if (index > 0 && classEquals(grade, normalGrades[normalGrades.length - 1])) {
                    var lastNormalGrade = normalGrades[normalGrades.length - 1];
                    lastNormalGrade[grade.storeCode] = {"grade": grade.grade, "frn": grade.frn}; //Modify the last element in normalGrades to contain the grade from this term.

                    lastNormalGrade.earnedCourseHours = parseFloat(lastNormalGrade.earnedCourseHours, 10) + parseFloat(grade.earnedCourseHours, 10);
                } else {
                    grade[grade.storeCode] = {"grade": grade.grade, "frn": grade.frn}; //Create new element in grade object whose key is the storeCode, and value is grade.
                    normalGrades.push(grade);

                }
            });
            return normalGrades;
        }

        var yearsAttendedWithGradesUri = '/admin/students/JSON/sqlYearsAttendedWithGrades.html?curstudid=' + psData.curStudId;
        var gradesUri;
        var mostRecentGradeYear;

        // Handle tabs
        $j.get(yearsAttendedWithGradesUri, function (data) {
            var jsonData = JSON.parse(data);
            jsonData.splice(-1, 1); //Last element will always be empty, so remove it.
            if (jsonData.length >= 1) {
                mostRecentGradeYear = jsonData[0].yearId;
            }
            var template = $j('#tabs-template').html();
            var renderedTemplate = _.template(template, {tabs: jsonData});
            $j(renderedTemplate).insertBefore('.box-round');

            var storeCodeUri;

            // If year gpv is set to all, show all grades for every year that the student is enrolled.
            if (psData.yearId == 'all') {
                gradesUri = '/admin/students/JSON/sqlPreviousGrades.html?curstudid=' + psData.curStudId;
                storeCodeUri = '/admin/students/JSON/sqlAllStoreCodes.html?curstudid=' + psData.curStudId;

                // If the yearid gpv isn't blank (and not set to all), display that year's grades
            } else if (psData.yearId != '') {
                gradesUri = '/admin/students/JSON/sqlPreviousGrades.html?curstudid=' + psData.curStudId + '&yearid=' + psData.yearId;
                storeCodeUri = '/admin/students/JSON/sqlStoreCodePerYear.html?curstudid=' + psData.curStudId + '&yearid=' + psData.yearId;
            }

            // year gpv is blank, so use most recent year that has grades.
            else {
                gradesUri = '/admin/students/JSON/sqlPreviousGrades.html?curstudid=' + psData.curStudId + '&yearid=' + mostRecentGradeYear;
                storeCodeUri = '/admin/students/JSON/sqlStoreCodePerYear.html?curstudid='  + psData.curStudId + '&yearid=' + mostRecentGradeYear;
            }

            // Handle table
            $j.get(gradesUri, function (gradesData) {
                var jsonGradesData = JSON.parse(gradesData);
                jsonGradesData.splice(-1, 1);

                // Create grades objects that store all grades data for that course in the same object.
                var normalizedGrades = normalizeGrades(jsonGradesData);
                $j.get(storeCodeUri, function (storeCodeData) {
                    var jsonCodeData = JSON.parse(storeCodeData);
                    jsonCodeData.splice(-1, 1);

                    var template = $j('#table-template').html();
                    var context = {
                        rows: normalizedGrades,
                        storeCodes: jsonCodeData
                    };
                    var renderedTemplate = _.template(template, context);
                    $j('.box-round').html(renderedTemplate); //insert new table

                    $j.fn.dataTableExt.afnSortData['dom-text'] = function ( oSettings, iColumn ) {
                        var nodes = oSettings.oApi._fnGetTrNodes(oSettings);
                        nodes = $j.map(nodes, function (tr, i) {
                            return $j('td:eq(' + iColumn + ')', tr).text();
                        });
                        return nodes;
                    };

                    // Set first n columns that aren't using custom sorting functions,
                    // n being the number of columns before the storeCodes columns begin.
                    var columns = [null, null, null, null, null, null];
                    _.each(jsonCodeData, function(){
                        columns.push({ "sSortDataType": "dom-text" });
                    });
                    $j('#grades-table').dataTable({
                        "aoColumns": columns,
                        "bProcessing": true,
                        "bPaginate": false,
                        "bFilter": true,
                        "bJQueryUI": true
                    });
                });
            });
        });
    });
}());