angular.module('ParcelUI').filter('nfcurrency', ['$filter', '$locale', function ($filter, $locale) {
    var currency = $filter('currency'),
        formats = $locale.NUMBER_FORMATS;
    return function (amount, symbol) {
        var value = currency(amount, symbol);
        return value.replace(new RegExp('\\' + formats.DECIMAL_SEP + '\\d{2}'), '')
    }
 }]);

angular.module('ParcelUI').filter('formatSize', function () {
    return function (kbytes, precision) {
        if (isNaN(parseFloat(kbytes)) || !isFinite(kbytes)) return '';
        if (typeof precision === 'undefined') precision = 1;
        var k = 1024;
        if (kbytes == 0) return '0 B';
        if (kbytes < 1) {
            return (kbytes * k) + ' B';
        }
        var units = ['KB', 'MB', 'GB', 'TB', 'PB'],
            number = Math.floor(Math.log(kbytes) / Math.log(k));
        return (kbytes / Math.pow(k, Math.floor(number))).toFixed(precision) + ' ' + units[number];
    }
});

angular.module('ParcelUI').filter('formatBytes', function () {
    return function (bytes, precision) {
        if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '';
        if (typeof precision === 'undefined') precision = 1;
        var k = 1024;
        if (bytes == 0) return '0 Byte';
        var units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'],
            number = Math.floor(Math.log(bytes) / Math.log(k));
        return (bytes / Math.pow(k, Math.floor(number))).toFixed(precision) + ' ' + units[number];
    }
});