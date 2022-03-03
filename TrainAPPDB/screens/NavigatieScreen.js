/* 
NavigationScreen
Author: Stijn De Bels
Description: The navigation screen displays the traincomponents, perronobjects, perron, picker, current location
Stylesheet: to be found in ../utils/stylesheets/NavigatieScreen
Functions in this component:
- Constructor
- navigationOptions: to place the info button on the right top corner, that triggers the modal screen to display
- _getLocationAsync: to ask for permission to start the asynchronous location thread
- geoToPixelBerekening: input are geocoordinates, output are the pixels relative to the top left corner of the platform
- perronInitialisatie: initialize the navigatoin en current location variabeles with the current state and make the platform appear
    input is PerronBehoud, a variable to check if the platform is already visible
- animatie: animation of the navigation
- perronObjecten: make components of the objects on the platform an puts them in an array, ready for rendering
- locatiechecker: checks if the location is on the platform
- geoToPixelAfstandsBerekening: transorms distance between geographical coordinates to a pixeldistance
- berekenNavigatieDeel2: calculation of navigation, serperate because of multiple use
- berekenNavigatie: calculates the size of navVPixelX,navVPixelY,navHPixelX,navVPixelY,horizontalLineWidth,verticalLineHeigh, 
  there are needed for creating the navigation paths
  if there are objects on the platform, it calculates the size of extra navigation paths: ExtranavHPixelY,ExtranavHPixelX,
  ExtrahorizontalLineWidth,ExtraverticalLineHeight,extraHeightV,extraWidthH,extraLeftV,extraLeftH
- maakNavigatie: set all the variables right, calls berekenNavigatie, and let the platform appear
- treinOffsetBerekening: calculates the offset of the train 
- handleScroll: called when scrollview of main train is being scrollt
- handleMiniatuurScroll:: called when scrollview of miniature train is being scrollt
- render: to render all components, make them visible on the screen, returnvalue is all visible components
- _getLocationAsync2: contains the location thread
- componentDidMount: is invoked immediately after a component is mounted, when the component is mounted is scrolls to the beginning of the train
- _toonModal: when called, this will set a state to true to show the modal screen
- componentWillMount: is invoked just before mounting occurs. It is called before render(). We assign the infobutton in the top right corner to _toonModal function
- componentWillUnMount: when going to the previous screen, the component will unmount,so we need the location thread to be removed
*/
import React from 'react';
import {Animated, Modal, Dimensions, TouchableOpacity, ScrollView, View, Image, Text, Button} from 'react-native';
import * as Location from 'expo-location';
import Train from "../components/Train";
import * as Permissions from 'expo-permissions';
import RNPickerSelect from 'react-native-picker-select';
import {meterNrPixelOmzetting,imagesSMALL,objImages,pixelnrMiniatuurPixelOmzetting,featureText,smallImageLengths} from '../utils/constants';
import {matchKey, rijtuigBepaling} from '../utils/functions';
import {styles,pickerStyle} from '../utils/stylesheets/NavigatieScreen';
import Dialog, {DialogTitle, DialogContent,DialogButton,ScaleAnimation} from 'react-native-popup-dialog';

let extraLeftV=5;
let extraLeftH=5;
let extraHeightV=10;
let extraWidthH=0;
const scrollViewInitValue=150;
let  ExtranavHPixelY,ExtranavHPixelX,ExtrahorizontalLineWidth,ExtraverticalLineHeight;
let extraNavigatieObjects =[];
let perronBreedtePixels;
let perronLengtePixels;
let ricoBreedte;
let ricoLengte;
let CurLocPixelX;
let CurLocPixelY;
let treinOffsetPixels;
let navVPixelX;
let navVPixelY;
let verticalLineHeight;
let perronBreedteGeo;
let perronLengteGeo;
let horizontalLineWidth;
let initHorizontalLineWidth
let navHPixelX;
let totalHLengthTillEndNavigation;
let geselecteerd;
let trainComponent;
let scrollViewHeight;
let navigatieObjects;
let netIngedrukt;
let meterToGeo;
let perronObjectenErin=[];
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
let initHorizontalLineLeft=0;
let initHorizontalLineTop=0;
let initVerticalLineLeft=0;
let initVerticalLineTop=0;
let initCurrentLocationLeft=0;
let initCurrentLocationTop=0;
let navHPixelY;
let tekstAccuracy;
let ScrollTo= false;
let ScrollToMiniatuur= false;
let objectPixels=[]
let tekst=[];
let locatieOpPerron=false;

