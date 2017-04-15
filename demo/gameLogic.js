
var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope) {
	
	$scope.passiveReplica = false;
	$scope.handoff = false;
	$scope.optimisticRead = false;
	$scope.optimal = 
	[
		{active:[0,1,2,7,8],passive:[3,4,5,6],handoff:true,passiveReplica:true,optimisticRead:true,commit:232,read:0},
		{active:[0,1,2,7,8],passive:[3,4,5,6],handoff:true,passiveReplica:true,optimisticRead:true,commit:214,read:0},
		{active:[0,1,2,4,7],passive:[],handoff:true,passiveReplica:false,optimisticRead:true,commit:159,read:0},
		{active:[1,5,6,7,8],passive:[],handoff:true,passiveReplica:false,optimisticRead:true,commit:199,read:0},
		{active:[0,1,2,6,7],passive:[3,4,5],handoff:true,passiveReplica:true,optimisticRead:true,commit:269,read:0},
	]
	$scope.loadOptimal = function(){
		$scope.resetConfiguration();
		var optimal = $scope.optimal[$scope.configuration];
		$scope.chosenCount = optimal.active.length;
		for (var i = 0; i < optimal.active.length; i++){
			$scope.dcPos[optimal.active[i]].selected = true;
			$scope.dcPos[optimal.active[i]].isActive = true;
		}
		for (var i = 0; i < optimal.passive.length; i++){
			$scope.dcPos[optimal.passive[i]].selected = true;
			$scope.dcPos[optimal.passive[i]].isActive = false;
		}
		$scope.handoff = optimal.handoff;
		$scope.passiveReplica = optimal.passiveReplica;
		$scope.optimisticRead = optimal.optimisticRead;
		$scope.calculateLatency();
	}

	$scope.clients = [
		[1, 2, 3, 4, 5, 4, 3, 2, 1],
		[5, 5, 5, 5, 5, 5, 5, 5, 5],
		[5, 4, 3, 0, 1, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 5, 4, 3, 1],
		[0, 0, 0, 5, 5, 5, 5, 0, 0]
		];
	$scope.repCount = 5;
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
	$scope.avgReadLatency = "N/A";
	$scope.avgCommitLatency = "N/A";
		
	$scope.latency = [0, 0, 0, 0, 0, 0, 0, 0, 0];
	$scope.chosenCount = 0;
	$scope.configuration =0;
    $scope.dcPos = 
	    [
		    {id:0, name:"California", left:"5%",top:"30%", disabled:false, selected:false, style:{}, isActive:false, clientCount:0, readLatency:0, commitLatency:0},
			{id:1, name:"Oregon", left:"7%",top:"20%", disabled:false, selected:false, style:{}, isActive:false, clientCount:0, readLatency:0, commitLatency:0},
			{id:2, name:"Virginia", left:"17%",top:"25%", disabled:false, selected:false, style:{}, isActive:false, clientCount:0, readLatency:0, commitLatency:0},
			{id:3, name:"Sao Paulo", left:"25%",top:"60%", disabled:false, selected:false, style:{}, isActive:false, clientCount:0, readLatency:0, commitLatency:0}, 
			{id:4, name:"Ireland", left:"38%",top:"18%", disabled:false, selected:false, style:{}, isActive:false, clientCount:0, readLatency:0, commitLatency:0},
			{id:5, name:"Sydney", left:"83%",top:"78%", disabled:false, selected:false, style:{}, isActive:false, clientCount:0, readLatency:0, commitLatency:0},
			{id:6, name:"Singapore", left:"70%",top:"52%", disabled:false, selected:false, style:{}, isActive:false, clientCount:0, readLatency:0, commitLatency:0},
			{id:7, name:"Tokyo", left:"80%",top:"24%", disabled:false, selected:false, style:{}, isActive:false, clientCount:0, readLatency:0, commitLatency:0},
			{id:8, name:"Seoul", left:"74%",top:"30%", disabled:false, selected:false, style:{}, isActive:false, clientCount:0, readLatency:0, commitLatency:0}
		];
	$scope.handoffList = [];

	$scope.loadConfig = function() {
		$("#control").hide();
		$("#map").hide();
		$scope.configuration = Math.floor(Math.random() * ($scope.clients.length));
		if ($scope.configuration == $scope.clients.length){
			$scope.configuration = $scope.configuration -1;
		}
    	$scope.resetConfiguration();
    	$("#control").show("slow");
		$("#map").show("slow");
		$("#rttTable").show("slow");
    };

    $scope.change = function(index) {
        $scope.dcPos[index].isActive = $scope.dcPos[index].selected;
        $scope.chosenCount = 0;
        for (var i = 0; i < $scope.dcPos.length; i++) {
        	if($scope.dcPos[i].isActive){
				$scope.chosenCount++;
				$scope.dcPos[i].style = {"border-style": "solid","border-color": "green", "border-width" : "medium"};
        	} else {
        		$scope.dcPos[i].style = {};
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
				if($scope.dcPos[i].selected && !$scope.dcPos[i].isActive){
					$scope.dcPos[i].selected = false;
				}
        	}
        }
        if($scope.repCount == $scope.chosenCount){
        	$scope.calculateLatency();	
        }
    };
	
    $scope.calculateLatency = function() {
    	$("#results").hide();
    	$scope.avgReadLatency = 0;
    	$scope.avgCommitLatency = 0;
    	var activeCount = $scope.repCount;
    	// Passive replica is applied. This changes the quorum size. 
    	if($scope.passiveReplica){
    		// Passive replica doesn't have any meaning without optimistic 
    		// read.
    		$scope.optimisticRead = true;
			activeCount = 0;
			for(var j = 0; j < $scope.dcPos.length; j++){
       			if($scope.dcPos[j].selected && $scope.dcPos[j].isActive ){
       				activeCount++;
       			}
	       	}
    	} else {
    		for(var j = 0; j < $scope.dcPos.length; j++){
       				$scope.dcPos[j].selected = $scope.dcPos[j].isActive;
       			}
    	}
    	for (var i = 0; i < $scope.dcPos.length; i++) {
        	if($scope.dcPos[i].isActive){
				$scope.dcPos[i].style = {"border-style": "solid","border-color": "green", "border-width" : "medium"};
        	} else if($scope.dcPos[i].selected){
        		$scope.dcPos[i].style = {"border-style": "solid","border-color": "red", "border-width" : "medium"};
        	} else {
        		$scope.dcPos[i].style = {};
        	}
        }
		// Calculate quorum size.
    	var quorumSize = Math.ceil((parseInt(activeCount)+1)/2.0);

    	// Optimistic Read is applied. Read from the closest Replica, passive 
    	// or active.
    	var totalClients = 0;
    	var totalReadLatency = 0;
    	var totalCommitLatency = 0;
    	for(var i = 0; i < $scope.dcPos.length; i++){
       		var replicaReadLatency = [];
       		var replicaCommitLatency = [];
	       	for(var j = 0; j < $scope.dcPos.length; j++){
	       		if($scope.dcPos[j].selected){
	       			replicaReadLatency.push(parseInt($scope.rtt[i][j]));
	       			if($scope.dcPos[j].isActive){
	       				replicaCommitLatency.push(parseInt($scope.rtt[i][j]));
	       			}
	       		}
	       	}
       		replicaReadLatency.sort(sortNumber);
       		replicaCommitLatency.sort(sortNumber);
       		$scope.dcPos[i].commitLatency = 2 * replicaCommitLatency[quorumSize-1];
       		totalCommitLatency = totalCommitLatency + $scope.dcPos[i].clientCount * $scope.dcPos[i].commitLatency;

    		if($scope.optimisticRead){
       			totalReadLatency = totalReadLatency + $scope.dcPos[i].clientCount * replicaReadLatency[0];
       			$scope.dcPos[i].readLatency = replicaReadLatency[0];
    		} else{
    			// Read from quorum.
    			totalReadLatency = totalReadLatency + $scope.dcPos[i].clientCount * replicaReadLatency[quorumSize-1];
    			$scope.dcPos[i].readLatency = replicaReadLatency[quorumSize-1];
    		}
    		totalClients = totalClients + $scope.dcPos[i].clientCount;
    	}
    	$scope.handoffList = [];
    	if($scope.handoff){
    		totalCommitLatency = 0;
    		for(var i = 0; i < $scope.dcPos.length; i++){
    			var handoffIndex = -1;
    			var handoffLatency = 1000000;
    			for(var j = 0; j < $scope.dcPos.length; j++){
    				if($scope.dcPos[i].clientCount > 0 && $scope.dcPos[j].isActive && ($scope.rtt[i][j] + $scope.dcPos[j].commitLatency < handoffLatency)){
						handoffLatency = $scope.rtt[i][j] + $scope.dcPos[j].commitLatency;
						handoffIndex = j;
    				}
    			}
    			if(handoffLatency < $scope.dcPos[i].commitLatency){
    				$scope.dcPos[i].commitLatency = handoffLatency;
    				$scope.handoffList.push($scope.dcPos[i].name + "->" + $scope.dcPos[handoffIndex].name);
    			}
    			totalCommitLatency = totalCommitLatency + $scope.dcPos[i].clientCount * $scope.dcPos[i].commitLatency;
    		}
    	}
		$scope.avgReadLatency = parseInt(totalReadLatency/totalClients);
    	$scope.avgCommitLatency = parseInt(totalCommitLatency/totalClients);
    	
    	$("#results").show();
    };
    $scope.resetConfiguration = function(){
    	$scope.avgReadLatency = "N/A";
		$scope.avgCommitLatency = "N/A";
		$scope.passiveReplica = false;
		$scope.handoff = false;
		$scope.optimisticRead = false;
		$scope.latency = [0, 0, 0, 0, 0, 0, 0, 0, 0];
		$scope.chosenCount = 0;
	    $scope.dcPos = 
	    [
		    {id:0, name:"California", left:"5%",top:"30%", disabled:false, selected:false, style:{}, isActive:false, clientCount:0, readLatency:0, commitLatency:0},
			{id:1, name:"Oregon", left:"7%",top:"20%", disabled:false, selected:false, style:{}, isActive:false, clientCount:0, readLatency:0, commitLatency:0},
			{id:2, name:"Virginia", left:"17%",top:"25%", disabled:false, selected:false, style:{}, isActive:false, clientCount:0, readLatency:0, commitLatency:0},
			{id:3, name:"Sao Paulo", left:"25%",top:"60%", disabled:false, selected:false, style:{}, isActive:false, clientCount:0, readLatency:0, commitLatency:0}, 
			{id:4, name:"Ireland", left:"38%",top:"18%", disabled:false, selected:false, style:{}, isActive:false, clientCount:0, readLatency:0, commitLatency:0},
			{id:5, name:"Sydney", left:"83%",top:"78%", disabled:false, selected:false, style:{}, isActive:false, clientCount:0, readLatency:0, commitLatency:0},
			{id:6, name:"Singapore", left:"70%",top:"52%", disabled:false, selected:false, style:{}, isActive:false, clientCount:0, readLatency:0, commitLatency:0},
			{id:7, name:"Tokyo", left:"80%",top:"24%", disabled:false, selected:false, style:{}, isActive:false, clientCount:0, readLatency:0, commitLatency:0},
			{id:8, name:"Seoul", left:"74%",top:"30%", disabled:false, selected:false, style:{}, isActive:false, clientCount:0, readLatency:0, commitLatency:0}
		];
		$scope.handoffList = [];
		for(var i = 0; i < $scope.dcPos.length; i++){
 			$scope.dcPos[i].clientCount = $scope.clients[$scope.configuration][i];
     	}
    }
    function sortNumber(a,b) {
    	return a - b;
	}

	$scope.getNumber = function(num) {
    	return new Array(num);   
	}
    
});
