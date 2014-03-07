  Ext.define('CustomApp', {
     extend: 'Rally.app.App',
     componentCls: 'app',
     layout: 'fit',
     launch: function(){
        this._myMask = new Ext.LoadMask(Ext.getBody(), {msg:"Please wait.This may take long if you have thousands of results..."});
        this._myMask.show();
         this._myStore = Ext.create('Rally.data.WsapiDataStore', {
           model: 'Test Case Result',
           limit:Infinity,
           fetch: ['Verdict','TestCase','TestSet'],
           autoLoad: true,
           listeners: {
                     load: this._onDataLoaded,
                     scope: this
            }
       });
     },
     _onDataLoaded: function(store, data) {
        this._myMask.hide();
            var records = [];
            var verdictsGroups = ["Pass","Blocked","Error","Fail","Inconclusive"]

            var passCount = 0;
            var blockedCount = 0;
            var errorCount = 0;
            var failCount = 0;
            var inconclusiveCount = 0;
            
            var getColor = {
                'Pass': '#009900',
                'Blocked': '#FF8000',
                'Error': '#990000', 
                'Fail': '#FF0000', 
                'Inconclusive': '#A0A0A0', 
            };

            Ext.Array.each(data, function(record) {

                verdict = record.get('Verdict');

                switch(verdict)
                {
                    case "Pass":
                       passCount++;
                        break;
                    case "Blocked":
                        blockedCount++;
                        break;
                    case "Error":
                        errorCount++;
                        break;
                    case "Fail":
                        failCount++;
                        break;
                    case "Inconclusive":
                        inconclusiveCount++;
                }
            });
            if (this.down('#myChart')) {
                        this.remove('myChart');
            }
           this.add(
                {
                    xtype: 'rallychart',
                    loadMask:true,
                    height: 400,
                    storeType: 'Rally.data.WsapiDataStore',
                    store: this._myStore,
                    itemId: 'myChart',
                    chartConfig: {
                        chart: {
                        },
                        title: {
                            text: 'TestCaseResults Verdict Counts',
                            align: 'center'
                        },
                        tooltip: {
                            formatter: function () {
                               return this.point.name + ': <b>' + Highcharts.numberFormat(this.percentage, 1) + '%</b>';
                                }
                        },
                        plotOptions : {
                             pie: {
                                allowPointSelect: true,
                                cursor: 'pointer',
                                dataLabels: {
                                    enabled: true,
                                    color: '#000000',
                                    connectorColor: '#000000'
                                }
                            }
                        }
                    },            
                    chartData: {
                        categories: verdict, 
                        series: [ 
                            {   
                                type: 'pie',
                                name: 'Verdicts',
                                data: [
                                    {name: 'Pass',
                                    y: passCount,
                                    color: getColor['Pass']
                                    },
                                    {name: 'Blocked',
                                    y: blockedCount,
                                    color: getColor['Blocked']
                                    },
                                    {name: 'Fail',
                                    y: failCount,
                                    color: getColor['Fail']
                                    },
                                    {name: 'Error',
                                     y: errorCount,
                                    color: getColor['Error']
                                    },
                                    {name: 'Inconclusive',
                                     y: inconclusiveCount,
                                    color: getColor['Inconclusive']
                                    }
                                      ]
                            }
                        ]
                    }
                }
            );
        }
     
 });