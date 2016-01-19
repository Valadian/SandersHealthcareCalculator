function clamp(num, min, max) {
  return num < min ? min : num > max && max!=null ? max : num;
}
function formatCurrency(value){
    return "$ "+value.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
}
$(function(){
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
	    if($(window).scrollTop() > $('.savings-spaceholder').offset().top - $('.navbar').height() - 5){
	        $('.savings-container').addClass("floating");
	        $('.savings-container').css(
	            { 'width':$('.savings-spaceholder').width()+30})
	    } else {
	        $('.savings-container').removeClass("floating");
	        $('.savings-container').css(
	            { 'width':''})
	    }
	})
	
	$('#deductiblePercentage').slider({
		formatter: function(value) {
			return (value * 100).toFixed(0) + "%";
		}
	});
	$('.advanced').hide();
	$('.advanced-toggle').click(function(event){
		var hidden = $(this).children('.glyphicon-chevron-down').is(':visible');
		$(this).children('.glyphicon-chevron-down').toggle();
		$(this).children('.glyphicon-chevron-up').toggle();
		//var children = $(this).prev().children('.advanced')
		var children = $(this).closest('.panel').find('.advanced');
		if(hidden){
			children.slideDown(400);
		}
		else{
			children.slideUp(400);
		}
		 event.stopPropagation();
	});

	$('.changelog-toggle').click(function(event){
		//var children = $(this).prev().children('.advanced')
		$(this).closest('.panel').find('.panel-body').toggle();
		 event.stopPropagation();
	});
	$('.currency').after("<div class='input-group-addon currency'>$</div>");
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
		copays: 0,
		copaysPeriod: 1,
		deductible: 1318,
		deductiblePercentage: 1,
		includeVariableCosts: 1
	};

	var self = ko.mapping.fromJS(jsModel);

	self.familySize = ko.pureComputed(function(){
        return +self.adults() + + self.children();
    },self);
	var standardDeductionTable = [6300,12600,6300,9250]
	self.standardDeduction = ko.pureComputed(function(){
	    return standardDeductionTable[self.filingStatus()];
	},self);

	self.exemptions = ko.pureComputed(function(){
        return 4000*self.familySize();
    },self);

	self.totalDeductions = ko.pureComputed(function(){
	    return Math.max(self.standardDeduction(),self.itemizedDeductions())+ +self.exemptions();
	},self);

	self.taxableIncome = ko.pureComputed(function(){
	    return Math.max(0,+self.income() + +self.incomeShortCapGains() - +self.totalDeductions());
	},self);

	var taxTable2016 = [
	    [//Single
	        {start: 0,      stop:9275,      rate:0.10,  capGainsRate: 0},
	        {start: 9275,   stop:37650,     rate:0.15,  capGainsRate: 0},
            {start: 37650,  stop:91150,     rate:0.25,  capGainsRate: 0.15},
            {start: 91150,  stop:190150,    rate:0.28,  capGainsRate: 0.15},
            {start: 190150, stop:413350,    rate:0.33,  capGainsRate: 0.15},
            {start: 413350, stop:415050,    rate:0.35,  capGainsRate: 0.15},
            {start: 415050, stop:null,      rate:0.396, capGainsRate: 0.20}
	    ],
	    [//Married Filing Jointly
	        {start: 0,      stop:18550,     rate:0.10,  capGainsRate: 0},
	        {start: 18550,  stop:75300,     rate:0.15,  capGainsRate: 0},
            {start: 75300,  stop:151900,    rate:0.25,  capGainsRate: 0.15},
            {start: 151900, stop:231450,    rate:0.28,  capGainsRate: 0.15},
            {start: 231450, stop:413350,    rate:0.33,  capGainsRate: 0.15},
            {start: 413350, stop:466950,    rate:0.35,  capGainsRate: 0.15},
            {start: 466950, stop:null,      rate:0.396, capGainsRate: 0.20}
	    ],
        [//Married Filing Separately
            {start: 0,      stop:9275,      rate:0.10,  capGainsRate: 0},
            {start: 9275,   stop:37650,     rate:0.15,  capGainsRate: 0},
            {start: 37650,  stop:75950,     rate:0.25,  capGainsRate: 0.15},
            {start: 75950,  stop:115725,    rate:0.28,  capGainsRate: 0.15},
            {start: 115725, stop:206675,    rate:0.33,  capGainsRate: 0.15},
            {start: 206675, stop:233475,    rate:0.35,  capGainsRate: 0.15},
            {start: 233475, stop:null,      rate:0.396, capGainsRate: 0.20}
        ],
        [//Head of Household
            {start: 0,      stop:13250,     rate:0.10,  capGainsRate: 0},
            {start: 13250,  stop:50400,     rate:0.15,  capGainsRate: 0},
            {start: 50400,  stop:130150,    rate:0.25,  capGainsRate: 0.15},
            {start: 130150, stop:210800,    rate:0.28,  capGainsRate: 0.15},
            {start: 210800, stop:413350,    rate:0.33,  capGainsRate: 0.15},
            {start: 413350, stop:441000,    rate:0.35,  capGainsRate: 0.15},
            {start: 441000, stop:null,      rate:0.396, capGainsRate: 0.20}
        ],
        [//Qualified Widow(er)
            {start: 0,      stop:18550,     rate:0.10,  capGainsRate: 0},
            {start: 18550,  stop:75300,     rate:0.15,  capGainsRate: 0},
            {start: 75300,  stop:151900,    rate:0.25,  capGainsRate: 0.15},
            {start: 151900, stop:231450,    rate:0.28,  capGainsRate: 0.15},
            {start: 231450, stop:413350,    rate:0.33,  capGainsRate: 0.15},
            {start: 413350, stop:466950,    rate:0.35,  capGainsRate: 0.15},
            {start: 466950, stop:null,      rate:0.396, capGainsRate: 0.20}
        ]
	];
	self.federalWithholding = ko.pureComputed(function(){
        return taxTable2016[self.filingStatus()].reduce(function(curr,next,i,array){
            if(!("sum" in curr)){
                curr = {sum: (clamp(self.taxableIncome(),curr.start,curr.stop) - curr.start) * curr.rate};
            }
            return {sum: curr.sum + (clamp(self.taxableIncome(),next.start,next.stop) - next.start) * next.rate};
        }).sum;
    },self);

	self.longCapGainsTax = ko.pureComputed(function(){
	    var sum = 0
        var taxed = 0
        var array = taxTable2016[self.filingStatus()];
        for(var i=0, n=array.length; i< n; i++){
            curr = array[i];
            var clampedIncome = clamp(self.taxableIncome(),curr.start,curr.stop);
            var clampedLongGains = clamp(self.taxableIncome()+ +self.incomeLongCapGains(),curr.start,curr.stop);
            var taxableLongGains = Math.min(clampedLongGains - +clampedIncome,self.incomeLongCapGains()-taxed);
            sum = sum + +taxableLongGains * curr.capGainsRate;
            taxed = taxed + +taxableLongGains;
        }
        return sum;
    },self);

    self.employeeMediTax = ko.pureComputed(function(){
        if(+self.selfEmployed()){
            return (0.9235 * self.income() * 0.0145 * 2).toFixed(0);
        }
        else{
            return (self.income() * 0.0145).toFixed(0);
        }
    },self);

    self.employerMediTax = ko.pureComputed(function(){
        if(+self.selfEmployed()){
            return 0;
        } else {
            return (self.income() * 0.0145).toFixed(0);
        }
    },self);

    self.employeeSocSecTax = ko.pureComputed(function(){
        if(+self.selfEmployed()){
            return (0.9235 * self.income() * 0.062 * 2).toFixed(0);
        }
        else{
            return (self.income() * 0.062).toFixed(0);
        }
    },self);

    self.employerSocSecTax = ko.pureComputed(function(){
        if(+self.selfEmployed()){
            return 0;
        } else {
            return (self.income() * 0.062).toFixed(0);
        }
    },self);


    var filingThreshold = [10300,20600,4000,13250,16600]
    var avgBronze = 200 * 12;
    self.uninsuredPenalty = ko.pureComputed(function(){
        if(!+self.insured()){
            var percentage = Math.min((self.income()-filingThreshold[self.filingStatus()]) * 0.025, avgBronze);
            var perPerson = Math.min(self.adults() * 695 + +self.children() * 347.5, 2085);
            return Math.max(percentage, perPerson);
        } else{
            return 0;
        }
    },self);

    self.employeeHealthCareCost = ko.pureComputed(function(){
        if(+self.insured() == 0){
            return self.uninsuredPenalty();
        } else if(+self.insured() == 1) {
            return self.premium() * self.premiumPeriod() + self.copays() * self.copaysPeriod() + self.deductible() * self.deductiblePercentage() * self.includeVariableCosts();
        } else{
            return 0;
        }
    },self);

    self.employerHealthCareCost = ko.pureComputed(function(){
        if(!+self.insured() || +self.selfEmployed()){
            return 0;
        } else if(+self.insured() == 1) {
            return self.premiumEmployer() * self.premiumEmployerPeriod();
        } else {
            return 0;
        }
    },self);

    self.employeeBernieCareTax = ko.pureComputed(function(){
        if(+self.selfEmployed()){
            return (0.9235 * self.income() * 0.062 + self.taxableIncome() * 0.022).toFixed(0);
        } else {
            return (self.taxableIncome() * 0.022).toFixed(0);
        }
    },self);

    self.employerBernieCareTax = ko.pureComputed(function(){
        if(+self.selfEmployed()){
            return 0;
        } else {
            return (self.income() * 0.062).toFixed(0);
        }
    },self);

    self.employeeSavings = ko.pureComputed(function(){
        return self.employeeHealthCareCost() - + self.employeeBernieCareTax()
    },self);
    self.employerSavings = ko.pureComputed(function(){
        return self.employerHealthCareCost() - + self.employerBernieCareTax()
    },self);

    self.employeeSavingsFormatted = ko.pureComputed(function(){
        return formatCurrency(self.employeeSavings());
    },self);
    self.employerSavingsFormatted = ko.pureComputed(function(){
        return formatCurrency(self.employerSavings());
    },self);
    self.employeeSavingsText = ko.pureComputed(function(){
        if(self.employeeSavings()>0){
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