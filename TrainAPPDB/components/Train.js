/* 
Train component
Author: Stijn De Bels
Description: The train component displays all train carriage images
Stylesheet: in this file
Functions in this component:
- Constructor
- sorteerDichtbijCL: sort wagons based on what is the closest in distance to the current location
- render: to render all components, make them visible on the screen, returnvalue is all visible components
- checkOpVoorkeur: after the sorteerDichtbijCL() function, this function is called which eliminates the carriages that does not have the feature.
- fade: function that makes the right carriage light up, by fading out the others. It also activates the function that was given with the onPress argument
*/
import React, {Component} from "react";
import {View, Text, Alert,StyleSheet, Image, Animated, TouchableOpacity} from "react-native";
import PropTypes from "prop-types";
import {meterNrPixelOmzetting,featureImages,images,imageLengths} from '../utils/constants';
import {matchKey, rijtuigBepaling} from '../utils/functions';

let imageopacity;
let a=1;
let data;
let options=[];
var voorkeurvorig;
let vorigeIngedrukt;
const styles = StyleSheet.create({
  optiesStijl: {
    width:30, 
    marginRight: 10,
    resizeMode: 'contain'
  }
});


class Train extends Component {

    constructor(inProps)
    {
      super(inProps);
      const {
        data,
        voorkeur
      } = this.props;
      imageopacity = [];
      this.pressed=false;
      a=1;
      vorigeIngedrukt=-1;
      voorkeurvorig=0;
      let arrayOpties=(matchKey(data[0],"lastPlanned_materialUnits"))
      for (let i=0;i<data.length;i++)
      {
        let k=0
        let subOptions=[]
        for (let j=0;j<arrayOpties.length;j++)
        {
          if (featureImages[arrayOpties[j]] && data[i][arrayOpties[j]]=="WAAR")
          {
            subOptions[k]=<Image style={styles.optiesStijl} source={featureImages[arrayOpties[j]]}/>;
            k=k+1
          }
          options[i]=[...subOptions]
        }
      }
    }

    fade = (ingedrukt, data) =>
    {
      if (!this.pressed)
      {
        this.pressed=true;
        vorigeIngedrukt=ingedrukt;
        for (let p=0;p<(data).length;p++)
        {

          if (p==ingedrukt)
          {

            continue
          }
          Animated.timing(
            imageopacity[p],
            {
              toValue: 0.5,
            }
          ).start();
        }
        this.props.onPress(ingedrukt,this.pressed,false)
      }
      else if (this.pressed && ingedrukt!=vorigeIngedrukt)
      {
        
          Animated.parallel([
          Animated.timing(
            imageopacity[vorigeIngedrukt],
            {
              toValue: 0.5,
            }
          ),
          Animated.timing(
            imageopacity[ingedrukt],
            {
              toValue: 1.0,
            }
          )]).start();
        vorigeIngedrukt=ingedrukt
        this.props.onPress(ingedrukt,this.pressed,true)
      }
      else
      {
        this.pressed=false;
        for (let p=0;p<(data).length;p++)
        {
          Animated.timing(
            imageopacity[p],
            {
              toValue: 1.0,
            }
          ).start();
        }
        this.props.onPress(ingedrukt,this.pressed,false)

      }
    }
    sorteerDichtbijCL()
    {
      const {
        data,
        CurLocPixelX,
        offset
      } = this.props;
      for(let j = 1; j < ((data).length)+1; j++)
          {
            let totalHLengthTillEndNavigation=offset;
            for(let i = 0; i < j; i++)
            {
              

              if (j==(i+1))
              {
                if (Math.abs(totalHLengthTillEndNavigation+parseFloat(data[i].Door1)/(1000)*(meterNrPixelOmzetting)-CurLocPixelX)>Math.abs(totalHLengthTillEndNavigation+parseFloat(data[i].Door2/(1000)*meterNrPixelOmzetting-CurLocPixelX)))
                {
                  totalHLengthTillEndNavigation+=parseFloat(data[i].Door2)/(1000)*meterNrPixelOmzetting
                }
                else
                {
                  totalHLengthTillEndNavigation+=parseFloat(data[i].Door1)/(1000)*meterNrPixelOmzetting
                }
                break;
              }
              else
              {
                totalHLengthTillEndNavigation+=parseFloat(data[i].Length)/(1000)*meterNrPixelOmzetting
              }
              
            }
            totalHLengthTillEndNavigation-=CurLocPixelX
            data[j-1].AfstandTotLoc=Math.abs(totalHLengthTillEndNavigation)
            data[j-1].Rijtuig=j-1
          }
    }
    checkOpVoorkeur (trainModelGesorteerd)
    {
      const {
        data,
        voorkeur
      } = this.props;
       for(let i = 0; i < trainModelGesorteerd.length; i++)
        {
          if (data[trainModelGesorteerd[i]["Rijtuig"]][this.props.voorkeur]=="WAAR")
          {
            if(trainModelGesorteerd[i]["Rijtuig"]==vorigeIngedrukt)
            {
              this.props.onPress(trainModelGesorteerd[i]["Rijtuig"],this.pressed,true)
            }
            else
            {
              this.fade(trainModelGesorteerd[i]["Rijtuig"], data)
            }
            vorigeIngedrukt=trainModelGesorteerd[i]["Rijtuig"]
            return;
            break
          }
        }
        Alert.alert("Er zijn geen rijtuigen met uw voorkeur.")
        return;

    }


    render ()
    {
      const {
        data,
        voorkeur
      } = this.props;
            if (a==1)
            {
              for (let h=0;h<(data).length;h++)
              {
                  imageopacity[h]= new Animated.Value(1) ;
              }
              a=0;
            }
            var grootte;
            if (voorkeur!=voorkeurvorig)
            {
              voorkeurvorig=voorkeur
              if (voorkeur==0)
              {
                vorigeIngedrukt=0
                this.fade(0, data)
              }
              this.sorteerDichtbijCL()
              let trainModelGesorteerd=[...data]
              function compare( a, b ) {
                if ( a.AfstandTotLoc < b.AfstandTotLoc ){
                  return -1;
                }
                if ( a.AfstandTotLoc > b.AfstandTotLoc ){
                  return 1; //B mag naar boven
                }
                return 0;
              }
              trainModelGesorteerd.sort(compare)
              this.checkOpVoorkeur(trainModelGesorteerd)
            }
              return(                
                <View  style={{flexDirection: 'row', marginLeft:this.props.offset}}>
                 {
                 data.map((prop, key) => {
                      let filename=0;
                      let noTouch=false
                      grootte=((parseFloat(data[key].Length)/(1000))*meterNrPixelOmzetting);
                      [filename, noTouch]=rijtuigBepaling(prop, data, key, images, imageLengths)
                      if (filename==0)
                      {
                        return;
                      }
                      
                      if (noTouch)
                      {
                        return(<View style={{flexDirection: 'column'}}><View style={{flexDirection: 'row', height:50}}>{options[key]}</View><Animated.Image source={filename} style={{opacity: imageopacity[key], width:grootte, resizeMode: 'stretch'}} /></View>);

                      }
                      return(<View style={{flexDirection: 'column'}}><View style={{flexDirection: 'row', height:50}}>{options[key]}</View><TouchableOpacity onPress={() =>  this.fade(key, data) }><Animated.Image source={filename} style={{opacity: imageopacity[key], width:grootte, resizeMode: 'stretch'}} /></TouchableOpacity></View>);

                  })}
                </View>
              );
    }
}


Train.propTypes = {
  data : PropTypes.string.isRequired,
};
export default Train;