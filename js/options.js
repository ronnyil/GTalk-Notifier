//Takes an object with the following properties:
//successLabelId
//mainDescriptionLabelId
//numberOfSecondsLabelId
//saveButtonId
//clearButtonId
function OptionPage(settingsObject) {
    this.successLabelId = settingsObject.successLabelId;
    this.mainDescriptionLabelId = settingsObject.mainDescriptionLabelId;
    this.numberOfSecondsLabelId = settingsObject.numberOfSecondsLabelId;
    this.saveButtonId = settingsObject.saveButtonId;
    this.clearButtonId = settingsObject.clearButtonId;
	this.numberOfSecondsInputId = settingsObject.numberOfSecondsInputId;
    this.loadData();
    this.setEventHandlers();
    $("#" + this.mainDescriptionLabelId).text(chrome.i18n.getMessage("options_main_description"));
	$("#" + this.numberOfSecondsLabelId).text(chrome.i18n.getMessage("numberOfSeconds"));
}
OptionPage.prototype.loadData = function () {
    this.NumberOfSeconds = localStorage["num_of_sec"] != undefined ? localStorage["num_of_sec"] : 3;
    $("#" + this.numberOfSecondsInputId).attr('value', this.NumberOfSeconds);
};
OptionPage.prototype.setEventHandlers = function () {
    var that = this;
    $("#" + this.saveButtonId).click(function () {
        var tst = $("#" + that.numberOfSecondsInputId).attr('value');
        if (tst != '') {
            localStorage["num_of_sec"] = parseInt(tst);
            $("#" + that.successLabelId).text("Your settings were succesfully saved! This window will now close");
            setTimeout(function () { window.close(); }, 1250);
        }
    });
    $("#" + this.clearButtonId).click(function () {
        that.loadData();
    });
    
};
$(document).ready(function () {
    var settingsObject = {
        successLabelId: 'successLabel',
        mainDescriptionLabelId: 'main_explanation',
        numberOfSecondsInputId: 'num_of_sec',
        saveButtonId: 'save_button',
        clearButtonId: 'clear_button',
		numberOfSecondsLabelId: 'num_of_sec_label'
    };
    var optionsPage = new OptionPage(settingsObject);
});