function PerronObject(lbpixelx,lbpixely,rbpixelx,rbpixely,lopixelx,lopixely,ropixelx,ropixely) {
  this.LBPixelX = lbpixelx;
  this.LBPixelY = lbpixely;
  this.RBPixelX = rbpixelx;
  this.RBPixelY = rbpixely;
  this.LOPixelX = lopixelx;
  this.LOPixelY = lopixely;
  this.ROPixelX = ropixelx;
  this.ROPixelY = ropixely;
}
class NavigatieScreen extends React.Component
{
    constructor(inProps) {
        super(inProps);
        locatieOpPerron=false;
        scrollViewHeight=scrollViewInitValue;
        CurLocPixelX=0;
        CurLocPixelY=0;
        treinOffsetPixels=0;
        horizontalLineWidth=0;
        initHorizontalLineWidth=0;
        navVPixelY=0;
        navVPixelX=0;
        navHPixelX=0;
        tekstAccuracy="";
        netIngedrukt=true;
        this.state = {
            optiesTonen: false,
            listTrack : inProps.navigation.state.params.trackList,
            listTrainSpecifics: inProps.navigation.state.params.trainList,
            listPlatformComponentsTypes: inProps.navigation.state.params.platformComponentsList,
            listPlatformComponents:inProps.navigation.state.params.platformComponentsTrackList,
            location: null,
            fadeAnim: new Animated.Value(0),
            CLanimx: new Animated.Value(0),
            CLanimy: new Animated.Value(0),
            NAVanimx1: new Animated.Value(0),
            NAVanimy1: new Animated.Value(0),
            animationHorizontalLineWidth : new Animated.Value(180),
            animationVerticalLineHeight : new Animated.Value(180),
            NAVanimx2: new Animated.Value(0),
            NAVanimy2: new Animated.Value(0),
            toonMeldingVerkeerdePerron: false,
            treinGeselecteerd: false,
            correctePerron: false,    
            voorkeur: 0,
            nauwkeurigeLocatie: false,
            onnauwkeurigeLocatie: false,
            toonModal: false
          };
        totalHLengthTillEndNavigation=0;
        if (this.state.listTrainSpecifics[0]!=0) //Indien er niets uit de databank gevonden wordt is er geen trein
        {
          this._getLocationAsync();
          perronBreedtePixels=this.geoToPixelAfstandsBerekening(this.state.listTrack[0]["LB-LAT"],this.state.listTrack[0]["LB-LONG"],this.state.listTrack[0]["RB-LAT"],this.state.listTrack[0]["RB-LONG"]);
          perronLengtePixels=this.geoToPixelAfstandsBerekening(this.state.listTrack[0]["LB-LAT"],this.state.listTrack[0]["LB-LONG"],this.state.listTrack[0]["LO-LAT"],this.state.listTrack[0]["LO-LONG"]);
          ricoBreedte=parseFloat((parseFloat(this.state.listTrack[0]["LB-LAT"])-parseFloat(this.state.listTrack[0]["RB-LAT"]))/(parseFloat(this.state.listTrack[0]["LB-LONG"])-parseFloat(this.state.listTrack[0]["RB-LONG"])));
          ricoLengte=parseFloat((-1.0)*Math.pow(ricoBreedte,(-1)))
          navigatieObjects=[];
          perronBreedteGeo=parseFloat(Math.sqrt(Math.pow(parseFloat(this.state.listTrack[0]["LB-LAT"])-parseFloat(this.state.listTrack[0]["RB-LAT"]),2)+Math.pow(parseFloat(this.state.listTrack[0]["LB-LONG"])-parseFloat(this.state.listTrack[0]["RB-LONG"]),2)));
          perronLengteGeo=parseFloat(Math.sqrt(Math.pow(parseFloat(this.state.listTrack[0]["LB-LAT"])-parseFloat(this.state.listTrack[0]["LO-LAT"]),2)+Math.pow(parseFloat(this.state.listTrack[0]["LB-LONG"])-parseFloat(this.state.listTrack[0]["LO-LONG"]),2)));
          navigatieObjects[0]=this.perronObjecten()
          if (this.state.listTrainSpecifics[0].lastPlanned_materialUnits_inDirection=='ONWAAR')
          {
            this.state.listTrainSpecifics.reverse() //Trein komt in andere volgerde aan dan ingegeven
            this.state.listTrainSpecifics[0].lastPlanned_materialUnits_inDirection='WAAR'
          }

          this.treinOffsetBerekening()
          
          let arrayOpties=(matchKey(this.state.listTrainSpecifics[0],"lastPlanned_materialUnits"));
          let optieGebruikt=[];
          optieGebruikt.length=arrayOpties.length;
          let k=0

          for (let i=0;i<this.state.listTrainSpecifics.length;i++)
          {
            for (let j=0;j<arrayOpties.length;j++)
            {
              
              if (featureText[arrayOpties[j]] && this.state.listTrainSpecifics[i][arrayOpties[j]]=="WAAR")
              {
                if (optieGebruikt[j]==undefined)
                {
                  optieGebruikt[j]=true;
                  tekst[k]=<Text style={[styles.TextStijl],{fontSize: 15,marginLeft: 20, color: "#808080"}}>{featureText[arrayOpties[j]]}</Text>
                  k=k+1
                }
              }
            }
          }
      }

    } 
    
    static navigationOptions = ({navigation}) => {
      const params = navigation.state.params || {};
      return {
      title: ``,
          headerBackTitle: '',
          headerTruncatedBackTitle: ``,
          headerRight: <TouchableOpacity onPress={params.toonModal }><Image source={ require("../images/icon-info.png") }
          style={{ width : 32, height : 32, tintColor : 'black' }}
        /></TouchableOpacity>
      };
    };

    _getLocationAsync = async () => {
      let { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status !== 'granted') {
        this.setState({
          errorMessage: 'Permission to access location was denied',
        });
      }
      this._getLocationAsync2();
    };

