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
    this.loadData();
    this.setEventHandlers();
    $("#" + this.mainDescriptionLabelId).text(chrome.i18n.getMessage("options_main_description"));
}
OptionPage.prototype.loadData = function () {
    this.NumberOfSeconds = localStorage["num_of_sec"] != undefined ? localStorage["num_of_sec"] : 3;
    $("#" + this.numberOfSecondsLabelId).attr('value', this.NumberOfSeconds);
};
OptionPage.prototype.setEventHandlers = function () {
    var that = this;
    $("#" + this.saveButtonId).click(function () {
        var tst = $("#" + that.numberOfSecondsLabelId).attr('value');
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
        numberOfSecondsLabelId: 'num_of_sec',
        saveButtonId: 'save_button',
        clearButtonId: 'clear_button'
    };
    var optionsPage = new OptionPage(settingsObject);
});