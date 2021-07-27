import { __awaiter, __extends, __generator } from "tslib";
import defaults from 'lodash/defaults';
import { isUndefined, isString } from 'lodash';
import { DataSourceApi, MutableDataFrame, FieldType, } from '@grafana/data';
import { getTemplateSrv } from '@grafana/runtime';
import { defaultQuery } from './types';
var DataSource = /** @class */ (function (_super) {
    __extends(DataSource, _super);
    function DataSource(instanceSettings, backendSrv) {
        var _this = _super.call(this, instanceSettings) || this;
        _this.apiPath = '/api/v1/';
        _this.getTemplateVariable = function (name, scopedVars) {
            var template = '${' + name + '}';
            var var_value = getTemplateSrv().replace(template, scopedVars);
            return var_value === template ? '' : var_value;
        };
        _this.isEmptyOrUndefined = function (input_string) {
            return input_string === '' || isUndefined(input_string);
        };
        _this.transpose = function (a) {
            // Calculate the width and height of the Array
            var w = a.length || 0;
            var h = a[0] instanceof Array ? a[0].length : 0;
            // In case it is a zero matrix, no transpose routine needed.
            if (h === 0 || w === 0) {
                return [];
            }
            var t;
            t = [];
            t.length = 0;
            // Loop through every item in the outer array (height)
            for (var i = 0; i < h; i++) {
                // Insert a new row (array)
                t.push([]);
                // Loop through every item per item in outer array (width)
                for (var j = 0; j < w; j++) {
                    // Save transposed data.
                    t[i][j] = a[j][i];
                }
            }
            return t;
        };
        _this.customerId = instanceSettings.jsonData.customerId || '';
        _this.baseURL = (instanceSettings.jsonData.serverURL || 'http://localhost:6080');
        _this.apiKey = instanceSettings.jsonData.apiKey || '';
        _this.apiKeyConfigured = instanceSettings.jsonData.apiKeyConfigured;
        _this.apiURL = "" + _this.baseURL + _this.apiPath + _this.customerId;
        _this.backendSrv = backendSrv;
        // Initialise template variables
        _this.template_location = '';
        _this.template_asset = '';
        _this.template_value = '';
        return _this;
    }
    DataSource.prototype.query = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var range, from, to, from_ISO, to_ISO, resultArray, datapoints, columnNames, data;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        range = options.range;
                        from = range.from.valueOf();
                        to = range.to.valueOf();
                        from_ISO = new Date(from).toISOString();
                        to_ISO = new Date(to).toISOString();
                        // Template variables
                        this.template_location = this.getTemplateVariable('location', options.scopedVars);
                        this.template_asset = this.getTemplateVariable('asset', options.scopedVars);
                        this.template_value = this.getTemplateVariable('value', options.scopedVars);
                        return [4 /*yield*/, this.getDatapoints(from_ISO, to_ISO, options.targets)];
                    case 1:
                        resultArray = _a.sent();
                        datapoints = resultArray.datapoints;
                        columnNames = resultArray.columnNames;
                        data = options.targets.map(function (target, queryIndex) {
                            var query = defaults(target, defaultQuery);
                            // Return and emtpy frame if no location, asset or value has been specificied
                            var frame = new MutableDataFrame({
                                refId: query.refId,
                                fields: [],
                            });
                            if (_this.isEmptyOrUndefined(query.location.label)) {
                                return frame;
                            }
                            if (_this.isEmptyOrUndefined(query.asset.label)) {
                                return frame;
                            }
                            if (_this.isEmptyOrUndefined(query.value.label)) {
                                return frame;
                            }
                            // Handle empty arrays
                            if (isUndefined(datapoints[queryIndex])) {
                                return frame;
                            }
                            // Turn rows into fields if defined by user
                            if (query.labelsField !== undefined && query.labelsField !== '') {
                                var fieldNameIndex_1 = columnNames[queryIndex].indexOf(query.labelsField);
                                if (fieldNameIndex_1 === -1) {
                                    console.error("ERROR: Column " + query.labelsField + " not found. Using default format.");
                                }
                                else {
                                    // This are the new column names
                                    var newColumnNames = datapoints[queryIndex][fieldNameIndex_1];
                                    // Filter out the column names from the table and transpose it for easier assignment
                                    var newDatapoints_1 = _this.transpose(datapoints[queryIndex].filter(function (element, eIndex) {
                                        return eIndex !== fieldNameIndex_1;
                                    }));
                                    // Create a new field with the corresponding data
                                    newColumnNames.map(function (columnName, columnIndex) {
                                        frame.addField({
                                            name: columnName.toString(),
                                            type: FieldType.number,
                                            values: newDatapoints_1[columnIndex],
                                        });
                                    });
                                    return frame;
                                }
                            }
                            // If no label column was specified, handle the incoming data with the
                            // defined data model structure:
                            // { columnNames: string[], datapoints: any[][] }
                            columnNames[queryIndex].map(function (columnName, columnIndex) {
                                // Look for the fixed columns
                                if (columnName === 'timestamp') {
                                    frame.addField({
                                        name: columnName,
                                        type: FieldType.time,
                                        values: datapoints[queryIndex][columnIndex],
                                    });
                                }
                                else if (columnName === 'fieldName') {
                                    // TODO Special case
                                }
                                else {
                                    // Check data type
                                    var sampleValue = datapoints[queryIndex][columnIndex][0];
                                    frame.addField({
                                        name: columnName,
                                        type: isString(sampleValue) ? FieldType.string : FieldType.number,
                                        values: datapoints[queryIndex][columnIndex],
                                    });
                                }
                            });
                            return frame;
                        });
                        return [2 /*return*/, { data: data }];
                }
            });
        });
    };
    DataSource.prototype.testDatasource = function () {
        return __awaiter(this, void 0, void 0, function () {
            var testResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        testResult = {
                            status: 'success',
                            message: 'Data source works.',
                            title: 'Success',
                        };
                        if (!this.apiKeyConfigured) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.fetchAPIRequest({
                                url: this.baseURL
                            })
                                .then(function (res) {
                                if (res === undefined || res.status !== 200 || res.data !== "online") {
                                    console.log(JSON.stringify(res));
                                    testResult.status = 'error';
                                    testResult.message = "Wrong response from server: " + res;
                                    testResult.title = "Data source connection error";
                                }
                            })
                                .catch(function (error) {
                                testResult.status = 'error';
                                testResult.message = "Caught error in datasource test: " + JSON.stringify(error);
                                testResult.title = "Data source exception";
                            })];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        testResult.status = 'error';
                        testResult.message = 'API Key not configured';
                        testResult.title = 'Invalid configuration';
                        _a.label = 3;
                    case 3: return [2 /*return*/, testResult];
                }
            });
        });
    };
    DataSource.prototype.getLocations = function (callback) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetchAPIRequest({
                        url: this.apiURL
                    }).then(function (res) {
                        callback(res.data);
                    })];
            });
        });
    };
    DataSource.prototype.getAssets = function (location, callback) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (location === '' || isUndefined(location)) {
                    return [2 /*return*/];
                }
                this
                    .fetchAPIRequest({
                    url: this.apiURL + ("/" + location),
                })
                    .then(function (res) {
                    callback(res.data);
                });
                return [2 /*return*/];
            });
        });
    };
    DataSource.prototype.getValues = function (location, asset, callback) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (location === '' || isUndefined(location)) {
                    return [2 /*return*/];
                }
                if (asset === '' || isUndefined(asset)) {
                    return [2 /*return*/];
                }
                this
                    .fetchAPIRequest({
                    url: this.apiURL + ("/" + location + "/" + asset),
                })
                    .then(function (res) {
                    callback(res.data);
                });
                return [2 /*return*/];
            });
        });
    };
    DataSource.prototype.getDatapoints = function (from, to, queries) {
        return __awaiter(this, void 0, void 0, function () {
            var datapoints, columnNames, i, parameterString, uriPathExtensionString, location_1, asset, value;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        datapoints = [];
                        columnNames = [];
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < queries.length)) return [3 /*break*/, 4];
                        parameterString = queries[i].parameterString;
                        uriPathExtensionString = queries[i].uriPathExtension;
                        location_1 = this.template_location;
                        asset = this.template_asset;
                        value = this.template_value;
                        // Define location
                        if (this.isEmptyOrUndefined(location_1)) {
                            if (queries[i] === undefined || queries[i].location === undefined) {
                                return [3 /*break*/, 3];
                            }
                            location_1 = queries[i].location.label;
                            if (this.isEmptyOrUndefined(location_1)) {
                                return [3 /*break*/, 3];
                            }
                        }
                        // Define asset
                        if (this.isEmptyOrUndefined(asset)) {
                            asset = queries[i].asset.label;
                            if (this.isEmptyOrUndefined(asset)) {
                                return [3 /*break*/, 3];
                            }
                        }
                        // Define value
                        if (this.isEmptyOrUndefined(value)) {
                            value = queries[i].value.label;
                            if (this.isEmptyOrUndefined(value)) {
                                return [3 /*break*/, 3];
                            }
                        }
                        return [4 /*yield*/, this.fetchAPIRequest({
                                url: this.apiURL + ("/" + location_1 + "/" + asset + "/" + value + uriPathExtensionString + "?from=" + from + "&to=" + to + parameterString),
                                method: 'GET',
                            })
                                .then(function (res) {
                                // Handle empty responses
                                if (res.data.datapoints === null) {
                                    return;
                                }
                                // Push datapoints
                                columnNames.push(res.data.columnNames);
                                datapoints.push(_this.transpose(res.data.datapoints));
                            })];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        i += 1;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, { datapoints: datapoints, columnNames: columnNames }];
                }
            });
        });
    };
    /// Replacement for deprecated fetchAPIRequest, using fetch api
    DataSource.prototype.fetchAPIRequest = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var b64encodedAuth;
            return __generator(this, function (_a) {
                if (options.headers === undefined) {
                    options.headers = {};
                }
                b64encodedAuth = Buffer.from(this.customerId + ":" + this.apiKey).toString('base64');
                options.headers["Authorization"] = "Basic " + b64encodedAuth;
                //console.log("Executing request with options: ", JSON.stringify(options))
                return [2 /*return*/, this.backendSrv.fetch({
                        url: options.url,
                        method: options.method || 'GET',
                        headers: options.headers
                    }).toPromise()];
            });
        });
    };
    return DataSource;
}(DataSourceApi));
export { DataSource };
//# sourceMappingURL=DataSource.js.map