    geoToPixelBerekening(x,y){
      let lengteGeoAfstandTeller=Math.abs(((parseFloat(ricoBreedte)*parseFloat(x))-parseFloat(y)-(parseFloat(ricoBreedte)*parseFloat(this.state.listTrack[0]["RB-LONG"]))+parseFloat(this.state.listTrack[0]["RB-LAT"])))
      let lengteGeoAfstandNoemer = parseFloat(Math.sqrt(Math.pow(parseFloat(ricoBreedte),2)+Math.pow(-1,2)))
      let lengteGeoAfstand= parseFloat(lengteGeoAfstandTeller)/parseFloat(lengteGeoAfstandNoemer);
      lengteGeoAfstand=(Math.abs(parseFloat(lengteGeoAfstand)));
      let breedteGeoAfstandTeller=Math.abs(((ricoLengte*parseFloat(x))-parseFloat(y)-(parseFloat(ricoLengte)*parseFloat(this.state.listTrack[0]["LO-LONG"]))+parseFloat(this.state.listTrack[0]["LO-LAT"])))
      let breedteGeoAfstandNoemer = parseFloat(Math.sqrt(Math.pow(parseFloat(ricoLengte),2)+Math.pow(-1.0,2)))
      let breedteGeoAfstand= breedteGeoAfstandTeller/breedteGeoAfstandNoemer;
      let breedteVerhouding = breedteGeoAfstand/perronBreedteGeo;
      let lengteVerhouding = lengteGeoAfstand/parseFloat(perronLengteGeo);
      return [parseFloat((breedteVerhouding)*parseFloat(perronBreedtePixels)),parseFloat(lengteVerhouding)*perronLengtePixels]
    }

    perronInitialisatie (perronBehoud) 
    {
        initVerticalLineLeft=(navVPixelX);
        initVerticalLineTop=(navVPixelY);
        initHorizontalLineLeft=(navHPixelX);
        initHorizontalLineTop=(navHPixelY);
        initCurrentLocationTop=(CurLocPixelY);
        initCurrentLocationLeft=(CurLocPixelX);
        initHorizontalLineWidth=horizontalLineWidth;
        this.setState({animationHorizontalLineWidth:new Animated.Value(initHorizontalLineWidth+10)})
        this.setState({animationVerticalLineHeight:new Animated.Value(verticalLineHeight)})
        this.forceUpdate()
        if (!perronBehoud)
        {
        Animated.timing(
          this.state.fadeAnim,
          {
            toValue: 1,
            duration: 500,       
            useNativeDriver: true
          }
        ).start(); 
        }
        scrollViewHeight=scrollViewInitValue+perronLengtePixels;
    }

    animatie()
    {
      Animated.parallel([
        Animated.timing(
          this.state.CLanimx, 
          {
            toValue: ((CurLocPixelX)-initCurrentLocationLeft),         
            duration: 500,
          }
        ),
        Animated.timing(
          this.state.CLanimy,
          {
            toValue: ((CurLocPixelY)-initCurrentLocationTop),        
            duration: 500, 
          }
        ),
        Animated.timing(         
          this.state.NAVanimx1, 
          {
            toValue: ((navHPixelX)-initHorizontalLineLeft),      
            duration: 500,      
          }
        ),
        Animated.timing(         
          this.state.NAVanimy1,
          {
            toValue: ((navHPixelY)-initHorizontalLineTop),    
            duration: 500,    
          }
        ),
      Animated.timing(
        this.state.animationHorizontalLineWidth, 
        {
          toValue : horizontalLineWidth+10,
          duration: 500, 
        }),
        Animated.timing(
          this.state.animationVerticalLineHeight, 
          {
          toValue : verticalLineHeight,
          duration: 500, 
        }),
        Animated.timing(          // Animate over time
          this.state.NAVanimx2, // The animated value to drive
          {
            toValue: ((navVPixelX))-initVerticalLineLeft,     //move to position
            duration: 500,       // 500ms
          }
        ),
        Animated.timing(          // Animate over time
          this.state.NAVanimy2, // The animated value to drive
          {
            toValue: ((navVPixelY))-initVerticalLineTop,     //move to position
            duration: 500,       // 500ms
          }
        )
      ]).start();
      this.forceUpdate();    
    }
    perronObjecten()
    {
      let Obj1X, Obj1Y;
      let nr=0;
      let objObject =[]
      for (let i=0; i < (this.state.listPlatformComponents).length; i++)
      { 
        for (let j=0;j < (this.state.listPlatformComponentsTypes).length; j++)
        {
          if(this.state.listPlatformComponentsTypes[j]["Type"]==this.state.listPlatformComponents[i]["Type"])
          {
            
            [Obj1X, Obj1Y]=this.geoToPixelBerekening(this.state.listPlatformComponents[i]["LONG"],this.state.listPlatformComponents[i]["LAT"]);
            let widthObj=meterNrPixelOmzetting*parseFloat(this.state.listPlatformComponentsTypes[j]["Width"])
            let heightObj=meterNrPixelOmzetting*parseFloat(this.state.listPlatformComponentsTypes[j]["Length"])
            let objAfbeelding;
            if (objImages[this.state.listPlatformComponentsTypes[j]["Type"]])
            {
              objAfbeelding=<Image source={objImages[this.state.listPlatformComponentsTypes[j]["Type"]]} style={{flex: 1,resizeMode: 'contain' }} />;
            }      
            objObject[i]=<View style={{width:widthObj, backgroundColor: 'grey', height: heightObj,position: 'absolute',left: Obj1X, top:Obj1Y, alignItems:'center', justifyContent:'center'}}>{objAfbeelding}</View>;
            objectPixels[nr]=new PerronObject(Obj1X,Obj1Y,Obj1X+widthObj,Obj1Y,Obj1X,Obj1Y+heightObj,Obj1X+widthObj,Obj1Y+heightObj);
            nr++;
          }
          else
          {
            [Obj1X, Obj1Y]=this.geoToPixelBerekening(this.state.listPlatformComponents[i]["LONG"],this.state.listPlatformComponents[i]["LAT"]);
            if (objImages[this.state.listPlatformComponents[i]["Type"]])
            {
              objObject[i]=<Image source={objImages[this.state.listPlatformComponents[i]["Type"]]} style={{position: 'absolute',left:Obj1X, top:Obj1Y, flex: 1,resizeMode: 'contain' }} />;
            }  

          }
        }
      }
      
      return [objObject]
    }

