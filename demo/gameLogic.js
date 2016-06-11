
var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope) {
	// number of clients per site.
	$scope.avgReadLatency = "N/A";
	$scope.avgCommitLatency = "N/A";
	$scope.clients = [1, 2, 3, 4, 5, 4, 3, 2, 1];
	$scope.latency = [0, 0, 0, 0, 0, 0, 0, 0, 0];
	$scope.repCount = 4;
	$scope.chosenCount = 0;
	$scope.rtt = [
	[0, 21, 73, 186, 145, 159, 177, 104, 135],
	[21, 0, 79, 186, 143, 177, 162, 90, 120],
	[73, 79, 0, 121, 80, 230, 223, 151, 181],
	[186, 186, 121, 0, 191, 323, 343, 271, 301],
	[145, 143, 80, 191, 0, 309, 192, 228, 258],
	[159, 177, 230, 323, 309, 0, 183, 125, 155],
	[177, 162, 223, 343, 192, 183, 0, 75, 77],
	[104, 90, 151, 271, 228, 125, 75, 0, 33],
	[135, 120, 181, 301, 258, 155, 77, 33, 0]
	];
    $scope.dcPos = [{id:0, name:"California", left:"5%",top:"30%", disabled:false, selected:false, isActive:true},
	{id:1, name:"Oregon", left:"7%",top:"20%", disabled:false, selected:false, isActive:true},
	{id:2, name:"Virginia", left:"17%",top:"25%", disabled:false, selected:false, isActive:true},
	{id:3, name:"Sao Paulo", left:"25%",top:"60%", disabled:false, selected:false, isActive:true}, 
	{id:4, name:"Ireland", left:"38%",top:"18%", disabled:false, selected:false, isActive:true},
	{id:5, name:"Sydney", left:"83%",top:"78%", disabled:false, selected:false, isActive:true},
	{id:6, name:"Singapore", left:"70%",top:"52%", disabled:false, selected:false, isActive:true},
	{id:7, name:"Tokyo", left:"80%",top:"24%", disabled:false, selected:false, isActive:true},
	{id:8, name:"Seoul", left:"74%",top:"30%", disabled:false, selected:false, isActive:true}];

	$scope.change = function() {
        
        $scope.chosenCount = 0;
        for (var i = 0; i < $scope.dcPos.length; i++) {
        	if($scope.dcPos[i].selected){
				$scope.chosenCount++;
        	}
        }
        if($scope.repCount - $scope.chosenCount == 0){
        	for (var i = 0; i < $scope.dcPos.length; i++) {
	        	if(!$scope.dcPos[i].selected){
					$scope.dcPos[i].disabled = true;
				}
        	}
        } else {
        	for (var i = 0; i < $scope.dcPos.length; i++) {
				$scope.dcPos[i].disabled = false;
        	}
        }
    };
    $scope.calculateLatency = function() {
       // Calculate quorum size.
       var quorumSize = Math.ceil((parseInt($scope.repCount)+1)/2.0);
       var totalClients = 0;
       var totalLatency = 0;
       for(var i = 0; i < $scope.dcPos.length; i++){
       		var replicaLatency = [];
       		for(var j = 0; j < $scope.dcPos.length; j++){
       			if($scope.dcPos[j].selected){
       				replicaLatency.push(parseInt($scope.rtt[i][j]));
       			}
       		}
       		replicaLatency.sort(sortNumber);
       		$scope.latency[i] = $scope.clients[i] * replicaLatency[quorumSize-1];
       		totalLatency = totalLatency + $scope.latency[i];
       		totalClients = totalClients + $scope.clients[i];
       }
       $scope.avgReadLatency = parseInt(totalLatency/totalClients);
       $scope.avgCommitLatency = 2 * $scope.avgReadLatency;
    };

    function sortNumber(a,b) {
    	return a - b;
	}

	$scope.getNumber = function(num) {
    	return new Array(num);   
	}
    
});
