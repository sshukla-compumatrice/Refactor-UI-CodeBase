/*
angular.module("ReportAuthoring").filter("selectableLanguages", [function () {
    return function (collection) {
        if (!collection || !collection.length) return null;

        var out = [];
        for (var i = 0; i < collection.length; i++) {
            var item = collection[i];
            if (item.category && (item.category != "Instructions" || (item.category == "Instructions" && !item.showInPage))) {
                out.push(item);
            }
        }

        return out;
    };
}])
*/

angular.module("ReportAuthoring").filter("selectableLanguages", [function () {
    return function (collection) {
        if (!collection || !collection.length) return null;

        var out = [];
        for (var i = 0; i < collection.length; i++) {
            var item = collection[i];
             if (item.category && (item.category != "Instructions" || (item.category == "Instructions" && !item.showInPage))) {
                out.push(item);
            }
        }

        return out;
    };
}])