    locatieChecker ()
    {
      //We checken nu linker- en rechterkant van het perron
      let vergelijking=ricoLengte*parseFloat(this.state.location.coords.longitude)-parseFloat(this.state.location.coords.latitude)
      let vergelijking2=ricoLengte*parseFloat(this.state.listTrack[0]["LB-LONG"])-parseFloat(this.state.listTrack[0]["LB-LAT"])
      let vergelijking3=ricoLengte*parseFloat(this.state.listTrack[0]["RB-LONG"])-parseFloat(this.state.listTrack[0]["RB-LAT"])
      let statement, statement2;
      if (parseFloat(this.state.listTrack[0]["LB-LONG"])-parseFloat(this.state.listTrack[0]["LO-LONG"])>0)
      {
        statement=(vergelijking)>(vergelijking2)
        statement2=(vergelijking3)>(vergelijking)
      }
      if (parseFloat(this.state.listTrack[0]["LB-LONG"])-parseFloat(this.state.listTrack[0]["LO-LONG"])<0)
      {
        statement=(vergelijking)<(vergelijking2)
        statement2=(vergelijking3)<(vergelijking)
      }
      if(statement)
      {
        if(statement2)
        {
            vergelijking=ricoBreedte*parseFloat(this.state.location.coords.longitude)-parseFloat(this.state.location.coords.latitude)
            vergelijking2=ricoBreedte*parseFloat(this.state.listTrack[0]["LB-LONG"])-parseFloat(this.state.listTrack[0]["LB-LAT"])
            vergelijking3=ricoBreedte*parseFloat(this.state.listTrack[0]["LO-LONG"])-parseFloat(this.state.listTrack[0]["LO-LAT"])
          if (parseFloat(this.state.listTrack[0]["LB-LAT"])-parseFloat(this.state.listTrack[0]["LO-LAT"])>0)
          {
            statement=(vergelijking)>(vergelijking2)
            statement2=(vergelijking3)>(vergelijking)
          }
          if (parseFloat(this.state.listTrack[0]["LB-LAT"])-parseFloat(this.state.listTrack[0]["LO-LAT"])<0)
          {
            statement=((vergelijking)<(vergelijking2))
            statement2=((vergelijking3)<(vergelijking))
          }  
          if(statement && statement2)
          {
                  locatieOpPerron=true;
                  if (this.state.nauwkeurigeLocatie==false)
                  {
                    this.setState({
                      nauwkeurigeLocatie: true,
                      onnauwkeurigeLocatie: false,
                    });
                  }
                  if (this.state.toonMeldingVerkeerdePerron==true )
                  {
                    this.setState({toonMeldingVerkeerdePerron: false});
                  }
                  return;
          }
          else
          {
          let offsetAccuracy=(((this.state.location.coords.accuracy)*meterToGeo)/Math.cos(Math.atan(ricoBreedte)))
          if (locatieOpPerron==false)
          {
            if (parseFloat(this.state.listTrack[0]["LB-LAT"])-parseFloat(this.state.listTrack[0]["LO-LAT"])>0)
            {
              vergelijking2=parseFloat(vergelijking2)-offsetAccuracy
              vergelijking3=vergelijking3+offsetAccuracy
              statement=(vergelijking)>(vergelijking2)
              statement2=(vergelijking3)>(vergelijking)
            }
            else if (parseFloat(this.state.listTrack[0]["LB-LAT"])-parseFloat(this.state.listTrack[0]["LO-LAT"])<0)
            {
              vergelijking2=vergelijking2+offsetAccuracy
              vergelijking3=vergelijking3-offsetAccuracy
              statement=((vergelijking)<(vergelijking2))
              statement2=((vergelijking3)<(vergelijking))
            }  
          }
          else if (locatieOpPerron)
          {
            statement=true;
            statement2=true;
          }

          if(statement && statement2)
          {
            locatieOpPerron=true;

            if (this.state.onnauwkeurigeLocatie==false)
              {
                this.setState({
                  onnauwkeurigeLocatie: true,
                  nauwkeurigeLocatie: false,
                });
              }
            if (this.state.toonMeldingVerkeerdePerron==true )
            {
              this.setState({toonMeldingVerkeerdePerron: false});
            }
            return;
          }
        }
      }
      else
      {
        locatieOpPerron=false;
      }
    }
    else
    {
      locatieOpPerron=false;
    } 
    if (this.state.onnauwkeurigeLocatie==true ||	this.state.nauwkeurigeLocatie==true )
    {
    
      this.setState({
        onnauwkeurigeLocatie: false,
        nauwkeurigeLocatie: false,
      });
    }
    
    return;
    }

    geoToPixelAfstandsBerekening (lat1, lon1, lat2, lon2) {
      //size : 500 voor treinwagon van 27 meter
      let R = 6371; // Radius of earth in KM
      let dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
      let dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
      let a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
      let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      let d = R * c;
      let meter = d*1000
      return ((meter*meterNrPixelOmzetting)) //in pixels
    }

