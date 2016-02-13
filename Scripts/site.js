function clamp(num, min, max) {
  return num < min ? min : num > max && max!=null ? max : num;
}
function formatCurrency(value){
    return "$ "+value.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
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
        if($(window).scrollTop() > $('.social-container').offset().top - $('.navbar').height()){
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
		copays: 0,
		copaysPeriod: 1,
		deductible: 1318,
		deductiblePercentage: 1,
		includeVariableCosts: 1
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
    self.employerPayingInsurance = ko.pureComputed(function(){
        return !(self.selfEmployed()==1 || self.insured() == 0 || self.insured() == 2);
    });
    self.hasInsurance = ko.pureComputed(function(){
        return self.insured() == 1;
    });
	self.familySize = ko.pureComputed(function(){
        return +self.adults() + + self.children();
    },self);
	var standardDeductionTable = [6300,12600,6300,9250]
	self.standardDeduction = ko.computed(function(){
	    return standardDeductionTable[self.filingStatus()];
	},self);

	self.exemptions = ko.computed(function(){
        return 4000*self.familySize();
    },self);

	self.totalDeductions = ko.computed(function(){
	    return Math.max(self.standardDeduction(),self.itemizedDeductions())+ +self.exemptions();
	},self);

	self.taxableIncome = ko.computed(function(){
	    return Math.max(0,+self.income() + +self.incomeShortCapGains() - +self.totalDeductions() - (self.premium() * self.premiumPeriod()));
	},self);


	self.newTaxableIncome = ko.computed(function(){
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

	var taxTableBernie2016 = [
	    [//Single
	        {start: 0,          stop:9275,      rate:0.10,  capGainsRate: 0},
	        {start: 9275,       stop:37650,     rate:0.15,  capGainsRate: 0},
            {start: 37650,      stop:91150,     rate:0.25,  capGainsRate: 0.15},
            {start: 91150,      stop:190150,    rate:0.28,  capGainsRate: 0.15},
            {start: 190150,     stop:250000,    rate:0.33,  capGainsRate: 0.15},
            {start: 250000,     stop:500000,    rate:0.37,  capGainsRate: 0.37},
            {start: 500000,     stop:2000000,   rate:0.43,  capGainsRate: 0.43},
            {start: 2000000,    stop:10000000,  rate:0.48,  capGainsRate: 0.48},
            {start: 10000000,   stop:null,      rate:0.52,  capGainsRate: 0.52}
	    ],
	    [//Married Filing Jointly
	        {start: 0,          stop:18550,     rate:0.10,  capGainsRate: 0},
	        {start: 18550,      stop:75300,     rate:0.15,  capGainsRate: 0},
            {start: 75300,      stop:151900,    rate:0.25,  capGainsRate: 0.15},
            {start: 151900,     stop:231450,    rate:0.28,  capGainsRate: 0.15},
            {start: 231450,     stop:250000,    rate:0.33,  capGainsRate: 0.15},
            {start: 250000,     stop:500000,    rate:0.37,  capGainsRate: 0.37},
            {start: 500000,     stop:2000000,   rate:0.43,  capGainsRate: 0.43},
            {start: 2000000,    stop:10000000,  rate:0.48,  capGainsRate: 0.48},
            {start: 10000000,   stop:null,      rate:0.52,  capGainsRate: 0.52}
	    ],
        [//Married Filing Separately
            {start: 0,          stop:9275,      rate:0.10,  capGainsRate: 0},
            {start: 9275,       stop:37650,     rate:0.15,  capGainsRate: 0},
            {start: 37650,      stop:75950,     rate:0.25,  capGainsRate: 0.15},
            {start: 75950,      stop:115725,    rate:0.28,  capGainsRate: 0.15},
            {start: 115725,     stop:206675,    rate:0.33,  capGainsRate: 0.15},
            {start: 125000,     stop:250000,    rate:0.37,  capGainsRate: 0.37},
            {start: 250000,     stop:500000,    rate:0.43,  capGainsRate: 0.43},
            {start: 500000,     stop:5000000,   rate:0.48,  capGainsRate: 0.48},
            {start: 5000000,    stop:null,      rate:0.52,  capGainsRate: 0.52}
        ],
        [//Head of Household
            {start: 0,          stop:13250,     rate:0.10,  capGainsRate: 0},
            {start: 13250,      stop:50400,     rate:0.15,  capGainsRate: 0},
            {start: 50400,      stop:130150,    rate:0.25,  capGainsRate: 0.15},
            {start: 130150,     stop:210800,    rate:0.28,  capGainsRate: 0.15},
            {start: 210800,     stop:250000,    rate:0.33,  capGainsRate: 0.15},
            {start: 250000,     stop:500000,    rate:0.37,  capGainsRate: 0.37},
            {start: 500000,     stop:2000000,   rate:0.43,  capGainsRate: 0.43},
            {start: 2000000,    stop:10000000,  rate:0.48,  capGainsRate: 0.48},
            {start: 10000000,   stop:null,      rate:0.52,  capGainsRate: 0.52}
        ],
        [//Qualified Widow(er)
            {start: 0,          stop:18550,     rate:0.10,  capGainsRate: 0},
            {start: 18550,      stop:75300,     rate:0.15,  capGainsRate: 0},
            {start: 75300,      stop:151900,    rate:0.25,  capGainsRate: 0.15},
            {start: 151900,     stop:231450,    rate:0.28,  capGainsRate: 0.15},
            {start: 231450,     stop:250000,    rate:0.33,  capGainsRate: 0.15},
            {start: 250000,     stop:500000,    rate:0.37,  capGainsRate: 0.37},
            {start: 500000,     stop:2000000,   rate:0.43,  capGainsRate: 0.43},
            {start: 2000000,    stop:10000000,  rate:0.48,  capGainsRate: 0.48},
            {start: 10000000,   stop:null,      rate:0.52,  capGainsRate: 0.52}
        ]
	];
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
	self.federalWithholding = ko.computed(function(){
	    return calculateFederalWithholding(self.taxableIncome(), taxTable2016[self.filingStatus()]);

//	    var sum = 0;
//	    var array = taxTable2016[self.filingStatus()];
//	    for(var i=0, n=array.length; i< n; i++){
//            curr = array[i];
//            sum = sum + (clamp(self.taxableIncome(),curr.start,curr.stop) - curr.start) * curr.rate;
//        }
//        return sum;
    },self);


	self.longCapGainsTax = ko.computed(function(){
	    return calculateCapitalGains(self.taxableIncome(), taxTable2016[self.filingStatus()]);
//	    var sum = 0
//        var taxed = 0
//        var array = taxTable2016[self.filingStatus()];
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
        return (100*(+self.federalWithholding() + +self.longCapGainsTax() + +self.employeeSocSecTax() + +self.employeeMediTax())/self.income()).toFixed(1) +"%";
    });

    self.newFederalWithholding = ko.computed(function(){
        return calculateFederalWithholding(self.newTaxableIncome(), taxTableBernie2016[self.filingStatus()]);
    });
    self.newLongCapGainsTax = ko.computed(function(){
        return calculateCapitalGains(self.newTaxableIncome(), taxTableBernie2016[self.filingStatus()]);
    });
    self.newEffectiveTaxRate = ko.pureComputed(function(){
        return (100*(+self.newFederalWithholding() + +self.newLongCapGainsTax() + +self.employeeSocSecTax() + +self.employeeMediTax() + +self.employeeBernieCareTax())/self.income()).toFixed(1) +"%";
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

    var socSecTaxableMaximum = 118500;
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
        if(!+self.insured()){
            var percentage = Math.min((self.income()-filingThreshold[self.filingStatus()]) * 0.025, avgBronze);
            var perPerson = Math.min(self.adults() * 695 + +self.children() * 347.5, 2085);
            return Math.max(percentage, perPerson);
        } else{
            return 0;
        }
    },self);


    self.employeeHealthcareTaxBreak = ko.pureComputed(function(){

        var oldTax = calculateFederalWithholding(self.taxableIncome(), taxTable2016[self.filingStatus()]);
        var newTax = calculateFederalWithholding(self.newTaxableIncome(), taxTable2016[self.filingStatus()]);

        return (newTax - oldTax).toFixed(0);;
    },self);

    self.employeeHealthCareCost = ko.computed(function(){
        if(+self.insured() == 0){
            return self.uninsuredPenalty();
        } else if(+self.insured() == 1) {
            return self.premium() * self.premiumPeriod() + self.copays() * self.copaysPeriod() + self.deductible() * self.deductiblePercentage() * self.includeVariableCosts();
        } else{
            return 0;
        }
    },self);

    var CORPORATE_TAX_RATE = 0.15;
    self.employerHealthcareTaxBreak = ko.pureComputed(function(){
        if(self.selfEmployed()==1){
            return 0;
        } else if(+self.insured() == 1) {
            return (self.premiumEmployer() * self.premiumEmployerPeriod() * CORPORATE_TAX_RATE).toFixed(0);;
        } else {
            return 0;
        }
    },self);

    self.employerHealthCareCost = ko.pureComputed(function(){
        if(!+self.insured() || self.selfEmployed()==1){
            return 0;
        } else if(+self.insured() == 1) {
            return self.premiumEmployer() * self.premiumEmployerPeriod();
        } else {
            return 0;
        }
    },self);

    self.employeeBernieCareTax = ko.pureComputed(function(){
        if(self.selfEmployed()==1){
            return (0.9235 * self.income() * 0.062 + self.newTaxableIncome() * 0.022).toFixed(0);
        } else {
            return +(self.newTaxableIncome() * 0.022).toFixed(0);
        }
    },self);

    self.employerBernieCareTax = ko.pureComputed(function(){
        if(self.selfEmployed()==1){
            return 0;
        } else {
            return (self.income() * 0.062).toFixed(0);
        }
    },self);

    self.employeeSavings = ko.computed(function(){
        var savings = + self.federalWithholding() - +self.newFederalWithholding() + + self.longCapGainsTax() - +self.newLongCapGainsTax() + +self.employeeHealthCareCost() - + self.employeeBernieCareTax() - + self.employeeHealthcareTaxBreak();
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
        return self.employerHealthCareCost() - + self.employerBernieCareTax() - + self.employerHealthcareTaxBreak();
    },self);

    self.employeeSavingsFormatted = ko.pureComputed(function(){
        return formatCurrency(Math.abs(self.employeeSavings()));
    },self);
    self.employerSavingsFormatted = ko.pureComputed(function(){
        return formatCurrency(Math.abs(self.employerSavings()));
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