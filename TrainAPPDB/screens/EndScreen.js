/* 
EndScreen
Author: Stijn De Bels
Description: Screen that display text that the user arrived at its destination.
Stylesheet: in this file
Functions in this component:
- Constructor
- render: to render all components, make them visible on the screen, returnvalue is all visible components
*/
import React from 'react';
import {StyleSheet, View, ImageBackground, Text, Dimensions} from 'react-native';

const styles = StyleSheet.create({
  HomeScreenContainer : {
    alignItems:"flex-start",
    paddingLeft: 20,
    justifyContent:"center",
    marginTop: 100,
    backgroundColor: 'rgba(0, 0, 0, 0.8)'
  },
  TextStijl : {
    paddingTop:20,
    fontSize: 40,
    textAlign:'center',      
    color: "rgba(250, 250, 250, 1.0)",
    paddingBottom:20,
    fontWeight: '300'


  },
  ImageStijl : {
    position: 'absolute',
    left: 0,
    top: 0,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  },
  TextInputStijl : {
    color: "#808080",
    width:"94%",
    borderColor: '#c0c0c0',
    //backgroundColor: "#FFFFFF",
    borderRadius : 8
  },

    ButtonContainer : {
      alignContent:"center",
      justifyContent: 'center',
      alignItems: 'center'
    },

});

  
class EndScreen extends React.Component
{
    constructor(inProps) {

        super(inProps);

        this.state = {
        listData : [ ],
        };

    } /* End constructor. */
   
    render(){
        return (
          <ImageBackground source={ require("../images/endscreenimage.jpg")} style={styles.ImageStijl}>
            <View style={styles.HomeScreenContainer}>
                <Text style={styles.TextStijl}>Je staat correct!</Text>
                <Text style={[styles.TextStijl,{fontSize: 20}]}>Geniet van je trip!</Text>
            
                
        </View>
        </ImageBackground>


        );
      
    }


}

exports.EndScreen = EndScreen;

