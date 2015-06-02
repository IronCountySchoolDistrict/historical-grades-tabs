Thanks to Brian Andle for creating previous versions of this customization.

SETUP:
1.
    This plugin replaces the original report generated on the page web_root/admin/students/previousgrades.html with a customized report.
    Although the original report is not displayed when using this plugin, I have not yet figured out how to automatically disable the report from being generated.
    To increase the performance of the customized report you should remove the original report from previousgrades.html.

    If you open up previousgrades.html and find the section of the code that looks like:

    <!-- start of content and bounding box -->
    <div class="box-round">

        <table border="0" cellspacing="0" cellpadding="4">
            <tr align="center">
                <td><a href="previousgrades.entry.html?frn=~(studentfrn)">~[text:psx.html.admin_students.previousgrades.multiple_new_entries]</a>&nbsp;</td>
                <td><a href="newstoredgrade.html?frn=~(studentfrn)">~[text:psx.html.admin_students.previousgrades.single_new_entry]</a>&nbsp;</td>
                <td><a href="histschoolnames.html?frn=~(studentfrn)">~[text:psx.html.admin_students.previousgrades.previous_school_names]</a>&nbsp;</td>
                <td><a href="previousgrades.detail.html?frn=~(studentfrn)">~[text:psx.html.admin_students.previousgrades.detail_view]</a></td>
            </tr>
        </table>
        <table border="0" cellspacing="0" cellpadding="4" align="center" width="100%">
            <tr bgcolor="#f6f6f6">~[x:transcript]
                <td class="bold">~[text:psx.html.admin_students.previousgrades.yearterm]</td>
                <td class="bold">~[text:psx.html.admin_students.previousgrades.grd_lvl]</td>
                <td class="bold">~[text:psx.html.admin_students.previousgrades.course_number]</td>
                <td class="bold">~[text:psx.html.admin_students.previousgrades.course]</td>
                <td class="bold">~[text:psx.html.admin_students.previousgrades.earned_credit]</td>
                <td class="bold">[storecode]</td>
            </tr>
            <tr bgcolor="#edf3fe">
                <td>~(abbryearterm)</td>
                <td align="center">~(grade_level)</td>
                <td>~(course_number)</td>
                <td>~(course_name)</td>
                <td align="center">[totalearnedcredit]</td>
                <td>[lettergrade]</td>
            </tr>
        </table>
        <br>

        <div class="button-row"></div>
    </div>
    <br>
    <!-- end of content of bounding box -->

    Modify this code by removing the table tag and all of its contents. It should look like the following:

    <!-- start of content and bounding box -->
    <div class="box-round">

    </div>
    <br>
    <!-- end of content of bounding box -->

    This will prevent the original report from being generated.

2.
    One of the columns in the grades table uses a custom localization key. This must be imported into the database or you will see one of the columns displayed as "String key not found!"