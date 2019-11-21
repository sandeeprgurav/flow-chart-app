import React, { Component } from 'react';
import './App.css';
import PropTypes from 'prop-types';
import Square from './components/square';
import Parallelogram from './components/parallelogram';
import Oval from './components/oval';
import Rectangle from './components/rectangle';
import Circle from './components/circle';
import Diamond from './components/diamond';
import UpArrow from './components/upArrow';
import DownArrow from './components/downArrow';
import LeftArrow from './components/leftArrow';
import RightArrow from './components/rightArrow';
import BothArrow from './components/bothArrow';
import $ from "jquery";
import DownloadFile from './DownloadFile.js';
import backgroundImage from './img/background.png'
import {getOffsetSum, getOffsetRect, getOffset} from './components/flowChartUtility';
require('webpack-jquery-ui/draggable');
require('webpack-jquery-ui/resizable');

class FlowChart extends Component {
  constructor(props){
    super(props);
    this.state = {flowChartData:[]};
    this.allowDrop = this.allowDrop.bind(this);
    this.drag = this.drag.bind(this);
    this.drop = this.drop.bind(this);
  }

  componentDidMount(){
    //displayFlowChart(props.inputData);
  }

  displayFlowChart = () => {
    //Code to show flowchart as per passed data will come here.
  }

  allowDrop =(ev)=> {
    ev.preventDefault();
  }

  drag=(ev)=> {
    ev.dataTransfer.setData("text", ev.target.id);
    ev.dataTransfer.setData("effectAllowed","copyMove");
    ev.dataTransfer.setData("type","shapes");
  }

  dragMove=(ev)=> {
    if(ev.dataTransfer!==null && ev.dataTransfer!==undefined) {
      ev.dataTransfer.setData("text", ev.target.id);
      ev.dataTransfer.setData("effectAllowed","move");
   }
  }

  dragArrow=(ev)=> {
    if(ev.dataTransfer!==null && ev.dataTransfer!==undefined) {
      ev.dataTransfer.setData("text", ev.target.id);
      ev.dataTransfer.setData("effectAllowed","copyMove");
      ev.dataTransfer.setData("type","arrow");
   }
  }

  drop=(ev)=> {
    //debugger;
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    var effectAllowed = ev.dataTransfer.getData("effectAllowed");
    var type = ev.dataTransfer.getData("type");
    if(effectAllowed === "copyMove" && document.getElementById(data)!== null && document.getElementById(data)!== undefined) {
      var nodeCopy = document.getElementById(data).cloneNode(true);
      nodeCopy.id = "newId_"+data+"z"+Math.floor(Math.random() * 101);
      nodeCopy.classList.add("resizable");
      if(data==="oval" || data==="rectangle" || data==="parallelogram") {
        nodeCopy.style.width = "100px";
      } else {
        nodeCopy.style.width = "50px";
      }
      nodeCopy.style.height = "50px";
      var firstChildElement = nodeCopy.firstElementChild;
      firstChildElement.style.width = "100%";
      firstChildElement.style.height = "100%";
      if(type=== 'shapes') {
        firstChildElement.contentEditable ="true";
        firstChildElement.style.border = "1px solid black";
        firstChildElement.style.backgroundColor="#6F87F1";
        firstChildElement.style.color="white";
        firstChildElement.style.textAlign="center";
      }
      nodeCopy.ondragstart = this.dragMove;
      ev.target.appendChild(nodeCopy);
      $("#"+nodeCopy.id).draggable({containment: "#flowChart"}).resizable({containment: "#flowChart"});
    } else if(effectAllowed === "move"){
      var $node = $("#"+data);
      $node.draggable({containment: "#flowChart"}).resizable({containment: "#flowChart"});
    }
  }

  saveData =()=> {
    var flowChartData=[];
    var $allDcouments = $('[id^=newId_]');
    $($allDcouments).each(function(i) {
      var newObject = {};
      var id = $(this).attr('id');
      var type = id.substring(id.indexOf('_')+1, id.indexOf('z'));
      var $exactElement = $( "."+type, $(this));
      var offset = getOffset($exactElement[0]);
      var innerText = ($exactElement[0]!==null && $exactElement[0]!==undefined) && $exactElement[0].innerText;
      newObject["type"]=type;
      newObject["x"]=offset.left;
      newObject["y"]=offset.top;
      newObject["innerText"]=innerText;

      flowChartData.push(newObject);
    });
    this.setState({flowChartData:flowChartData});
  }

