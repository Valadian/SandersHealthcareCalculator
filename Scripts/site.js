function clamp(num, min, max) {
  return num < min ? min : num > max && max!=null ? max : num;
}
function formatCurrency(value){
    return "$ "+value.toFixed(0).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
}

$(function(){
    // Share icons
    $('#facebook').sharrre({
      share: {
        facebook: true
      },
      enableHover: false,
      enableTracking: true,
      click: function(api, options){
        api.simulateClick();
        api.openPopup('facebook');
      }
    });
    
    // data-toggle tooltip
    $('[data-toggle="tooltip"]').tooltip()

    ko.options.deferUpdates = true;
	$('form').validate({
        rules: {},
        highlight: function(element) {
            $(element).closest('.form-group').addClass('has-error');
        },
        unhighlight: function(element) {
            $(element).closest('.form-group').removeClass('has-error');
        },
        errorElement: 'span',
        errorClass: 'help-block',
        errorPlacement: function(error, element) {
            if(element.parent('.input-group').length) {
                error.insertAfter(element.parent());
            } else {
                error.insertAfter(element);
            }
        }
    });
	jQuery.validator.addClassRules("currency",{
		number: true,
		min: 0
	});
	jQuery.validator.addClassRules("naturalNumber",{
		digits: true,
		min: 0
	});

	$(window).scroll(function(){
	    if($(window).scrollTop() > $('.savings-spaceholder').offset().top - $('.navbar').height()){
	        $('.savings-container').addClass("floating");
	        $('.savings-container').css(
	            { 'width':$('.savings-spaceholder').width()})
	    } else {
	        $('.savings-container').removeClass("floating");
	        $('.savings-container').css(
	            { 'width':''})
	    }
        if($(window).scrollTop() > $('.social-container').offset().top - $('.navbar').height() && $(window).width() >= 728){
            $('.social').addClass("floating");
            $('.social').css(
                { 'width':$('.social-container').width()})
        } else {
            $('.social').removeClass("floating");
            $('.social').css(
                { 'width':''})
        }
	})
	
	$('#deductiblePercentage').slider({
		formatter: function(value) {
			return (value * 100).toFixed(0) + "%";
		}
	});
	$("[name='selfEmployedSwitch']").bootstrapSwitch();
	$('.advanced').hide();
	$('.advanced-toggle').click(function(event){
		var hidden = $(this).children('.glyphicon-chevron-down').is(':visible');
		$(this).children('.glyphicon-chevron-down').toggle();
		$(this).children('.glyphicon-chevron-up').toggle();
		//var children = $(this).prev().children('.advanced')
		var children = $(this).closest('.panel').find('.advanced');
		if(hidden){
			children.slideDown(300);
		}
		else{
			children.slideUp(300);
		}
		 event.stopPropagation();
	});

	$('.changelog-toggle').click(function(event){
		//var children = $(this).prev().children('.advanced')
		$(this).closest('.panel').find('.panel-body').toggle();
		 event.stopPropagation();
	});

    var chart = new Highcharts.Chart({
        chart: {
            type: 'bar',
            renderTo: 'summaryHighchart'
        },
        title: {
            text: 'Healthcare Cost Comparison'
        },
        xAxis: {
            categories: ['Affordable Care Act', 'Medicare For All'],
            minPadding:0,
            maxPadding:0
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Cost Breakdown'
            }
        },
        legend: {
            reversed: true
        },
        plotOptions: {
            series: {
                stacking: 'normal'
            }
        },
        series: [
//        {
//            id: 'employerCompensation',
//            name: "employerCompensation",
//            color: '#ff0000',
//            type: 'area',
//            fillOpacity: 0.3,
//            data:[{x:-0.2,y:5000},{x:0.49,y:5000},{x:0.51,y:5000},{x:1.2,y:5000}]
//        },  {
//            id: 'incomeLine',
//            name: "incomeLine",
//            color: '#00ff00',
//            type: 'area',
//            fillOpacity: 0.3,
//            data:[{x:-0.2,y:35000},{x:0.49,y:35000},{x:0.51,y:35000},{x:1.2,y:35000}]
//            //tickmarkPlacement:'on'
////            startOnTick:false,
////            endOnTick:false
//        },
        {
            id: 'taxation',
            name: "Summary: Existing Taxation",
            color: '#000000',
            data:[0,0],
            stack: 'grouping',
            pointWidth:10,
            visible: false
        },
        {
            id: 'bernieTaxation',
            name: "Summary: 'Medicare for All' Taxation",
            color: '#147FD7',
            data:[0,0],
            stack: 'grouping',
            pointWidth:10,
            visible: false
        },
        {
            id: 'healthcare',
            name: "Summary: Healthcare Related Costs",
            color: '#ED1B2E',
            data:[0,0],
            stack: 'grouping',
            pointWidth:10,
            visible: false
        },  {
            id: 'incomeGrouping',
            name: "Summary: Remaining Income",
            color: '#45d363',
            data:[0,0],
            stack: 'grouping',
            pointWidth:10,
            //borderColor: '#2ab347'
            visible: false
        },
        {
            id: 'empBernieTax',
            name: 'Employer Paid Medicare For All Payroll Tax',
            color: '#147FD7',
            data: [0, 0],
            showInLegend: false,
            //borderColor: '#ECB731',
            borderColor: '#ffffff'
        },
//        {
//            id: 'empTaxSavings',
//            name: 'Employer Healthcare Related Tax Breaks',
//            color: '#ff0000',
//            data: [0, 0],
//            showInLegend: false
//        },
        {
            id: 'empPremiums',
            name: 'Employer Paid Premiums',
            color: '#ED1B2E',
            data: [0, 0],
            showInLegend: false,
            //borderColor: '#ECB731'
            borderColor: '#ffffff'
        },
        {
            id: 'empMediTax',
            name: 'Employer Paid Medicare Tax',
            color: '#006a39',
            data: [0, 0],
            showInLegend: false,
            //borderColor: '#ECB731'
            borderColor: '#ffffff'
        }, {
            id: 'empSocSecTax',
            name: 'Employer Paid Social Security Payroll Tax',
            color: '#1d3d56',
            data: [0, 0],
            showInLegend: false,
            //borderColor: '#ECB731'
            borderColor: '#ffffff'
        }, {
            id: 'mediTax',
            name: 'Medicare Payroll Tax',
            color: '#006a39',
            data: [0, 0],
            showInLegend: false,
            borderColor: '#000000'
        }, {
            id: 'socSecTax',
            name: 'Social Security Payroll Tax',
            color: '#1d3d56',
            data: [0, 0],
            showInLegend: false,
            borderColor: '#000000'
        }, {
            id: 'withholdings',
            name: 'Withholdings',
            color: '#000000',
            data: [0, 0],
            showInLegend: false,
            borderColor: '#000000'
        }, {
            id: 'bernieTax',
            name: 'Medicare For All tax',
            color: '#147FD7',
            data: [0, 0],
            //borderColor: '#185378',
            borderColor: '#000000'
        }, {
        //     id: 'obamacarePenalty',
        //     name: 'Obamacare Penalty',
        //     color: '#cc0000',
        //     data: [0, 0],
        //     showInLegend: false,
        //     borderColor: '#000000'
        // }, {
            id: 'premiums',
            name: 'Premiums',
            color: '#ED1B2E',
            data: [0, 0],
            //borderColor: '#aa0000'
            borderColor: '#000000'
        }, {
        //     id: 'copays',
        //     name: 'Copays',
        //     color: '#cf3737',
        //     data: [0, 0],
        //     showInLegend: false,
        //     //borderColor: '#aa0000'
        //     borderColor: '#000000'
        // }, {
            id: 'deductible',
            name: 'Total Out of Pocket Costs',
            color: '#cf3737',
            data: [0, 0],
            showInLegend: false,
            //borderColor: '#aa0000'
            borderColor: '#000000'
        }, {
            id: 'income',
            name: 'Remaining Income',
            color: '#45d363',
            data: [0, 0],
            //borderColor: '#2ab347'
            borderColor: '#000000'
        },
//        {
//            id: 'employerCompensation',
//            name: "Employer Compensation",
//            color: '#8B4513',
//            data:[5000,5000],
//            stack: 'employeeEmployer',
//            pointWidth:10,
//            showInLegend: false
//        },  {
//            id: 'salary',
//            name: "Salary",
//            color: '#004400',
//            data:[35000,35000],
//            stack: 'employeeEmployer',
//            pointWidth:10,
//            showInLegend: false
//        }
        ]
    });

	$('.currency').after("<div class='input-group-addon currency'>$</div>");
    //$('.currency').before("<div class='dollarSign'>$</div>");
	var taxTable = [];

	var jsModel = { 
		income: 50000, 
		incomeShortCapGains: 0, 
		incomeLongCapGains: 0, 
		filingStatus:1,
		selfEmployed: 0,
		adults: 2,
		children: 2,
		itemizedDeductions: 0,
		insured: 1,
		premium: 4955,
		premiumPeriod: 1,
		premiumEmployer: 12591,
		premiumEmployerPeriod: 1,
		copays: 1318,
		copaysPeriod: 1,
		deductible: 1318,
		deductiblePercentage: 1,
		includeVariableCosts: 0,
		age: 0,
		insuranceCategory: 0,
        acaSubsidy:0,
        hsa:0,
        employerHsaContribution:0,
        pretaxDeductions:0
	};

	if(location.search.length>1){
	    var values = atob(location.search.substring(6)).split(",");
	    Object.keys(jsModel).forEach(function(key,index) {
	        jsModel[key] = values[index];
        });
	}

	var self = ko.mapping.fromJS(jsModel);

    self.copyShareLink = function(){
        target = $('#shareLink')[0];
        target.focus();
        target.setSelectionRange(0, target.value.length);

        // copy the selection
        var succeed;
        try {
              succeed = document.execCommand("copy");
              if(succeed){
                  $.notify({
                    // options
                    message: 'Link Copied to Clipboard',
                    url: self.shareLink(),
                    target: '_blank'
                  },{
                    // settings
                    type: 'bg-success',
	                delay: 3000,
                    animate: {
                       enter: 'animated fadeInRight',
                       exit: 'animated fadeOutRight'
                    }
                  });
              }
        } catch(e) {
            succeed = false;
        }
    };

    self.shareLink = ko.computed(function(){
        var model = ko.mapping.toJS(self);
        var str = "";
        Object.keys(model).forEach(function(key,index) {
            if(index!=0){
                str +=  ",";
            }
            str += +model[key];
        });
        return location.protocol + '//' + location.host + location.pathname + "?data="+btoa(str);
    });

    self.allIncome = ko.pureComputed(function(){
        return +self.income() + +self.incomeShortCapGains() + +self.incomeLongCapGains();
    });
    self.employerPayingInsurance = ko.pureComputed(function(){
        return (self.selfEmployed()==0 && self.insured() == 1);
    });
    self.hasInsurance = ko.pureComputed(function(){
        return self.insured() == 1 || self.insured() == 3;
    });
	self.familySize = ko.pureComputed(function(){
        return +self.adults() + + self.children();
    },self);
	var standardDeductionTable = [12400,24800,12400,18650]
	self.standardDeduction = ko.computed(function(){
	    return standardDeductionTable[self.filingStatus()];
	},self);

	self.exemptions = ko.computed(function(){
        return 0*self.familySize();
    },self);

	self.totalDeductions = ko.computed(function(){
	    return Math.max(self.standardDeduction(),self.itemizedDeductions())+ +self.exemptions();
    },self);

    self.employerHsaTaxExemption = ko.computed(function(){
        if(self.hsa()==1 && self.insured()==1){
            return self.employerHsaContribution();
        } else {
            return 0;
        }
    },self)

    self.oopCosts = ko.computed(function(){
        return Math.max(0,self.copays() * self.copaysPeriod());
    },self)
    
    self.hsaTaxExemption = ko.computed(function(){
        if (self.hsa()==1){
            if (self.filingStatus()==1){
                return Math.max(0,Math.min(self.oopCosts(),7100) - self.employerHsaContribution())
            } else {
                return Math.max(0,Math.min(self.oopCosts(),3550) - self.employerHsaContribution())
            }
        } else {
            return 0;
        }
    },self)

	self.taxableIncome = ko.computed(function(){
        //2020/01/19 Premiums were never tax deductible? Seems that was a mistake
	    return Math.max(0,+self.income() + +self.incomeShortCapGains() - +self.totalDeductions() - +self.pretaxDeductions() - +self.hsaTaxExemption());// - (self.premium() * self.premiumPeriod())
	},self);


	self.newTaxableIncome = ko.computed(function(){
	    return Math.max(0,+self.income() + +self.incomeShortCapGains() - +self.totalDeductions() - +self.pretaxDeductions());
	},self);

    //Source: https://www.healthpocket.com/individual-health-insurance/
//    var premiumTable = [
//        [258,312,381,483],//30
//        [290,351,429,544],//40
//        [405,491,599,760],//50
//        [615,745,909,1155],//60
//    ]
    //Source: http://kff.org/interactive/subsidy-calculator
    var premiumPerKid = [158,178,239,302];
    var premiumTablePerAdult = [
        //Molina Core Care Bronze 1 (207, 414, 653) (Bronze)
        //Oscar Classic Bronze (280, 580, ) (Expanded Bronze)
        //Blue Advantage Silver HMO 306 (380, 760, 999) (Silver)
        //Molina Gold 3 (480,960) (Gold)
        [207,280,380,480],//<=35  312 
        //Molina Core Care Bronze 1 (289, 578, 706)
        //Oscar Classic Bronze (334, 668, 850) (Expanded Bronze)
        //Blue Advantage Silver HMO 306 (437,874,) (Silver)
        //Molina Gold 3 (552, 1105,) (Gold)
        [289,334,437,552],//<=45  351
        //Molina Core Care Bronze 1 (441, 883, 1002)
        //Oscar Classic Bronze (510, 1021, 1203) (Expanded Bronze)
        //Blue Advantage Silver HMO 306 (668,1337,) (Silver)
        //Molina Gold 3 (845, 1690,) (Gold)
        [441,510,668,845],//<=55  491
        //Molina Core Care Bronze 1 (610, 1221, 1380)
        //Oscar Classic Bronze (717, 1434, 1617) (Expanded Bronze)
        //Blue Advantage Silver HMO 306 (939,1878,) (Silver)
        //Molina Gold 3 (1187, 2374,2678) (Gold)
        [610,717,939,1187],//>55 745
    ]
    var singleDeductibleTable = [6800, 5500,2850,0]
    var familyDeductibleTable = [13600,11000,5700,0]

    var costSharing
    function calculateMetalInsurancePremium(level){
        return premiumTablePerAdult[+self.age()][level] * self.adults() + premiumPerKid[level] * self.children()
    }
    self.updateACAPremiums = function(){
        if(self.insured() == 3){
            self.premium(calculateMetalInsurancePremium(+self.insuranceCategory()));
            self.premiumPeriod(12);


            var totalIncome = +self.income() + +self.incomeShortCapGains() + +self.incomeLongCapGains();
            self.acaSubsidy(calculateACASubsidy(totalIncome, +self.adults() + +self.children(),self.age()));
            var costAssist = calculateCostAssistance(totalIncome, +self.adults()+ +self.children());
            if(self.filingStatus()==0){
                self.deductible(singleDeductibleTable[+self.insuranceCategory()] - costAssist);
            } else {
                self.deductible(familyDeductibleTable[+self.insuranceCategory()] - costAssist);
            }
        }
    };
//    self.income.subscribe(updateACAPremiums);
//    self.filingStatus.subscribe(updateACAPremiums);
//    self.adults.subscribe(updateACAPremiums);
//    self.children.subscribe(updateACAPremiums);
//    self.insured.subscribe(updateACAPremiums);
//    self.age.subscribe(updateACAPremiums);
//    self.insuranceCategory.subscribe(updateACAPremiums);
	var taxTable2020 = [
	    [//Single
	        {start: 0,      stop:9875,      rate:0.10,  capGainsRate: 0},
	        {start: 9875,   stop:40000,     rate:0.12,  capGainsRate: 0},
            {start: 40000,  stop:40125,     rate:0.12,  capGainsRate: 0.15},
            {start: 40125,  stop:85525,     rate:0.22,  capGainsRate: 0.15},
            {start: 85525,  stop:163301,    rate:0.24,  capGainsRate: 0.15},
            {start: 163301, stop:207350,    rate:0.32,  capGainsRate: 0.15},
            {start: 207350, stop:441451,    rate:0.35,  capGainsRate: 0.15},
            {start: 441451, stop:518400,    rate:0.35,  capGainsRate: 0.20},
            {start: 518400, stop:null,      rate:0.37, capGainsRate: 0.20}
	    ],
	    [//Married Filing Jointly
	        {start: 0,      stop:19750,     rate:0.10,  capGainsRate: 0},
	        {start: 19750,  stop:80000,     rate:0.12,  capGainsRate: 0},
	        {start: 80000,  stop:80250,     rate:0.12,  capGainsRate: 0.15},
            {start: 80250,  stop:171050,    rate:0.22,  capGainsRate: 0.15},
            {start: 171050, stop:326600,    rate:0.24,  capGainsRate: 0.15},
            {start: 326600, stop:414700,    rate:0.32,  capGainsRate: 0.15},
            {start: 414700, stop:496600,    rate:0.35,  capGainsRate: 0.15},
            {start: 496600, stop:622050,    rate:0.35,  capGainsRate: 0.20},
            {start: 622050, stop:null,      rate:0.37, capGainsRate: 0.20}
	    ],
        [//Married Filing Separately
            {start: 0,      stop:9875,      rate:0.10,  capGainsRate: 0},
            {start: 9875,   stop:40000,     rate:0.12,  capGainsRate: 0},
            {start: 40000,   stop:40125,     rate:0.12,  capGainsRate: 0.15},
            {start: 40125,  stop:85525,     rate:0.22,  capGainsRate: 0.15},
            {start: 85525,  stop:163300,    rate:0.24,  capGainsRate: 0.15},
            {start: 163300, stop:207350,    rate:0.32,  capGainsRate: 0.15},
            {start: 207350, stop:248300,    rate:0.35,  capGainsRate: 0.15},
            {start: 248300, stop:311025,    rate:0.35,  capGainsRate: 0.20},
            {start: 311025, stop:null,      rate:0.37, capGainsRate: 0.20}
        ],
        [//Head of Household
            {start: 0,      stop:14100,     rate:0.10,  capGainsRate: 0},
            {start: 14100,  stop:53600,     rate:0.12,  capGainsRate: 0},
            {start: 53600,  stop:53700,     rate:0.12,  capGainsRate: 0.15},
            {start: 53700,  stop:85500,    rate:0.22,  capGainsRate: 0.15},
            {start: 85500, stop:163300,    rate:0.24,  capGainsRate: 0.15},
            {start: 163300, stop:207350,    rate:0.32,  capGainsRate: 0.15},
            {start: 207350, stop:469050,    rate:0.35,  capGainsRate: 0.15},,
            {start: 469050, stop:518400,    rate:0.35,  capGainsRate: 0.20},
            {start: 518400, stop:null,      rate:0.37, capGainsRate: 0.20}
        ],
        [//Qualified Widow(er)
	        {start: 0,      stop:19750,     rate:0.10,  capGainsRate: 0},
	        {start: 19750,  stop:80000,     rate:0.12,  capGainsRate: 0},
	        {start: 80000,  stop:80250,     rate:0.12,  capGainsRate: 0.15},
            {start: 80250,  stop:171050,    rate:0.22,  capGainsRate: 0.15},
            {start: 171050, stop:326600,    rate:0.24,  capGainsRate: 0.15},
            {start: 326600, stop:414700,    rate:0.32,  capGainsRate: 0.15},
            {start: 414700, stop:496600,    rate:0.35,  capGainsRate: 0.15},
            {start: 496600, stop:622050,    rate:0.35,  capGainsRate: 0.20},
            {start: 622050, stop:null,      rate:0.37, capGainsRate: 0.20}
        ]
	];

	var taxTableBernie2020 = [
	    [//Single
	        {start: 0,      stop:9875,      rate:0.10,  capGainsRate: 0},
	        {start: 9875,   stop:40000,     rate:0.12,  capGainsRate: 0},
            {start: 40000,  stop:40125,     rate:0.12,  capGainsRate: 0.15},
            {start: 40125,  stop:85525,     rate:0.22,  capGainsRate: 0.15},
            {start: 85525,  stop:163301,    rate:0.24,  capGainsRate: 0.15},
            {start: 163301, stop:200000,    rate:0.28,  capGainsRate: 0.15},
            {start: 200000, stop:500000,    rate:0.40,  capGainsRate: 0.40},
            {start: 500000, stop:2000000,    rate:0.45,  capGainsRate: 0.45},
            {start: 2000000, stop:10000000,    rate:0.50,  capGainsRate: 0.50},
            {start: 10000000, stop:null,    rate:0.52,  capGainsRate: 0.52},
	    ],
	    [//Married Filing Jointly
	        {start: 0,      stop:19750,     rate:0.10,  capGainsRate: 0},
	        {start: 19750,  stop:80000,     rate:0.12,  capGainsRate: 0},
	        {start: 80000,  stop:80250,     rate:0.12,  capGainsRate: 0.15},
            {start: 80250,  stop:171050,    rate:0.22,  capGainsRate: 0.15},
            {start: 171050, stop:250000,    rate:0.24,  capGainsRate: 0.15},
            {start: 250000,     stop:500000,    rate:0.40,  capGainsRate: 0.40},
            {start: 500000,     stop:2000000,   rate:0.45,  capGainsRate: 0.45},
            {start: 2000000,    stop:10000000,  rate:0.50,  capGainsRate: 0.50},
            {start: 10000000,   stop:null,      rate:0.52,  capGainsRate: 0.52}
	    ],
        [//Married Filing Separately
            {start: 0,      stop:9875,      rate:0.10,  capGainsRate: 0},
            {start: 9875,   stop:40000,     rate:0.12,  capGainsRate: 0},
            {start: 40000,   stop:40125,     rate:0.12,  capGainsRate: 0.15},
            {start: 40125,  stop:85525,     rate:0.22,  capGainsRate: 0.15},
            {start: 85525,  stop:163300,    rate:0.24,  capGainsRate: 0.15},
            {start: 163300, stop:200000,    rate:0.28,  capGainsRate: 0.15},
            {start: 200000,     stop:500000,    rate:0.40,  capGainsRate: 0.40},
            {start: 500000,     stop:2000000,   rate:0.45,  capGainsRate: 0.45},
            {start: 2000000,    stop:10000000,  rate:0.50,  capGainsRate: 0.50},
            {start: 10000000,    stop:null,      rate:0.52,  capGainsRate: 0.52}
        ],
        [//Head of Household
            {start: 0,      stop:14100,     rate:0.10,  capGainsRate: 0},
            {start: 14100,  stop:53600,     rate:0.12,  capGainsRate: 0},
            {start: 53600,  stop:53700,     rate:0.12,  capGainsRate: 0.15},
            {start: 53700,  stop:85500,    rate:0.22,  capGainsRate: 0.15},
            {start: 85500, stop:163300,    rate:0.24,  capGainsRate: 0.15},
            {start: 163300, stop:200000,    rate:0.28,  capGainsRate: 0.15},
            {start: 200000,     stop:500000,    rate:0.40,  capGainsRate: 0.40},
            {start: 500000,     stop:2000000,   rate:0.45,  capGainsRate: 0.45},
            {start: 2000000,    stop:10000000,  rate:0.50,  capGainsRate: 0.50},
            {start: 10000000,    stop:null,      rate:0.52,  capGainsRate: 0.52}
        ],
        [//Qualified Widow(er)
	        {start: 0,      stop:19750,     rate:0.10,  capGainsRate: 0},
	        {start: 19750,  stop:80000,     rate:0.12,  capGainsRate: 0},
	        {start: 80000,  stop:80250,     rate:0.12,  capGainsRate: 0.15},
            {start: 80250,  stop:171050,    rate:0.22,  capGainsRate: 0.15},
            {start: 171050, stop:250000,    rate:0.24,  capGainsRate: 0.15},
            {start: 250000,     stop:500000,    rate:0.40,  capGainsRate: 0.40},
            {start: 500000,     stop:2000000,   rate:0.45,  capGainsRate: 0.45},
            {start: 2000000,    stop:10000000,  rate:0.50,  capGainsRate: 0.50},
            {start: 10000000,    stop:null,      rate:0.52,  capGainsRate: 0.52}
        ]
	];
	var FPL = [
	    0,
	    12760,
	    17240,
	    21720,
	    26200,
	    30680,
	    35160,
	    39640,
	    44120,
	    44120+4160];
	var maxPremiumTable = [
        {min:0,     max:1.33,   premiumMin:0.02,    premiumMax:0.02},
        {min:1.33,  max:1.5,    premiumMin:0.03,    premiumMax:0.04},
        {min:1.5,   max:2,      premiumMin:0.04,    premiumMax:0.063},
        {min:2,     max:2.5,    premiumMin:0.063,   premiumMax:0.0805},
        {min:2.5,   max:3,      premiumMin:0.0805,  premiumMax:0.095},
        {min:3,     max:4,      premiumMin:0.095,   premiumMax:0.095},
        {min:4,     max:null,   premiumMin:null,    premiumMax:null},
    ];
    var calculateCostAssistance = function(income,familySize){
        var ratio = income/FPL[familySize];
        var scalar = 1;
        if(familySize>1){
            scalar = 2;
        }
        if(ratio>1.33 && ratio <=1.5){
            return 2000 * scalar;
        } else if(ratio > 1.5 && ratio <=2.0){
            return 1550 * scalar;
        } else {
            return 0;
        }

    }
    // not taxableIncome? Total income according to kff.org?
    // also using full income here: http://www.healthedeals.com/articles/your-guide-to-the-federal-poverty-level
    var calculateACASubsidy = function(income, familySize, age){
	    var ratio = income/FPL[familySize];
        for(var i=0, n=maxPremiumTable.length; i<n; i++){
            ref = maxPremiumTable[i];
            if(ref.max==null){
                return null;
            }
            if(ref.min<ratio && ratio<=ref.max){
                var ratioDiff = ref.max - ref.min;
                var premiumDiff = ref.premiumMax - ref.premiumMin;

                return Math.max(12*calculateMetalInsurancePremium(1) - income * (ref.premiumMin + (ratio-ref.min)/ratioDiff * premiumDiff),0).toFixed(0);
            }
        }
	}
//    self.acaSubsidy = ko.computed(function(){
//        if(self.insured() == 3){
//            var totalIncome = +self.income() + +self.incomeShortCapGains() + +self.incomeLongCapGains();
//            return calculateACASubsidy(totalIncome, +self.adults() + +self.children(),self.age());
//        } else {
//            return 0;
//        }
//    },self);
	var calculateFederalWithholding = function(taxable, array){
	    var sum = 0;
        for(var i=0, n=array.length; i< n; i++){
            curr = array[i];
            sum = sum + (clamp(taxable,curr.start,curr.stop) - curr.start) * curr.rate;
        }
        return sum;
	}
	var calculateCapitalGains = function(taxable, array){
	    var sum = 0;
        var taxed = 0;
        for(var i=0, n=array.length; i< n; i++){
            curr = array[i];
            var clampedIncome = clamp(taxable,curr.start,curr.stop);
            var clampedLongGains = clamp(taxable+ +self.incomeLongCapGains(),curr.start,curr.stop);
            var taxableLongGains = Math.min(clampedLongGains - +clampedIncome,self.incomeLongCapGains()-taxed);
            sum = sum + +taxableLongGains * curr.capGainsRate;
            taxed = taxed + +taxableLongGains;
        }
        return sum;
    }
    self.federalWithholdingNoOOP = ko.computed(function(){
	    return calculateFederalWithholding(self.taxableIncome()+ +self.hsaTaxExemption(), taxTable2020[self.filingStatus()]).toFixed(2);
    },self);

	self.federalWithholding = ko.computed(function(){
	    return calculateFederalWithholding(self.taxableIncome(), taxTable2020[self.filingStatus()]).toFixed(2);

//	    var sum = 0;
//	    var array = taxTable2020[self.filingStatus()];
//	    for(var i=0, n=array.length; i< n; i++){
//            curr = array[i];
//            sum = sum + (clamp(self.taxableIncome(),curr.start,curr.stop) - curr.start) * curr.rate;
//        }
//        return sum;
    },self);


	self.longCapGainsTax = ko.computed(function(){
	    return calculateCapitalGains(self.taxableIncome(), taxTable2020[self.filingStatus()]);
//	    var sum = 0
//        var taxed = 0
//        var array = taxTable2020[self.filingStatus()];
//        for(var i=0, n=array.length; i< n; i++){
//            curr = array[i];
//            var clampedIncome = clamp(self.taxableIncome(),curr.start,curr.stop);
//            var clampedLongGains = clamp(self.taxableIncome()+ +self.incomeLongCapGains(),curr.start,curr.stop);
//            var taxableLongGains = Math.min(clampedLongGains - +clampedIncome,self.incomeLongCapGains()-taxed);
//            sum = sum + +taxableLongGains * curr.capGainsRate;
//            taxed = taxed + +taxableLongGains;
//        }
//        return sum;
    },self);

    self.effectiveTaxRate = ko.pureComputed(function(){
        return (100*(+self.federalWithholding() + +self.longCapGainsTax() + +self.employeeSocSecTax() + +self.employeeMediTax())/self.allIncome()).toFixed(1) +"%";
    });

    self.newFederalWithholding = ko.computed(function(){
        return calculateFederalWithholding(self.newTaxableIncome(), taxTableBernie2020[self.filingStatus()]);
    });
    self.newLongCapGainsTax = ko.computed(function(){
        return calculateCapitalGains(self.newTaxableIncome(), taxTableBernie2020[self.filingStatus()]);
    });
    self.newEffectiveTaxRate = ko.pureComputed(function(){
        return (100*(+self.newFederalWithholding() + +self.newLongCapGainsTax() + +self.employeeSocSecTax() + +self.employeeMediTax() + +self.employeeBernieCareTax())/self.allIncome()).toFixed(1) +"%";
    });
    self.employeeMediTax = ko.pureComputed(function(){
        if(self.selfEmployed()==1){
            return (0.9235 * self.income() * 0.0145 * 2).toFixed(0);
        }
        else{
            return (self.income() * 0.0145).toFixed(0);
        }
    },self);

    self.employerMediTax = ko.pureComputed(function(){
        if(self.selfEmployed()==1){
            return 0;
        } else {
            return (self.income() * 0.0145).toFixed(0);
        }
    },self);

    var socSecTaxableMaximum = 137700;
    self.employeeSocSecTax = ko.pureComputed(function(){
        if(self.selfEmployed()==1){
            return (0.9235 * Math.min(self.income(),socSecTaxableMaximum) * 0.062 * 2).toFixed(0);
        }
        else{
            return (Math.min(self.income(),socSecTaxableMaximum) * 0.062).toFixed(0);
        }
    },self);

    self.employerSocSecTax = ko.pureComputed(function(){
        if(self.selfEmployed()==1){
            return 0;
        } else {
            return (Math.min(self.income(),socSecTaxableMaximum) * 0.062).toFixed(0);
        }
    },self);


    var filingThreshold = [10300,20600,4000,13250,16600]
    var avgBronze = 200 * 12;
    self.uninsuredPenalty = ko.pureComputed(function(){
        return 0
        // if(!+self.insured()){
        //     var percentage = Math.min((self.income()-filingThreshold[self.filingStatus()]) * 0.025, avgBronze);
        //     var perPerson = Math.min(self.adults() * 695 + +self.children() * 347.5, 2085);
        //     return Math.max(percentage, perPerson);
        // } else{
        //     return 0;
        // }
    },self);


    self.employeeHealthcareTaxBreak = ko.pureComputed(function(){

        //JB: 2020/01/19 I don't think acasubsidy counts as income.
        var oldTax = calculateFederalWithholding(self.taxableIncome(), taxTable2020[self.filingStatus()]); // + +self.acaSubsidy()
        var newTax = calculateFederalWithholding(self.newTaxableIncome(), taxTable2020[self.filingStatus()]);

        return Math.max(0,(newTax - oldTax).toFixed(0));
    },self);

    self.employeeHealthCareCostNoDeductible = ko.computed(function(){
      if(+self.insured() == 0){
          return self.uninsuredPenalty();
      } else if(+self.insured() == 1 || +self.insured() == 3) {
          return self.premium() * self.premiumPeriod() - self.acaSubsidy();
      } else{
          return 0;
      }
    },self);


    self.employeeHealthCareCost = ko.computed(function(){
        if(+self.insured() == 0){
            return self.uninsuredPenalty();
        } else if(+self.insured() == 1 || +self.insured() == 3) {
            return self.premium() * self.premiumPeriod() + Math.max(0, Math.max(self.copays() * self.copaysPeriod(), self.deductible() * self.deductiblePercentage()) - +self.employerHsaContribution()) - self.acaSubsidy();
        } else{
            return 0;
        }
    },self);

    var CORPORATE_TAX_RATE = 0.21;
    self.employerHealthcareTaxBreak = ko.pureComputed(function(){
        if(self.selfEmployed()==1){
            return 0;
        } else if(+self.insured() == 1) {
            return ((self.premiumEmployer() * self.premiumEmployerPeriod()+ +self.employerHsaTaxExemption()) * CORPORATE_TAX_RATE).toFixed(0);
        } else {
            return 0;
        }
    },self);

    self.employerHealthCareCost = ko.pureComputed(function(){
        if(+self.insured()!=1 || self.selfEmployed()==1){
            return 0;
        } else if(+self.insured() == 1) {
            return self.premiumEmployer() * self.premiumEmployerPeriod() + + self.employerHsaContribution() - + self.employerHealthcareTaxBreak();
        } else {
            return 0;
        }
    },self);

    var EMPLOYEE_M4A_TAX_RATE = .04
    var EMPLOYER_M4A_TAX_RATE = .075
    self.employeeBernieCareTax = ko.pureComputed(function(){
        if(self.selfEmployed()==1){
            return (0.9235 * (+self.income()) * EMPLOYER_M4A_TAX_RATE + self.newTaxableIncome() * EMPLOYEE_M4A_TAX_RATE).toFixed(0);
        } else {
            return +((+self.newTaxableIncome()) * EMPLOYEE_M4A_TAX_RATE).toFixed(0);
        }
    },self);

    self.employerBernieCareTax = ko.pureComputed(function(){
        if(self.selfEmployed()==1){
            return 0;
        } else {
            return (self.income() * EMPLOYER_M4A_TAX_RATE).toFixed(0);
        }
    },self);

    self.employeeSavingsNoDeductible = ko.computed(function(){
        var savings = + self.federalWithholdingNoOOP() - +self.newFederalWithholding() + + self.longCapGainsTax() - +self.newLongCapGainsTax() + +self.employeeHealthCareCostNoDeductible() - + self.employeeBernieCareTax() - + self.employeeHealthcareTaxBreak();// ;
        return savings;
    },self);
    self.employeeSavings = ko.computed(function(){
        var savings = + self.federalWithholding() - +self.newFederalWithholding() + + self.longCapGainsTax() - +self.newLongCapGainsTax() + +self.employeeHealthCareCost() - + self.employeeBernieCareTax() - + self.employeeHealthcareTaxBreak();// ;
        return savings;
    },self);
    self.employeeSavings.subscribe(function(savings) {
    //self.updateTweetButton = function(){
        //var savings = self.employeeSavings();
        var text = "";
        if(savings>0){
            text = "https://twitter.com/intent/tweet?button_hashtag=MedicareForAll&text=I%20will%20save%20%24" + savings.toFixed(0) + "%20with%20Bernie%27s%20Medicare%20For%20All.%20See%20how%20much%20will%20you%20save%20at%20http%3A%2F%2Fsandershealthcare.com%0D%0A%20";
        } else{
            text = "https://twitter.com/intent/tweet?button_hashtag=MedicareForAll&text=See%20how%20much%20will%20you%20save%20with%20Bernie%27s%20Medicare%20For%20All%20at%20http%3A%2F%2Fsandershealthcare.com%0D%0A%20";
        }
        if($('[id^=twitter-widget]')!=null && typeof twttr !== 'undefined'){
            //$('#twitter-widget-0').attr('src',iframesrc);
            $('[id^=twitter-widget]').before("<a id='twitterButton' href='"+text+"' class='twitter-hashtag-button'>Tweet #BernieCare</a>")
            $('[id^=twitter-widget]').remove();
            //ko.applyBindings(self,$('#twitterButton')[0])
            twttr.widgets.load()
        }
    //}
    });
    self.employerSavings = ko.pureComputed(function(){
        return self.employerHealthCareCost() - + self.employerBernieCareTax();
    },self);
    self.employeeSavingsNoDeductibleFormatted = ko.pureComputed(function(){
        return formatCurrency(Math.abs(self.employeeSavingsNoDeductible()));
    },self);
    self.employeeSavingsFormatted = ko.pureComputed(function(){
        return formatCurrency(Math.abs(self.employeeSavings()));
    },self);
    self.employerSavingsFormatted = ko.pureComputed(function(){
        return formatCurrency(Math.abs(self.employerSavings()));
    },self);
    self.employeeSavingsText = ko.pureComputed(function(){
        if(self.employeeSavingsNoDeductible()>0){
            return "You will Save: "
        }
        return "You will Lose: "
    },self);
    self.employerSavingsText = ko.pureComputed(function(){
        if(self.employerSavings()>0){
            return "Employer Saves: "
        }
        return "Employer Loses: "
    },self);

    self.employeeSavingsClass = ko.pureComputed(function(){
        if(self.employeeSavings()>0){
            return "success"
        }
        return "danger"
    },self);
    self.employerSavingsClass = ko.pureComputed(function(){
        if(self.employerSavings()>0){
            return "success"
        }
        return "danger"
    },self);

    self.twitterUrl = ko.pureComputed(function() {
        var text = "";
        if(self.employeeSavings()>0){
            text = "https://twitter.com/intent/tweet?button_hashtag=MedicareForAll&text=I%20will%20save%20%24" + self.employeeSavings() + "%20with%20Bernie%27s%20Medicare%20For%20All.%20See%20how%20much%20will%20you%20save%20at%20http%3A%2F%2Fsandershealthcare.com%0D%0A%20";
        } else{
            text = "https://twitter.com/intent/tweet?button_hashtag=MedicareForAll&text=See%20how%20much%20will%20you%20save%20with%20Bernie%27s%20Medicare%20For%20All%20at%20http%3A%2F%2Fsandershealthcare.com%0D%0A%20";
        }
        //var iframesrc = "https://platform.twitter.com/widgets/tweet_button.baa54ded21a982344c4ced326592f3de.en.html#button_hashtag=MedicareForAll&dnt=false&id=twitter-widget-0&lang=en&original_referer=file%3A%2F%2F%2FC%3A%2FUsers%2FJesse%2FDocuments%2FGitHub%2FSandersHealthcareCalculator%2Findex.html&size=m&text=I%20will%20save%20%24" + self.employeeSavings() + "%20with%20Bernie's%20Medicare%20For%20All.%20See%20how%20much%20will%20you%20save%3F%0D%0A%20&time=1453419200680&type=hashtag"
//        if($('[id^=twitter-widget]')!=null && typeof twttr !== 'undefined'){
//            //$('#twitter-widget-0').attr('src',iframesrc);
//            $('[id^=twitter-widget]').before("<a id='twitterButton' href='"+text+"' class='twitter-hashtag-button'>Tweet #BernieCare</a>")
//            $('[id^=twitter-widget]').remove();
//            //ko.applyBindings(self,$('#twitterButton')[0])
//            twttr.widgets.load()
//        }
        return text;
    },self);
    self.updateHighchart = ko.computed(function(){
        var totalIncome = parseFloat(self.income())+parseFloat(self.incomeLongCapGains()) + parseFloat(self.incomeShortCapGains());;
        var oldIncome = totalIncome;
        var newIncome = totalIncome;

        var premium = 0;
        if(self.insured()>0){
            premium = parseFloat(self.employeeHealthCareCostNoDeductible());
        }
        oldIncome -= premium;
        chart.get('premiums').setData([premium,0]);

        var obamacarePenalty = 0;
        // if(self.insured()==0){
        //     obamacarePenalty = parseFloat(self.uninsuredPenalty());
        // }
        // oldIncome -= obamacarePenalty;
        // chart.get('obamacarePenalty').setData([obamacarePenalty,0]);

        var empPremium = parseFloat(self.employerHealthCareCost());
//        oldIncome += empPremium;
        chart.get('empPremiums').setData([empPremium,0]);

//        var empTaxSavings = parseFloat(self.employerHealthcareTaxBreak());
//        chart.get('empTaxSavings').setData([empTaxSavings,0]);

        var deductible = 0;
        if(self.insured()==1 || self.insured()==3){
            deductible = Math.max(parseFloat(self.deductible()),parseFloat(self.copays())*parseFloat(self.copaysPeriod()));
        }
        oldIncome -= deductible;
        chart.get('deductible').setData([deductible,0]);

        var copays = 0
        // var copays = parseFloat(self.copays() * self.copaysPeriod());
        // oldIncome -= copays;
        // chart.get('copays').setData([copays,0]);

        var bernieTax = parseFloat(self.employeeBernieCareTax());
        newIncome -= bernieTax;
        chart.get('bernieTax').setData([0,bernieTax]);

        var empBernieTax = parseFloat(self.employerBernieCareTax());
//        newIncome += bernieTax;
        chart.get('empBernieTax').setData([0,empBernieTax]);

        var oldWithholdings = parseFloat(self.federalWithholding());
        oldIncome -= oldWithholdings;
        var newWithholdings = parseFloat(self.newFederalWithholding());
        newIncome -= newWithholdings;
        chart.get('withholdings').setData([oldWithholdings, newWithholdings]);

        var socSecTax = parseFloat(self.employeeSocSecTax());
        oldIncome -= socSecTax;
        newIncome -= socSecTax;
        chart.get('socSecTax').setData([socSecTax,socSecTax]);

        var mediTax = parseFloat(self.employeeMediTax());
        oldIncome -= mediTax;
        newIncome -= mediTax;
        chart.get('mediTax').setData([mediTax,mediTax]);

        var empSocSecTax = parseFloat(self.employerSocSecTax());
//        oldIncome += empSocSecTax;
//        newIncome += empSocSecTax;
        chart.get('empSocSecTax').setData([empSocSecTax,empSocSecTax]);

        var empMediTax = parseFloat(self.employerMediTax());
        chart.get('empMediTax').setData([empMediTax,empMediTax]);

        chart.get('income').setData([oldIncome,newIncome]);
        chart.get('incomeGrouping').setData([oldIncome,newIncome]);
        chart.get('healthcare').setData([deductible+copays+empPremium+premium+obamacarePenalty,0]);
        chart.get('taxation').setData([oldWithholdings+socSecTax+mediTax+empSocSecTax+empMediTax,newWithholdings+socSecTax+mediTax+empSocSecTax+empMediTax]);
        chart.get('bernieTaxation').setData([0,bernieTax+empBernieTax]);
//        chart.get('incomeLine').setData([{x:-0.2,y:totalIncome},{x:0.49,y:totalIncome},{x:0.51,y:totalIncome},{x:1.2,y:totalIncome}]);
//        chart.get('employerCompensation').setData([
//            {x:-0.2,y:empSocSecTax+empMediTax+empPremium},
//            {x:0.49,y:empSocSecTax+empMediTax+empPremium},
//            {x:0.51,y:empSocSecTax+empMediTax+empBernieTax},
//            {x:1.2,y:empSocSecTax+empMediTax+empBernieTax}]);
//        chart.get('salary').setData([totalIncome,totalIncome]);
//        chart.get('employerCompensation').setData([empSocSecTax+empMediTax+empPremium,
//                                                   empSocSecTax+empMediTax+empBernieTax]);

//        for (var i = 0; i < chart.series.length; i++) {
//            var s = chart.series[i];
//            if(s.data == [0,0]){
//                s.visible = false;
//            } else {
//                s.visible = true;
//            }
//
//        }
    })
	ko.bindingHandlers.tooltip = {
        init: function(element, valueAccessor) {
            var local = ko.utils.unwrapObservable(valueAccessor()),
                options = {};

            ko.utils.extend(options, ko.bindingHandlers.tooltip.options);
            ko.utils.extend(options, local);

            $(element).tooltip(options);

            ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
                $(element).tooltip("destroy");
            });
        },
        options: {
            trigger: "click"
        }
    };
	ko.applyBindings(self);
});