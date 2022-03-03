/* 
HOMESCREEEN
Author: Stijn De Bels
Description: Consists of two components:
              - DestinationScreen: displays a screen where the user can enter its destination in.
              - StackNavigator (HomeScreen)
Stylesheet: in this file
Functions in DestinationScreen:
- Constructor
- GetDataFromServer: to connect with the php file. Sent the required data to the PHP file in JSON format, and receives the data in JSON
- receivedJSON, for parsing the received data, calls the function JSONtoData to transform the json to objects.
- render: to render all components, make them visible on the screen, returnvalue is all visible components

Functions in HomeScreen:
- StackNavigator, to define in which order the screens has to be displayed, and set some options for the header and navigation of that screen.
*/

import React from 'react';
import {Alert,Dimensions,StyleSheet, TextInput, View, ImageBackground, Text, Button} from 'react-native';
import {ChoiceScreen} from './ChoiceScreen';
import {NavigatieScreen} from './NavigatieScreen';
import {EndScreen} from './EndScreen';
import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer} from 'react-navigation';
import {ipadress} from '../utils/ipadress';
import {JSONtodata} from '../utils/functions';


let ip=ipadress();
const styles = StyleSheet.create({
    HomeScreenContainer : {
      alignItems:"flex-start",
      paddingLeft: 20,
      justifyContent:"center",
      marginTop: 100,
      backgroundColor: 'rgba(255, 255, 255, 0.5)'
    },
    TextStijl : {
      paddingTop:20,
      fontSize: 40,
      textAlign:'center',      
      color: "#808080",
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
      //borderWidth: 1

      //borderBottomWidth:1,
    },

      ButtonContainer : {
        alignContent:"center",
        justifyContent: 'center',
        alignItems: 'center'
      },
  
  });

class DestinationScreen extends React.Component
{
    constructor(props) {
        super(props)
        this.state = {
          TextInputDestination: '',

        }
    }
    receivedJSON (possibleTrains)
    {
      possibleTrains = JSON.parse(possibleTrains);
      let possibleTrainsAr=JSONtodata(possibleTrains)
      this.setState({ listData : possibleTrainsAr });
    }


    GetDataFromServer = () =>{
        const { TextInputDestination }  = this.state ;
        fetch('http://'+ip+'/get_trains_info.php', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Destination: TextInputDestination,
        })
        }).then((response) => response.json())
        
        .then((responseJson) => {
          if((responseJson).length==2){
            Alert.alert("Er zijn geen routes gevonden met deze bestemming.");
          }
          else
          {
            this.receivedJSON(responseJson);
            this.props.navigation.navigate("ChoiceScreen", {dataLijst: this.state.listData}); //wegschrijven in  AsyncStorage    
      }
        }).catch((error) => {
        console.error(error);
        });
    }
   render(){
        return(
          //width: '100%', height: '100%'
            <ImageBackground source={ require("../images/splash.jpg")} style={styles.ImageStijl}>
            <View style={styles.HomeScreenContainer}>
                <Text style={styles.TextStijl}>Hallo!</Text>
                <Text style={[styles.TextStijl,{fontSize: 20}]}>Waar wil je naartoe?</Text>
                <View style={[styles.TextInputStijl]}>
                <TextInput
                    style={[styles.TextStijl,{fontSize: 30}]}
                    maxLength={26}
                    placeholder="Vul bestemming in..."
                    onChangeText={TextInputDestination => this.setState({TextInputDestination})}
                    />
                </View>
                <View style={styles.ButtonContainer}>

                <Button color="#808080" style={[styles.ButtonStijl]} title="Zoeken" onPress={
                  this.GetDataFromServer}
              
               />
                </View>
        </View>
        </ImageBackground>
        )
    }

    
}

const Stack = createStackNavigator(

    /* ----------  Routes. ----------  */
    {
      DestinationScreen : { screen : DestinationScreen,
      navigationOptions: {
        
        headerShown:false,
        
      } },
      ChoiceScreen : { screen : ChoiceScreen, navigationOptions: {
        title: `Mogelijke opties:`,
        headerBackTitle: 'Kies besteming:',
        headerTruncatedBackTitle: ``
      } },
      NavigatieScreen : { screen : NavigatieScreen, },

      EndScreen : { screen : EndScreen, navigationOptions: {
        headerShown:false,
        gestureEnabled: false,

      } },
      

    }, /* End routes. */
    
  
    /* ----------  Options. ----------  */
    {
      headerMode : "screen",
      initialRouteName : "DestinationScreen",

      
    } /* End options. */
  
  ); 

const HomeScreen = createAppContainer(Stack);


exports.HomeScreen = HomeScreen;