    berekenNavigatieDeel2(lengteTotEinde,verticaalPixelX,verticaalPixelY,LocPixelY)
      {
        let beginXH=lengteTotEinde
        let lijnBreedteH=beginXH-verticaalPixelX
        let beginYH=parseFloat(verticaalPixelY)
        if (lijnBreedteH>0)
        {
          beginXH=verticaalPixelX
        }
        else
        {
          lijnBreedteH=Math.abs(lijnBreedteH)
        }
        let lijnHoogteV=Math.abs(verticaalPixelY-LocPixelY)
        return [beginYH,beginXH,lijnBreedteH,lijnHoogteV]
      }
   
    berekenNavigatie(geselecteerdVoertuig)
    {
      /* hieruit komt: navVPixelX,navVPixelY,navHPixelX,navVPixelY,horizontalLineWidth,verticalLineHeight*/
      navVPixelX=parseFloat(CurLocPixelX)
      navVPixelY=20;
      
      totalHLengthTillEndNavigation=treinOffsetPixels;
      for(let i = 0; i < (this.state.listTrainSpecifics).length; i++)
      {
       
        if (geselecteerdVoertuig==i)
        {
          if (this.state.listTrainSpecifics[i].Door2!=null && Math.abs(totalHLengthTillEndNavigation+parseFloat(this.state.listTrainSpecifics[i].Door1)/(1000)*meterNrPixelOmzetting-CurLocPixelX)>Math.abs(totalHLengthTillEndNavigation+parseFloat(this.state.listTrainSpecifics[i].Door2/(1000*27)*500-CurLocPixelX)))
          {
            totalHLengthTillEndNavigation+=parseFloat(this.state.listTrainSpecifics[i].Door2)/(1000)*meterNrPixelOmzetting
          }
          else
          {
            totalHLengthTillEndNavigation+=parseFloat(this.state.listTrainSpecifics[i].Door1)/(1000)*meterNrPixelOmzetting
          }
          break;
        }
        else
        {
          totalHLengthTillEndNavigation+=parseFloat(this.state.listTrainSpecifics[i].Length)/(1000)*meterNrPixelOmzetting
        }
      
        
      }
      
      let naarLinks =false;
      let letter,statement,value;
      
      if (totalHLengthTillEndNavigation - CurLocPixelX<0)
      {
        naarLinks=true
        value=9039404930;
      }
      else
      {
        value=0;
      }      
      let maximum=0;
      let eindigtTussenIn=false;
      perronObjectenErin = []
      perronObjectenErin.length = 0
      for (let i=0; i < (objectPixels).length; i++)
      {
        if (naarLinks)
        {
          
          statement=((totalHLengthTillEndNavigation<objectPixels[i]["LOPixelX"]) && (objectPixels[i]["LOPixelX"]<CurLocPixelX) || (objectPixels[i]["LOPixelX"]<totalHLengthTillEndNavigation && objectPixels[i]["ROPixelX"]>totalHLengthTillEndNavigation))
        }
        else
        {
          statement=((totalHLengthTillEndNavigation>objectPixels[i]["ROPixelX"]) && (objectPixels[i]["ROPixelX"]>CurLocPixelX) || (objectPixels[i]["LOPixelX"]<totalHLengthTillEndNavigation && objectPixels[i]["ROPixelX"]>totalHLengthTillEndNavigation))
        }
        if (statement)
        {
          if ((objectPixels[i]["LOPixelY"]>navVPixelY) && (navVPixelY>objectPixels[i]["LBPixelY"]))
          {
            perronObjectenErin.push(i)
            if (objectPixels[i]["LOPixelY"]>maximum)
            {
              maximum=objectPixels[i]["LOPixelY"]
              
            }
            if (objectPixels[i]["LOPixelX"]<totalHLengthTillEndNavigation && objectPixels[i]["ROPixelX"]>totalHLengthTillEndNavigation)
            {
              value=totalHLengthTillEndNavigation;
              eindigtTussenIn=true;
            }
            else if (naarLinks)
            {
              if(objectPixels[i]["LOPixelX"]<value)
              {
                value=objectPixels[i]["LOPixelX"];
              }
            }
            else if(objectPixels[i]["ROPixelX"]>value)
            {
              value=objectPixels[i]["ROPixelX"]
            }
          }
        }
      }
      if (perronObjectenErin.length!=0)
      {
        const echteLengte=totalHLengthTillEndNavigation;
        totalHLengthTillEndNavigation=value;
        navVPixelY=maximum+5;
        if (eindigtTussenIn)
        {
          ExtranavHPixelY,ExtranavHPixelX,ExtrahorizontalLineWidth,ExtraverticalLineHeight,extraHeightV,extraWidthH,extraLeftV,extraLeftH=0
        }
        else
        {
          [ExtranavHPixelY,ExtranavHPixelX,ExtrahorizontalLineWidth,ExtraverticalLineHeight]=this.berekenNavigatieDeel2(echteLengte,totalHLengthTillEndNavigation,20,navVPixelY);
          extraHeightV=ExtraverticalLineHeight+10;
          extraWidthH=ExtrahorizontalLineWidth
          
          if (naarLinks==false)
          {
            
            extraLeftV=totalHLengthTillEndNavigation+5;
            extraLeftH=totalHLengthTillEndNavigation+5;
          }
          else
          {
            extraLeftV=totalHLengthTillEndNavigation-5;
            extraLeftH=echteLengte+5;
            
          }
        }
      }
      
      else
      {
        extraNavigatieObjects = []
        extraNavigatieObjects.length = 0

      }
      [navHPixelY,navHPixelX,horizontalLineWidth,verticalLineHeight]=this.berekenNavigatieDeel2(totalHLengthTillEndNavigation,navVPixelX,navVPixelY,CurLocPixelY);
      if (CurLocPixelY<navVPixelY)
      {
        navVPixelY=CurLocPixelY+10
      }
    }
    
