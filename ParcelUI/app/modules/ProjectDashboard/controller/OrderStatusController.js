angular.module('ProjectDashboard').controller('OrderStatus', ['$scope', '$state', '$stateParams', 'projectDashboardOperations', '$window', '$timeout', 'checkStatus', function ($scope, $state, $stateParams, projectDashboardOperations, $window, $timeout, checkStatus) {

	var self = this;
	self.accountGuid = $stateParams.accountGuid;
	self.projectGuid = $stateParams.projectGuid;
	self.reportGuid = $stateParams.reportGuid;
	self.showAlert = false;
	self.showOrderGrid = true;
	self.isFromSetupTab = false;

	init();

	function init() {
		self.edrOrderListArr = [];
		var currentRouteObj = $state.current;
		if (currentRouteObj.name === 'generalInformation' || currentRouteObj.name === 'ReportAuthoring.Setup' || currentRouteObj.name === "ReportAuthoring.Write") {
			self.projectOrders = false;
			getReportOrderData();
		} else {
			self.projectName = $stateParams.projectName;
			self.projectOrders = true;
			getProjectOrderData();
		}

		if (currentRouteObj.name === 'ReportAuthoring.Setup') self.isFromSetupTab = true;
	}

	self.closeOrderwindow = function () {
		$window.close();
	}

	function createDataTable() {
		$('#orderStatusDatatable').DataTable({
			order: [],
			dom: 't',
			processing: true,
			paging: false,
			info: false,
			filter: false,
			stateSave: true,
			columnDefs: [
				{
					orderable: false,
					targets: [4, 5, 6, 7, 8, 9, 10, 11]
                }

            ]
		});

	}


	function getProjectOrderData() {
		$scope.delay = 0;
		$scope.minDuration = 0;
		$scope.message = 'Please Wait...';
		$scope.backdrop = true;
		$scope.promise = projectDashboardOperations.getProjectOrderList(self.projectGuid).then(function (result) {
			if (result.status != undefined && checkStatus.checkCodeInStatusArray(result.status, 'GET')) {
				self.showAlert = true;
				self.serviceMessage = result.data.message === undefined ? "Something went wrong !!" : result.data.message.userMessage;
				addClassToAlertHtml("error");

			} else if (angular.isArray(result.orders)) {
				angular.forEach(result.orders, function (singleOrder) {
					if (angular.isArray(singleOrder.properties)) {
						createOrderArray(singleOrder);
					}
				})
				$timeout(function () {
					createDataTable();
					$('[data-toggle="popover"]').popover();
				}, 1000);
			} else {
				self.showAlert = true;
				self.serviceMessage = "Something went wrong !!";
				addClassToAlertHtml("error");
			}
		});
	}

	function createOrderArray(data) {
		for (var i = 0; i < data.properties.length; i++) {
			var edrOrderListObj = {
				"orderGuid": data.orderGuid,
				"address": "",
				"inquiryNo": "",
				"status": "",
				"packageOrdered": "",
				"radiusMapReportWithGeocheck": "",
				"radiusMapReport": "",
				"sanbornMap": "",
				"cityDirectoryAbstract": "",
				"aerialPhotoDecadePackage": "",
				"historicalTopMmap": "",
				"lienSearch": "",
				"action": {
					displayLink: false,
					linkText: "",
					tooltip: ""
				}
			};

			edrOrderListObj.address = (data.properties[i].address != "" && data.properties[i].address != undefined && data.properties[i].address != null) ? data.properties[i].address : "";
			edrOrderListObj.inquiryNo = (data.properties[i].reports[0].inquiryNumber != "" && data.properties[i].reports[0].inquiryNumber != undefined && data.properties[i].reports[0].inquiryNumber != null) ? data.properties[i].reports[0].inquiryNumber : "";

			edrOrderListObj.status = data.orderStatus ? data.orderStatus : "";
			edrOrderListObj.action.displayLink = false;

			if (edrOrderListObj.status) {
				switch (edrOrderListObj.status.toLowerCase()) {
				case 'cancelled':
					edrOrderListObj.action.displayLink = false;
					break;

				case 'neworder':
					edrOrderListObj.action.displayLink = true;
					edrOrderListObj.action.tooltip = 'Click here to complete the order process.';
					edrOrderListObj.action.linkText = 'Finish Order';
					break;

				case 'webpostponed':
					edrOrderListObj.action.displayLink = true;
					edrOrderListObj.action.tooltip = 'Click here to get preliminary maps and unpostpone your order.';
					edrOrderListObj.action.linkText = 'Prelim. Maps/ Unpostpone';
					break;

				case 'webproduced':
					edrOrderListObj.action.displayLink = true;
					edrOrderListObj.action.tooltip = 'Click here to retrieve preliminary map reports.';
					edrOrderListObj.action.linkText = 'Show EDR Status Page';
					break;

				default:
					edrOrderListObj.action.displayLink = true;
					edrOrderListObj.action.tooltip = 'Click here to get preliminary maps and order reworks.';
					edrOrderListObj.action.linkText = 'Show EDR Status Page';
					break;
				}
			}

			edrOrderListObj.packageOrdered = (data.properties[i].reports[0].packageName != "" && data.properties[i].reports[0].packageName != undefined && data.properties[i].reports[0].packageName != null) ? data.properties[i].reports[0].packageName : "";
			edrOrderListObj.radiusMapReportWithGeocheck = (data.properties[i].radiusMapReportWithGeoCheck != "" && data.properties[i].radiusMapReportWithGeoCheck != undefined && data.properties[i].radiusMapReportWithGeoCheck != null) ? data.properties[i].radiusMapReportWithGeoCheck : "";
			edrOrderListObj.radiusMapReport = (data.properties[i].radiusMapReport != "" && data.properties[i].radiusMapReport != undefined && data.properties[i].radiusMapReport != null) ? data.properties[i].radiusMapReport : "";
			edrOrderListObj.sanbornMap = (data.properties[i].sanbornMapSearch != "" && data.properties[i].sanbornMapSearch != undefined && data.properties[i].sanbornMapSearch != null) ? data.properties[i].sanbornMapSearch : "";
			edrOrderListObj.cityDirectoryAbstract = (data.properties[i].cityDirectoryAbstract != "" && data.properties[i].cityDirectoryAbstract != undefined && data.properties[i].cityDirectoryAbstract != null) ? data.properties[i].cityDirectoryAbstract : "";
			edrOrderListObj.aerialPhotoDecadePackage = (data.properties[i].aerialPhotoDecadePackage != "" && data.properties[i].aerialPhotoDecadePackage != undefined && data.properties[i].aerialPhotoDecadePackage != null) ? data.properties[i].aerialPhotoDecadePackage : "";
			edrOrderListObj.historicalTopMmap = (data.properties[i].historicalTopoMap != "" && data.properties[i].historicalTopoMap != undefined && data.properties[i].historicalTopoMap != null) ? data.properties[i].historicalTopoMap : "";
			edrOrderListObj.lienSearch = (data.properties[i].lienSearch != "" && data.properties[i].lienSearch != undefined && data.properties[i].lienSearch != null) ? data.properties[i].lienSearch : "";

			self.edrOrderListArr.push(edrOrderListObj);
		}
	}

	function getReportOrderData() {
		$scope.delay = 0;
		$scope.minDuration = 0;
		$scope.message = 'Please Wait...';
		$scope.backdrop = true;
		$scope.promise = projectDashboardOperations.getReportOrderList(self.reportGuid).then(function (data) {
			if (data.status != undefined && checkStatus.checkCodeInStatusArray(data.status, 'GET')) {
				self.showAlert = true;
				self.serviceMessage = data.data.message.userMessage;
				addClassToAlertHtml("error");
			} else if (data.orders && data.orders.length) {
				if ($scope.$parent.$parent.$parent.generalInformationForm != undefined) {
					$scope.$parent.$parent.$parent.generalInformationForm.isOrderAvailable = true;
				}

				if ($scope.$parent.$parent.isOrderAvailable != undefined) {
					$scope.$parent.$parent.isOrderAvailable = true;
				}

				angular.forEach(data.orders, function (order, index) {
					createOrderArray(order);
				});

				$timeout(function () {
					createDataTable();
					$('[data-toggle="popover"]').popover();
				}, 1000);
			} else {
				self.showOrderGrid = false;
			}
		});
	}

	self.showEDRStatusPage = function (edrOrderObj) {
		var promise = projectDashboardOperations.geEDRStatusPage(edrOrderObj.orderGuid);
		promise.then(function (data) {
			$window.open(data.transferURL, '_blank');
		});
	}

	function addClassToAlertHtml(status) {
		if (status === "success") {
			angular.element('#alertOrderStatusMsgDiv').addClass('alert-success');
			angular.element('#alertOrderStatusMsgDiv').removeClass('alert-danger');
		} else {
			angular.element('#alertOrderStatusMsgDiv').removeClass('alert-success');
			angular.element('#alertOrderStatusMsgDiv').addClass('alert-danger');
		}
	}
 }])