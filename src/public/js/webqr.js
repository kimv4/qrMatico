// QRCODE reader Copyright 2011 Lazar Laszlo
// http://www.webqr.com


var listable = [];

var gCtx = null;
var gCanvas = null;
var c=0;
var stype=0;
var gUM=false;
var webkit=false;
var moz=false;
var v=null;

var imghtml='<div id="qrfile"><canvas id="out-canvas" width="800" height="600"></canvas>'+
    '<div id="imghelp">drag and drop a QRCode here'+
	'<br>or select a file'+
	'<input type="file" onchange="handleFiles(this.files)"/>'+
	'</div>'+
'</div>';

var vidhtml = '<video id="v" autoplay></video>';

function dragenter(e) {
  e.stopPropagation();
  e.preventDefault();
}

function dragover(e) {
  e.stopPropagation();
  e.preventDefault();
}
function drop(e) {
  e.stopPropagation();
  e.preventDefault();

  var dt = e.dataTransfer;
  var files = dt.files;
  
  if(files.length>0)
  {
	handleFiles(files);
  }
  else
  if(dt.getData('URL'))
  {
	qrcode.decode(dt.getData('URL'));
  }
}

function handleFiles(f)
{
	var o=[];
	//console.log(f);
  
	for(var i =0;i<f.length;i++)
	{
        var reader = new FileReader();
        reader.onload = (function(theFile) {
        return function(e) {
            gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);

			qrcode.decode(e.target.result);
        };
        })(f[i]);
        reader.readAsDataURL(f[i]);	
    }
}

function initCanvas(w,h)
{
    gCanvas = document.getElementById("qr-canvas");
    gCanvas.style.width = w + "px";
    gCanvas.style.height = h + "px";
    gCanvas.width = w;
    gCanvas.height = h;
    gCtx = gCanvas.getContext("2d");
    gCtx.clearRect(0, 0, w, h);
    
}

//FUNCIO QUE PROCESA EL RESULTADO DE LA LECTURA QR Y EXTRAE EL RUT
function process_string(_rut){
  const rut = document.getElementById('rut_');
  //console.log(_rut)
  var frut;
  if(_rut.length >=12){
    const figual = _rut.search("=");
    const fand = _rut.search("&");
    frut = _rut.slice(figual+1, fand);
  } else {
    frut = _rut;
  }

  if(frut.length <= 11){
    
   fetch('https://read-data.herokuapp.com/scan/consulta?rut='+frut, {
     method: 'GET'
   })
   .then(res => res.json())
   .then(function(respons){
    console.log("=====>"+respons.length)
    if(respons.length){
      console.log("ENTROOOOO");
      
      addTable_(respons);
      load();
    } else {
      load();
    }
    
   })
  //   console.log(response)
  //   addTable_(frut);
  //   load();
  //  })
  //  .catch(function(error){
  //    console.log("errorororor");
  //   load();
  //  })
  }
  //funcion calback al servidor para guardar los datos en servidor
  
}
//https://portal.sidiv.registrocivil.cl/docstatus?RUN=16114499-1&type=CEDULA&serial=102311878&mrz=102311878985031832503181

function captureToCanvas() {
    if(stype!=1)
        return;
    if(gUM)    
    {
        try{
            gCtx.drawImage(v,0,0);
            try{
              //a funcion creada
                process_string(qrcode.decode());
            }
            catch(e){       
                //console.log(e);
                setTimeout(captureToCanvas, 500);
            };
        }
        catch(e){       
                //console.log(e);
                setTimeout(captureToCanvas, 500);
        };
    }
}