  forceDownload1=()=>{
    this.forceDownload("file/downloadFile","ed687f27-93f1-4064-9eca-347543d7348a.jpg");
  }

  forceDownload = async(url, fileName)=>{
    let options={
                  headers: {
                    'apiToken': localStorage.getItem('apiToken'),
                    'username': localStorage.getItem('username'),
                    'Content-Type': 'application/json',
                    'mode': 'no-cors',
                    'responseType':"blob"
                  },
                  'mode': 'no-cors',
                  'responseType': 'blob',
                };
    options['method'] = "GET";
     return await fetch("http://localhost:8080/api/"+url+"?fileName="+fileName, options)
      .then(response => {
        debugger;
        const filename1 = "file.jpg";
        response.blob().then(blob => {
          let url=  window.URL.createObjectURL(blob);
          let a = document.createElement('a');
          a.href = url;
          a.download = filename1;
          a.click();
        });
    });
  }


  handleResponse =(response)=> {
    debugger;
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'download');
    document.body.appendChild(link);
    link.click();
  }

render() {
  let flowChartData = this.state.flowChartData;
  let flowChardDataList = "", jsonFlowChardDataList="";
  if(flowChartData!==null && flowChartData!==undefined) {
  flowChardDataList = flowChartData.map(
                      (item,index) =>
                        <ul key={index}>
                          <li><div>Element Number :{index+1}</div></li>
                          <li><div>Type :{item.type}</div></li>
                          <li><div>X Coordinate :{item.x}</div></li>
                          <li><div>Y Coordinate :{item.y}</div></li>
                          <li><div>Inner Text :{item.innerText}</div></li>
                        </ul>
                       );
  jsonFlowChardDataList = JSON.stringify(flowChartData);
  }
  console.log("flowChardDataList==>>"+flowChardDataList);
  return (
    <div>
     <div className="main">
      <div className="compnenetList">
        <div className="header" >Flow Shapes</div>
        <div className="shapes">
          <ul>
            <div className="element" draggable="true" id="sqaure" onDragStart={this.drag.bind(this)}>
              <Square/>
            </div>
            <div className="element" draggable="true" id="rectangle" onDragStart={this.drag.bind(this)}>
              <Rectangle/>
            </div>
            <div className="element" draggable="true" id="circle" onDragStart={this.drag.bind(this)}>
              <Circle/>
            </div>
            <div className="element" draggable="true" id="oval" onDragStart={this.drag.bind(this)}>
              <Oval/>
            </div>
            <div className="element" draggable="true" id="parallelogram" onDragStart={this.drag.bind(this)}>
              <Parallelogram/>
            </div>
            <div className="element" draggable="true" id="diamond" onDragStart={this.drag.bind(this)}>
              <Diamond/>
            </div>
            </ul>
        </div>
        <div className="header" >Connectors</div>
        <div className="shapes">
          <ul>
            <div className="connector" draggable="true" id="upArrow" onDragStart={this.dragArrow.bind(this)}>
                <UpArrow/>
            </div>
            <div className="connector" draggable="true" id="leftArrow" onDragStart={this.dragArrow.bind(this)}>
                <LeftArrow/>
            </div>
            <div className="connector" draggable="true" id="rightArrow" onDragStart={this.dragArrow.bind(this)}>
                <RightArrow/>
            </div>
            <div className="connector" draggable="true" id="downArrow" onDragStart={this.dragArrow.bind(this)}>
                <DownArrow/>
            </div>
            <div className="connector" draggable="true" id="bothArrow" onDragStart={this.dragArrow.bind(this)}>
                <BothArrow/>
            </div>
            </ul>
        </div>

        <div className="buttonBox">
          <ul>
            <input type="button" className="saveButton" value="Save" onClick={this.forceDownload1}/>
            <DownloadFile/>
          </ul>
        </div>

      </div>
      <div  className="flowChart" id="flowChart"
            style={{
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat'
                  }}
            onDrop={this.drop.bind(this)}
            onDragOver={this.allowDrop.bind(this)}
            >
      </div>
    </div>

    <div className="flowChartResult">
      <p id="savedData">
        {flowChardDataList!==undefined && flowChardDataList }
        JSON Value = {jsonFlowChardDataList!==undefined && jsonFlowChardDataList}
      </p>
    </div>

  </div>
    );
  }
}
FlowChart.propTypes = {
  inputData: PropTypes.array,
};

export default FlowChart;