    maakNavigatie = (j,k,perronBehoud) =>  {   
      if (this.state.location)
      {
        [CurLocPixelX,CurLocPixelY]= (this.geoToPixelBerekening(this.state.location.coords.longitude,this.state.location.coords.latitude))

      }
      geselecteerd=j; 
      this.state.treinGeselecteerd=k; //we doene niet setState want we willen eerst alle Animates correct renderen
      if ((perronBehoud==true))
      {
        netIngedrukt=true;
      }
      if (this.state.treinGeselecteerd==true & ((this.state.location!=null)))
      {
        
        if ((netIngedrukt))
        {
          if (this.state.onnauwkeurigeLocatie==false && this.state.nauwkeurigeLocatie==false)
          {
            if (this.state.toonMeldingVerkeerdePerron==false )
            {
              this.setState({toonMeldingVerkeerdePerron: true});
            }
          }
          this.setState({ //zet alle values op nul, omdat animates transleren tov offset
            CLanimx: new Animated.Value(0),
            CLanimy: new Animated.Value(0),
            NAVanimx1: new Animated.Value(0),
            NAVanimy1: new Animated.Value(0),
            NAVanimx2: new Animated.Value(0),
            NAVanimy2: new Animated.Value(0)
          })

        }
        
        if (this.state.correctePerron==0)
        {
          return; //als je niet aan het juiste perron staat heb je hier niks te zoeken.
        }
        // BEREKENINGEN //
        this.berekenNavigatie(geselecteerd)
        // EINDE BEREKENINGEN//

        if (netIngedrukt)
        {
          this.perronInitialisatie(perronBehoud) //Laat het perron verschijnen
          let offsetCL = (CurLocPixelX) - (windowWidth/2)
          if (this.state.correctePerron==1 && this.scrollreferentie.scrollTo!=null && offsetCL!=null)
          {

            this.scrollreferentie.scrollTo({x:offsetCL,y:0,animated:true});
          }
          netIngedrukt=false;      
        }
      }
      else
     {
        Animated.timing(          // Animate over time
          this.state.fadeAnim, // The animated value to drive
          {
            toValue: 0,           // Animate to opacity: 1 (opaque)
            duration: 500,       // 2000ms
            useNativeDriver: true
          }
        ).start();
        scrollViewHeight=scrollViewInitValue
        this.forceUpdate()
        netIngedrukt=true;
      }
    }

    treinOffsetBerekening = () =>  {
      let breedtemeter=(perronBreedtePixels/meterNrPixelOmzetting)
      meterToGeo=perronBreedteGeo/breedtemeter
      let halfperron=parseFloat(breedtemeter)/2
      let totalelengte=0
      for (let i=0;i<(this.state.listTrainSpecifics).length;i++)
      {
        
        totalelengte+=parseFloat(this.state.listTrainSpecifics[i].Length)/1000
        
      }
      let halvelengte=totalelengte/2
      let offsetmeter=halfperron-halvelengte
      treinOffsetPixels=(offsetmeter*meterNrPixelOmzetting)
      if (parseFloat(treinOffsetPixels) < 0)
      {
        treinOffsetPixels=0;
      }
      if (treinOffsetPixels == NaN)
      {
        treinOffsetPixels=0
      }

    }

    handleScroll = event => {
      if (ScrollTo == true)
      {
        this.scrollreferentieMiniatuur.scrollTo({x:(event.nativeEvent.contentOffset.x-treinOffsetPixels)*pixelnrMiniatuurPixelOmzetting,y:0,animated:false});
      }
    }
    handleMiniatuurScroll = event => {
      if (ScrollToMiniatuur==true)
      {
        this.scrollreferentie.scrollTo({x:(event.nativeEvent.contentOffset.x/(pixelnrMiniatuurPixelOmzetting))+treinOffsetPixels,y:0,animated:false});
      }
    }
    