function htmlEntities(str) {
  //return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  return String(`
  <div class="bg-success rounded-circle py-3">
    <p class="lead text-white"><b><i class="far fa-check-circle fa-3x" id="camLoad"></i></b></p>
  </div>
  `);
}

function read(a)
{
    var html="";
    //if(a.indexOf("http://") === 0 || a.indexOf("https://") === 0)
        //html+="<a target='_blank' href='"+a+"'>"+a+"</a><br>";
    html+="<b>"+htmlEntities(a)+"</b>";
    document.getElementById("result").innerHTML=html;
}	

function isCanvasSupported(){
  var elem = document.createElement('canvas');
  return !!(elem.getContext && elem.getContext('2d'));
}
function success(stream) 
{

    v.srcObject = stream;
    v.play();

    gUM=true;
    setTimeout(captureToCanvas, 500);
}
		
function error(error)
{
    gUM=false;
    return;
}

function load()
{
	if(isCanvasSupported() && window.File && window.FileReader)
	{
		initCanvas(800, 600);
    qrcode.callback = read;
		document.getElementById("mainbody").style.display="inline";
      setwebcam();
	}
	else
	{
		document.getElementById("mainbody").style.display="inline";
		document.getElementById("mainbody").innerHTML='<p id="mp1">QR code scanner for HTML5 capable browsers</p><br>'+
        '<br><p id="mp2">sorry your browser is not supported</p><br><br>'+
        '<p id="mp1">try <a href="http://www.mozilla.com/firefox"><img src="firefox.png"/></a> or <a href="http://chrome.google.com"><img src="chrome_logo.gif"/></a> or <a href="http://www.opera.com"><img src="Opera-logo.png"/></a></p>';
	}
}
//se ejecuta al presionar el boton camara
function setwebcam()
{
	
	var options = true;
	if(navigator.mediaDevices && navigator.mediaDevices.enumerateDevices)
	{
		try{
			navigator.mediaDevices.enumerateDevices()
			.then(function(devices) {
			  devices.forEach(function(device) {
				if (device.kind === 'videoinput') {
				  if(device.label.toLowerCase().search("back") >-1)
					options={'deviceId': {'exact':device.deviceId}, 'facingMode':'environment', width: 2560, height: 1440} ;
					//options={'deviceId': {'exact':device.deviceId}, 'facingMode':'environment', width: 2044, height: 1920} ;//funciona 7.5 cm o 3 inch
				}
				//console.log(device.kind + ": " + device.label +" id = " + device.deviceId);
			  });
			  setwebcam2(options);
			});
		}
		catch(e)
		{
			console.log(e);
		}
	}
	else{
		console.log("no navigator.mediaDevices.enumerateDevices" );
		setwebcam2(options);
	}
	
}

function setwebcam2(options)
{
	//console.log("=>"+options);
  document.getElementById("result").innerHTML=`
  <div class="bg-danger rounded-pill py-3">
    <p class="lead text-dark"><b><i class="fas fa-camera fa-3x" id="camLoad"></i></b></p>
  </div>
  `;
    if(stype==1)
    {
        setTimeout(captureToCanvas, 500);    
        return;
    }
    var n=navigator;
    document.getElementById("outdiv").innerHTML = vidhtml;
    v=document.getElementById("v");


    if(n.mediaDevices.getUserMedia)
    {
        n.mediaDevices.getUserMedia({video: options, audio: false}).
            then(function(stream){
                success(stream);
            }).catch(function(error){
                error(error)
            });
    }
    else
    if(n.getUserMedia)
	{
		webkit=true;
        n.getUserMedia({video: options, audio: false}, success, error);
	}
    else
    if(n.webkitGetUserMedia)
    {
        webkit=true;
        n.webkitGetUserMedia({video:options, audio: false}, success, error);
    }

    //document.getElementById("qrimg").style.opacity=0.2;
    document.getElementById("webcamimg").style.opacity=1.0;

    stype=1;
    setTimeout(captureToCanvas, 500);
}

function setimg()
{
	document.getElementById("result").innerHTML="";
    if(stype==2)
        return;
    document.getElementById("outdiv").innerHTML = imghtml;
    //document.getElementById("qrimg").src="qrimg.png";
    //document.getElementById("webcamimg").src="webcam2.png";
    document.getElementById("qrimg").style.opacity=1.0;
    document.getElementById("webcamimg").style.opacity=0.2;
    var qrfile = document.getElementById("qrfile");
    qrfile.addEventListener("dragenter", dragenter, false);  
    qrfile.addEventListener("dragover", dragover, false);  
    qrfile.addEventListener("drop", drop, false);
    stype=2;
}

 
  
  
//FUNCIONES DE FRONTEND
var contador = 0;
function addTable_(datos){
  var inouttxtx = document.getElementById('origendestino');
  var furgon = document.getElementById('sel_buzz');
  var furgon = furgon.options[furgon.selectedIndex].value;
  var chofer = document.getElementById('sel_name_driver');
  var chofer = chofer.options[chofer.selectedIndex].value;
  var ordest = document.getElementById('sel_tofrom');
  var ordest = ordest.options[ordest.selectedIndex].value;
  var elRut = document.getElementById('rut_').value;
  rut2 = elRut.value
  var elEvento = document.getElementById('saliollego').checked;
  var tipoevent = "";

  //inouttxtx.innerHTML="Origen";
  elEvento ? tipoevent = "LLEGADA" : tipoevent = "SALIDA"
  contador++;
  console.log(elRut);
  listable.push({ ID: contador, rut: datos[0].rut, nom_corto: datos[0].nom_corto, datadb: datos})
  
  addListable()
  console.log(listable)
}

  
  function addListable(){
    var insetable = document.getElementById('insertable');
    var txt = "";
    // const data = [
    //   { rut: "16458458-8", nombre: "Juan Perez", furgon: "furgon 06" }
    // ];
    for (let x = 0; x < listable.length; x++) {
      var elemento = `
      <tr>
          <td>${listable[x].rut}</td>
          <td>${listable[x].nom_corto}</td>
          <td class="text-center text-warning py-2" onclick="erasefromTable('${listable[x].ID}')">${listable[x].ID}<i class="far fa-trash-alt"></i></td>
        </tr>
      `
      txt += elemento;
      setTimeout(() => {
      }, 2000);
    }
    insetable.innerHTML = txt
  }

  function erasefromTable(id){
    var temparray = [];
    listable.forEach(elemtor => {
      if(id != elemtor.ID){
        temparray.push(elemtor)
      }
    });
    listable = [];
    listable = temparray;
    console.log(listable)
    addListable()
  }

  function loadDatato(){
    var inouttxtx = document.getElementById('origendestino');
    var furgon = document.getElementById('sel_buzz');
    var furgon = furgon.options[furgon.selectedIndex].value;
    var chofer = document.getElementById('sel_name_driver');
    var chofer = chofer.options[chofer.selectedIndex].value;
    var ordest = document.getElementById('sel_tofrom');
    var ordest = ordest.options[ordest.selectedIndex].value;
    var elRut = document.getElementById('rut_').value;
    rut2 = elRut.value
    var elEvento = document.getElementById('saliollego').checked;
    var tipoevent = "";
    elEvento ? tipoevent = "LLEGADA" : tipoevent = "SALIDA"
    
    var url_ = "https://read-data.herokuapp.com/scan/addata",params = {
      method: 'GET',
      data: listable
    };   
    
    var data = {ruts: listable, furgon: furgon, nomDriver:chofer, evento: tipoevent, localidad: ordest};

    fetch(url_, {
      method: 'POST', // or 'PUT'
      body: JSON.stringify(data), // data can be `string` or {object}!
      headers:{
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(function(response){
      window.location.reload()
      listable = []
      contador = 0
      addTable_()
    });

  };

  function loadmanualusr(){
    const rutmanl = document.getElementById('rut_').value
    console.log(rutmanl);
    process_string(rutmanl)
    
  }