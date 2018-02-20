var app = angular.module('tictactoe', []);
app.controller('MainCtrl',['$scope','$timeout',MainCtrl]);
function MainCtrl($scope,$timeout) {
	var players = ['Player 1','Player 2'];
	var winmsgs = {
  		twoplayers:{
  			[players[0]]:players[0]+' wins.',
  			[players[1]]:players[1]+' wins.'
  		},
  		withyogy:{'player':'You win.','yogy':'You lose.'}
	};var wmf = '';
	var turnmsgs = {
		twoplayers:{
			[players[0]]:players[0]+' turn.',
			[players[1]]:players[1]+' turn.'
  		},
  		withyogy:{'player':'Your turn.','yogy':'Yogy\'s turn.'}
  		};
  	$scope.withyogy = true;
	$scope.playwith = function(){
		if($scope.withyogy){
			wmf = 'withyogy';
			$scope.playerturnmsg = turnmsgs[wmf]['player'];
		} else {
			wmf = 'twoplayers';
			$scope.playerturnmsg = turnmsgs[wmf][players[0]];
		}
	}
	$scope.restartgame = function() {
		$scope.playwith();
		$scope.playerturn = players[0];
  		$scope.p1queue = [];
  		$scope.p2queue = [];
  		$scope.result = '';
		$scope.boardcol = {};
		$scope.board = [];
		$scope.remaincells = [];
		for(var i=1;i<=15;i++){ var temp = [];
			for(var j=1;j<=12;j++){
				var cell = 'r'+i+'c'+j;
				temp.push(cell);
				$scope.remaincells.push(cell);
			}
			$scope.board.push(temp);
		}
	}
	$scope.restartgame();
	$scope.playeraction = function(boardcols) {
		$scope.remaincells.splice($scope.remaincells.indexOf(boardcols),1);   
		if($scope.withyogy)
	    	withyogyputer(boardcols);
		else
			twoplayers(boardcols);
	     
	}
	var withyogyputer = function(boardcols) {
		$scope.p1queue.push(boardcols);
		$scope.playerturnmsg = turnmsgs[wmf]['yogy'];
      	if(!resultcreater($scope.p1queue,'player')) {
      		$timeout(function() {
	      		if(randcell = getrandcell()){
			      	$scope.p2queue.push(randcell);
			      	$scope.boardcol[randcell] = true;
			      	$scope.remaincells.splice($scope.remaincells.indexOf(randcell),1);
			      	if(!resultcreater($scope.p2queue,'yogy'))
			      		$scope.playerturnmsg = turnmsgs[wmf]['player'];
			    }
      		}, 0);
      	}

	}
	var twoplayers = function(boardcols){
		if($scope.playerturn == players[0]){
	    	$scope.playerturn = players[1];
	      	$scope.playerturnmsg = turnmsgs[wmf][players[1]];      
	      	$scope.p1queue.push(boardcols);
	      	resultcreater($scope.p1queue,players[0]);
	      	
	    } else {
	      	$scope.playerturn = players[0];
	      	$scope.playerturnmsg = turnmsgs[wmf][players[0]];
	      	$scope.p2queue.push(boardcols);
	      	resultcreater($scope.p2queue,players[1]);
	    }
    }
    var resultcreater = function(playerqueue,playerturns) {
    	if(getcon_win_p(playerqueue,5)){
   			$scope.result = winmsgs[wmf][playerturns];
   			$scope.playerturnmsg = '';
   			disableremaincell();
   			return true;
   		}

    }
    var getwincon = function(cell) {
    	var wincon = [];
		var nearst = nearstelement(cell,1);
		var secondnearst = nearstelement(cell,2);
		wincon.push([cell,nearst[0][0],nearst[0][1],secondnearst[0][0],secondnearst[0][1]]);
		wincon.push([cell,nearst[1][0],nearst[1][1],secondnearst[1][0],secondnearst[1][1]]);
		wincon.push([cell,nearst[2][0],nearst[2][1],secondnearst[2][0],secondnearst[2][1]]);
		wincon.push([cell,nearst[3][0],nearst[3][1],secondnearst[3][0],secondnearst[3][1]]);
		return wincon;
    }
    var getrc = function(cell){
    	var rc = cell.split('r')[1].split('c');
		for(var i =0;i<rc.length;i++){
			rc[i] = Number(rc[i]);
		}
		return rc;
    }
    var nearstelement = function(cell,nno){
    	var nearst = []; var rc = getrc(cell);
		nearst.push(['r'+(rc[0]-nno)+'c'+(rc[1]),'r'+(rc[0]+nno)+'c'+(rc[1])]);
		nearst.push(['r'+(rc[0])+'c'+(rc[1]-nno),'r'+(rc[0])+'c'+(rc[1]+nno)]);
		nearst.push(['r'+(rc[0]-nno)+'c'+(rc[1]-nno),'r'+(rc[0]+nno)+'c'+(rc[1]+nno)]);
		nearst.push(['r'+(rc[0]-nno)+'c'+(rc[1]+nno),'r'+(rc[0]+nno)+'c'+(rc[1]-nno)]);
		return nearst;
    }
	var disableremaincell = function() {
	  for($i=0;$i<$scope.remaincells.length;$i++){
	    $scope.boardcol[$scope.remaincells[$i]] = true;
	  }
	}
	var getallinone = function(accarray){
		var temp = [];
		for(var i=0;i<accarray.length;i++){
			for(var j=0;j<accarray[i].length;j++){
				temp.push(accarray[i][j]);
			}
		}
		return temp;
	}
	var removeused = function(remainarr,quearr){
		var temp = [];
		for(var i=0;i<quearr.length;i++){
			if(remainarr.indexOf(quearr[i])!=-1)
				temp.push(quearr[i]);
		}
		return temp;
	}
	var randelement = function(arr){
		return arr[Math.floor(Math.random() * arr.length)];
	}
	var filterbywincon = function(playerqueue,element,stpno){ 
		var queuelen = playerqueue.length;
		var wincon = getwincon(element); var status = 0;
		for(var j=0;j<wincon.length;j++){ var matched = [];
		   for(var k=0;k<queuelen;k++){ 
	        	for(var l=0;l<wincon[j].length;l++){ 
		          	if(playerqueue[k]==wincon[j][l]){
		          		matched.push(wincon[j][l]);
		            	wincon[j].splice(wincon[j].indexOf(playerqueue[k]),1);
		            }
		       	}
	    	}
	    	var remainarr = removeused($scope.remaincells,wincon[j]);
	    	if(matched.length+remainarr.length==5){
	    		if(matched.length == stpno)
	    			status++;
	    	} 
	    }
	    
	    if(status==2)
	    	return true;
	    return false;
	}
	var getcon_win_p = function(playerqueue,wps,step=1){
		var queuelen = playerqueue.length;
	   	for(var i=0;i<queuelen;i++){ 
			var wincon = getwincon(playerqueue[i]); 
			for(var j=0;j<wincon.length;j++){ var matched = [];
			   for(var k=0;k<queuelen;k++){ 
		        	for(var l=0;l<wincon[j].length;l++){ 
			          	if(playerqueue[k]==wincon[j][l]){
			          		matched.push(wincon[j][l]);
			            	wincon[j].splice(wincon[j].indexOf(playerqueue[k]),1);
			            }
			       	}
		    	} 
		    	if(matched.length==wps){
		    		if(wps==5){
		    			return true;
		    		} else { 
		    			var remainarr = removeused($scope.remaincells,wincon[j]);
		    			if(remainarr.length==(5-wps)){ 
		    				var perarr2 = []; var perarr1 = [];var status = 0;var perarr0 = [];
		    				for(var m=0;m<matched.length;m++){console.log(matched[m]);
		    					var nearst = nearstelement(matched[m],1)[j]; 
		    					for(var n=0;n<remainarr.length;n++){
		    						if(nearst.indexOf(remainarr[n])!=-1){console.log(nearst,remainarr[n])
		    							status++;
		    							if(wps==4)
		    								return remainarr[n];
		    							else { 
		    								if(step==2){
		    									if(filterbywincon(playerqueue,remainarr[n],2))
		    										perarr2.push(remainarr[n]);
		    								}
			    							if(step==1){
			    								var pftr = removeused($scope.remaincells,nearstelement(remainarr[n],1)[j]);
			    								if(pftr.length>0)
			    									perarr0.push(remainarr[n]);
			    								else {
			    								var spnr = removeused(playerqueue,nearstelement(remainarr[n],1)[j]);
			    								if(spnr.length>0)
			    									perarr1.push(remainarr[n]);
			    								}
			    							}	
		    							}		
		    						}
		    					}
		    				} 
		    				if(status>=2){ 
		    					if(perarr2.length>0)
			    					return randelement(perarr2);
		    					else if(perarr1.length>0)
			    					return randelement(perarr1);
			    				else if(perarr0.length>0)
			    					return randelement(perarr0);
		    				}
		    			}
		    		}	
		    	}
			}
		}
	}
	var getrandcell = function(){
		var randcell = '';
		if(randcell=getrand_p9())
			return randcell;
		else if(randcell=getrand_p8())
			return randcell;
		else if(randcell=getrand_p7())
			return randcell;
		else if(randcell=getrand_p6())
			return randcell;
		else if(randcell=getrand_p5())
			return randcell;
		else if(randcell=getrand_p4())
			return randcell;
		else if(randcell=getrand_p3())
			return randcell;
		else if(randcell=getrand_p2())
			return randcell;
		else if(randcell=getrand_p1())
			return randcell;
		else if(randcell=getrand_p0())
			return randcell;
	}

	
	var getrand_p9 = function(){ //get perfect closer for queue with 4 element self
		var randcell ='';
		if(randcell = getcon_win_p($scope.p2queue,4)){ 
			return randcell; 
		}	
	}
	var getrand_p8 = function(){ //get perfect closer for queue with 4 element opponent
		var randcell ='';
		if(randcell = getcon_win_p($scope.p1queue,4)){ 
			return randcell; 
		}	
	}
	var getrand_p7 = function(){ //get perfect closer for queue with 3 element self
		var randcell ='';
		if(randcell = getcon_win_p($scope.p2queue,3)){ 
			return randcell; 
		}	
	}
	var getrand_p6 = function(){ //get perfect closer for queue with 3 element opponent
		var randcell ='';
		if(randcell = getcon_win_p($scope.p1queue,3)){ 
			return randcell; 
		}	
	}
	var getrand_p5 = function(){console.log('step2 self'); //get perfect closer for queue with 2 element self step 2
		var randcell ='';
		if(randcell = getcon_win_p($scope.p2queue,2,2)){ 
			return randcell; 
		}	
	}
	var getrand_p4 = function(){ //get perfect closer for queue with 2 element self 
		var randcell ='';
		if(randcell = getcon_win_p($scope.p2queue,2)){ 
			return randcell; 
		}
	}
	var getrand_p3 = function(){ console.log('step2 opponent');//get perfect closer for queue with 2 element opponent step 2
		var randcell ='';
		if(randcell = getcon_win_p($scope.p1queue,2,2)){ 
			return randcell; 
		}	
	}
	var getrand_p2 = function(){  //get perfect closer for queue with 1 element self 
		var randcell ='';
		if(randcell = getcon_win_p($scope.p2queue,1)){ 
			return randcell; 
		}
	}
	var getrand_p1 = function(){ //get perfect closer for queue with 2 element opponent
		var randcell ='';
		if(randcell = getcon_win_p($scope.p1queue,2)){ 
			return randcell; 
		}	
	}
	var getrand_p0 = function(){
		var temp = [];
		for(var i=5;i<=9;i++){ 
			for(var j=5;j<=9;j++){
				var cell = 'r'+i+'c'+j;
				temp.push(cell);
			}
		}
		var midrand = randelement(removeused($scope.remaincells,temp));
		if(midrand){ 
			return midrand;
		}
		else 
			return randelement($scope.remaincells);
	}


}