    render(){
      if (this.state.listTrainSpecifics[0] ==0) //Indien er niets uit de databank gevonden wordt is er geen trein
        {
         return(<View><Text>Error: No train found.</Text></View>)
        }
          this.state.correctePerron=0;
          if (this.state.location)
          {      
            this.state.correctePerron=true
            this.locatieChecker()
            let vergelijking;
            vergelijking=Math.abs(parseFloat(totalHLengthTillEndNavigation)-parseFloat(CurLocPixelX));

            if (this.state.nauwkeurigeLocatie && this.state.treinGeselecteerd) //Indien huidige locatie op het perron staat en er is een trein aangeduid, maak navigatie
            {
              navigatieObjects[1]=<Animated.View style={{height:this.state.animationVerticalLineHeight, borderRadius:5, backgroundColor: '#7e879f', width: 10,position: 'absolute',left: initVerticalLineLeft, top:initVerticalLineTop,transform: [{ translateX: this.state.NAVanimx2 },{ translateY: this.state.NAVanimy2}]}} />;
              navigatieObjects[2]=<Animated.View style={{width:this.state.animationHorizontalLineWidth, borderRadius:5, backgroundColor: '#7e879f', height: 10,position: 'absolute',left: initHorizontalLineLeft, top:initHorizontalLineTop,transform: [{ translateX: this.state.NAVanimx1 },{ translateY: this.state.NAVanimy1}]}} />;
              navigatieObjects[3]=<Animated.Image source={require('../images/icon.png')} style={{position: 'absolute',left:initCurrentLocationLeft, top:initCurrentLocationTop,transform: [{ translateX: this.state.CLanimx },{ translateY: this.state.CLanimy}], flex: 1, width: 20, height: 20, resizeMode: 'contain' }} />;
              if (perronObjectenErin.length!=0)
              {
                navigatieObjects[4]=<View style={{height:extraHeightV, borderRadius:5, backgroundColor: '#7e879f', width: 10,position: 'absolute',left: extraLeftV, top:20}} />;
                navigatieObjects[5]=<View style={{width:extraWidthH, borderRadius:5, backgroundColor: '#7e879f', height: 10,position: 'absolute',left: extraLeftH, top:20}} />;              
              }
              else
              {
                navigatieObjects[4]=<View  />;
                navigatieObjects[5]=<View />;          

              }

            }
            else if (this.state.onnauwkeurigeLocatie && this.state.treinGeselecteerd) //Indien huidige locatie op het perron staat en er is een trein aangeduid, maak navigatie
            {
              navigatieObjects[1]=<Animated.View style={{width:this.state.animationHorizontalLineWidth, borderRadius:5, backgroundColor: '#7e879f', height: 10,position: 'absolute',left: initHorizontalLineLeft, top:initHorizontalLineTop,transform: [{ translateX: this.state.NAVanimx1 },{ translateY: this.state.NAVanimy1}]}} />;
              navigatieObjects[2]=<Animated.View style={{width:15,shadowColor: 'grey',shadowOffset: { width: 0, height: 1 },shadowOpacity: 0.8,shadowRadius: 2,elevation: 5, borderRadius:5, borderColor:'white', borderWidth:4, backgroundColor: '#0a7fff', height: perronLengtePixels,position: 'absolute',left: initCurrentLocationLeft, top:0,transform: [{ translateX: this.state.CLanimx }]}} />;

              if (perronObjectenErin.length!=0)
              {
                navigatieObjects[3]=<View style={{height:extraHeightV, borderRadius:5, backgroundColor: '#7e879f', width: 10,position: 'absolute',left: extraLeftV, top:20}} />;
                navigatieObjects[4]=<View style={{width:extraWidthH, borderRadius:5, backgroundColor: '#7e879f', height: 10,position: 'absolute',left: extraLeftH, top:20}} />;    
                navigatieObjects[5]=<View />;          
          
              }
              else
              {
                navigatieObjects[3]=<View  />;
                navigatieObjects[4]=<View  />;
                navigatieObjects[5]=<View />;          

              }
            }
            else{
              navigatieObjects[1]=<View  />;
              navigatieObjects[2]=<View  />;
              navigatieObjects[3]=<View  />;
              navigatieObjects[4]=<View  />;
              navigatieObjects[5]=<View />;             
            }

            if (vergelijking<50 && CurLocPixelX!=0 && this.state.treinGeselecteerd && (this.state.onnauwkeurigeLocatie ||this.state.nauwkeurigeLocatie)) //Indien de locatie zo dichtbij het eindpunt is, staat men op de juiste huidige locatie
            {
                this.props.navigation.navigate("EndScreen")
                this.location["_55"].remove();
            }
            
            else if (this.state.treinGeselecteerd && this.state.onnauwkeurigeLocatie==false && this.state.nauwkeurigeLocatie==false) 
            {
            
              navigatieObjects[1]=<View></View> //Toon geen navigatie, gezien we niet op het perron zitten
            }
            
          }  
          else
          {
            navigatieObjects[1]=<View><Text style={styles.TextStijl}>Finding current location...</Text></View>
          }
          
          if (this.state.listTrainSpecifics[0] !=0)
          {
            trainComponent=<Train data={this.state.listTrainSpecifics} onPress={this.maakNavigatie } offset={treinOffsetPixels} voorkeur={this.state.voorkeur} CurLocPixelX={CurLocPixelX} />;
          }
         
      
          return (<View style={styles.viewContainer}>
            <View style={{alignItems:"center", justifyContent:'flex-start', borderColor:"black", borderEndWidth:0}}>
            <View style={{marginBottom:windowHeight*0.02, width: windowWidth*0.8}}>
                                  <RNPickerSelect onValueChange={(value) => this.setState({voorkeur: value})} placeholder={{label: 'Kies uw voorkeur...',value: 0,}} style={pickerStyle} 
                  items={[
                                { label: '1e Klasse', value: 'lastPlanned_materialUnits_isFirstClass' },
                                { label: '2e Klasse', value: 'lastPlanned_materialUnits_isSecondClass' },
                                { label: 'Fietsen', value: 'lastPlanned_materialUnits_hasBikeSection' },
                                { label: 'Beperking', value: 'lastPlanned_materialUnits_hasPrmSection' }
                            ]}
                  />
                  </View>
            <View style={{flexDirection: 'row'}}>
            <ScrollView scrollEventThrottle={16} onTouchStart={() => {ScrollToMiniatuur=true; ScrollTo=false}} horizontal={true} ref={(ref) => { this.scrollreferentieMiniatuur = ref;  }} scrollEnabled={true} showsHorizontalScrollIndicator={false} onScroll={this.handleMiniatuurScroll}>
                  <View style={{marginLeft:(windowWidth/2-(windowWidth*pixelnrMiniatuurPixelOmzetting)/2)}}/>
                  {
                    this.state.listTrainSpecifics.map((prop, key) => {
                         let grootte;
                        grootte=((parseFloat(this.state.listTrainSpecifics[key].Length)/(1000))*meterNrPixelOmzetting*pixelnrMiniatuurPixelOmzetting);
                         let filename=0;
                         let noTouch=false;
                         [filename, noTouch]=rijtuigBepaling(prop, this.state.listTrainSpecifics, key, imagesSMALL, smallImageLengths)
                          if (filename==0)
                          {
                            return;
                          }
                         return(<Image style={{width: grootte, height:50, resizeMode:'stretch'}} source={filename}/>);

                        })}
                      
                        
                  <View style={{marginRight:(windowWidth/2-(windowWidth*pixelnrMiniatuurPixelOmzetting)/2)}}/></ScrollView></View>
                  <View style={{left: 0, height:3, backgroundColor: 'black', width: windowWidth*pixelnrMiniatuurPixelOmzetting}}></View>

                  </View>
                  <View style={{flex:1, justifyContent:"center"}}>
                   <View style={{ borderColor:"black", borderEndWidth:0, height: scrollViewHeight}}>
                      <ScrollView scrollEventThrottle={16}  onTouchStart={() => {ScrollTo=true; ScrollToMiniatuur=false}} horizontal={true} ref={(ref) => { this.scrollreferentie = ref;  }}  showsHorizontalScrollIndicator={false} onScroll={this.handleScroll} >
                        <View style={{flexDirection: 'column'}}>
                          {trainComponent}
                          <Animated.View style={{height:perronLengtePixels, backgroundColor: '#d9d9d9', width: perronBreedtePixels, opacity:this.state.fadeAnim }}>
                              {navigatieObjects}
                          </Animated.View>  
                        </View>
                      </ScrollView>
                      <Animated.Text style={{position: 'absolute',top: 135, opacity:this.state.fadeAnim}}>Spoor {this.state.listTrack[0]["Track"]}</Animated.Text>
                        { (this.state.listTrack[0]["NeighbourTrack"])? <Animated.Text style={{position: 'absolute',top: 105+perronLengtePixels, opacity:this.state.fadeAnim}}>Spoor {this.state.listTrack[0]["NeighbourTrack"]}</Animated.Text>:<View />
                      }

                    </View>
                    </View>
                    <Dialog
                      onTouchOutside={() => {
                      }}
                      width={0.9}
                      visible={this.state.toonMeldingVerkeerdePerron}
                      dialogAnimation={new ScaleAnimation()}
                      onHardwareBackPress={() => {
                        this.setState({ toonMeldingVerkeerdePerron: false });
                        return true;
                      }}
                      dialogTitle={
                        <DialogTitle
                          title="Ga naar het perron!"
                          hasTitleBar={false}
                        />
                      }
                      actions={[
                        <DialogButton
                          text="DISMISS"
                          onPress={() => {
                            this.setState({ toonMeldingVerkeerdePerron: false });
                          }}
                          key="button-1"
                        />,
                      ]}>
                      <DialogContent>
                        <View>
                          <Text>
                            Volgens je huidige locatie sta je nog niet op de juiste plek.
                          </Text>
                          <Button
                            title="Close"
                            onPress={() => {
                              this.setState({ toonMeldingVerkeerdePerron: false });
                            }}
                            key="button-1"
                          />
                        </View>
                      </DialogContent>
                    </Dialog>
                    <Modal
                      presentationStyle={"fullScreen"}
                      onDismiss={ () => {this.setState({optiesTonen: false}) }}
                      visible={this.state.optiesTonen}
                      animationType={"slide"}
                      onRequestClose={ () => {this.setState({optiesTonen: false}) } }
                    >
                        <View style={styles.modalContainer}>
                        <View style={styles.modalInnerContainer}>
                        <Text style={styles.TextStijl}>Meer info</Text>
                        <Text style={[styles.TextStijl,{fontSize: 20}]}>Lengte: {this.state.listTrainSpecifics.length} rijtuigen</Text>
                        <Text style={[styles.TextStijl,{fontSize: 20}]}>Type trein: {this.state.listTrainSpecifics[0].lastPlanned_materialUnits_materialSubTypeName}</Text>
                        <Text style={[styles.TextStijl,{fontSize: 20}]}>In deze trein: </Text>{tekst}
                        
                        </View>
                        <View style={styles.modalInnerButton}><Button color="#808080" style={[styles.ButtonStijl]} title="Sluiten" onPress={() => {this.setState({optiesTonen: false})}}
              
               />
                      </View>
                      </View>
                    </Modal>
                  </View>
                  
                  );
    }

    _getLocationAsync2 = async () => {
      this.location = Location.watchPositionAsync({
        enableHighAccuracy:true,
        timeInterval: 10,
        distanceInterval: 1,
            }, location => {
              this.setState({location}),
              this.maakNavigatie(geselecteerd,this.state.treinGeselecteerd,false)
                if (netIngedrukt==false)
                {
                  this.animatie()
                }
              
          });
    };

    componentDidMount() {
      if (this.state.listTrainSpecifics[0] ==0)
      {
        return(<View><Text>Error: No train found.</Text></View>)
      }
      setTimeout(() => {
        this.scrollreferentie.scrollTo({x:treinOffsetPixels,y:0,animated:true});
      }, 10);
    }; /* End componentDidMount() */

    _toonModal = () => {
      this.setState({ optiesTonen: true });
    };

    componentWillMount()
    {
      this.props.navigation.setParams({ toonModal: this._toonModal});
    }

    componentWillUnmount() {
      if (this.state.listTrainSpecifics[0] ==0)
      {
      }
      else
      {
        this.location["_55"].remove();
      }
    };
}

exports.NavigatieScreen = NavigatieScreen;