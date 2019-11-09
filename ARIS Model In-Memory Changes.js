/*
@author
Nikita Martyanov 
mailto: nikita.martyanov@gmail.com
https://kitmarty.github.io
***************************************************
ARIS In-Memory Changes

Context: Model
Output Formats: DOC
*/

//System Object with common variables
var System = {
    loc: Context.getSelectedLanguage(),
    filter: ArisData.ActiveFilter(),
    db: ArisData.getActiveDatabase(),
    servername: ArisData.getActiveDatabase().ServerName()
}

//Report object
var Report = {
    oOutput: null,
    init: function(){
        ArisData.Save(Constants.SAVE_ONDEMAND)
        oOutput = Context.createOutputObject();
        oOutput.BeginSection(297, 210, 10, 10, 20, 20, 20, 20, false, Constants.SECTION_DEFAULT);
        oOutput.DefineF("text_simple", "Arial", 12, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT, 0, 0, 0, 0, 0, 0);
    },
    write: function(){
        oOutput.WriteReport();
        ArisData.Save(Constants.SAVE_AUTO)
    },
    insertModel: function(modelImage){
        oOutput.OutGraphic(modelImage, -1, 190, 200);
        this.println("");
    },
    println: function(text){
        oOutput.OutputLnF(text, "text_simple");
    },
    newPage: function(){
        oOutput.OutputField(Constants.FIELD_NEWPAGE, "Arial", 12, Constants.C_BLACK, Constants.C_TRANSPARENT, Constants.FMT_LEFT)
    }
}

//Model object
function modelObject(model) {
    this.model = model;
    this.graphic = function() {
        return this.model.Graphic(false, false, System.loc);
    }
    this.filterByOccList = function(listOcc) {
        for (var i=0; i<listOcc.length; i++)
            model.deleteOcc(listOcc[i], false);
    }
    this.filterByObjType = function(listType) {
        var occList = this.model.ObjOccList();
        for (var i=0; i<occList.length; i++)
            if (listType.indexOf(occList[i].ObjDef().TypeNum())!=-1)
                model.deleteOcc(occList[i], false);
    }
}

function main(){
    Report.init();
    
    Report.println("ARIS Model In-Memory Changes");
    Report.println("LOCAL Server; Version 98.8.0.1155162");
    Report.println("");
    
    model = new modelObject(ArisData.getSelectedModels()[0]);
    
    //output source model
    Report.println("Source model");
    Report.insertModel(model.graphic());
    
    //model's filtering: hiding all additional information (information carriers, roles, etc),
    //leaving only main process graph
    Report.newPage();
    Report.println("Target model");
    model.filterByObjType([Constants.OT_INFO_CARR, Constants.OT_PERS_TYPE, Constants.OT_APPL_SYS_TYPE]);
    Report.insertModel(model.graphic());
    
    Report.write();
}

main();