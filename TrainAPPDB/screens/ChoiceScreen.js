/* 
ChoiceScreen
Author: Stijn De Bels
Description: Generates a list of possible options of trains the user can reach its destination with
Stylesheet: in this file
Functions in this component:
- Constructor
- GetDataFromServer: to connect with the php file. Sent the required data to the PHP file in JSON format, and receives the data in JSON
- receivedJSON, for parsing the received data, calls the function JSONtoData to transform the json to objects, puts them in the right states to pass onto the next screen
- render: to render all components, make them visible on the screen, returnvalue is all visible components
*/

import React from 'react';
import {TouchableOpacity, FlatList,StyleSheet, View, Text, BackHandler} from 'react-native';
import {ipadress} from '../utils/ipadress';
import {JSONtodata} from '../utils/functions';

let ip=ipadress();
var trainnrvar;
var trackvar;
const styles = StyleSheet.create({

    listScreenContainer : {
      backgroundColor: "#FFFFFF",

      flex : 1,
      alignItems : "center",
      justifyContent : "center",
      /* Branch on platform type for different styling. */
    
    },
  
    trainList : {
      width : "94%",

      
    },
  
    trainContainer : {
      flexDirection : "row",
      paddingLeft: 20,
      paddingRight: 20,
      borderRadius : 8,
      paddingTop: 20,
      paddingBottom: 20,
      marginBottom: 10,
      borderColor : "#e0e0e0",
      borderBottomWidth : 1,
      backgroundColor: "#FFFFFF",



    },
  
    trainName : {
      flex : 1,
      fontSize: 20,
      color: "#808080",
      fontWeight: '300'
    }
  
  });

  
class ChoiceScreen extends React.Component
{
        /**
     * Constructor.
     */
    constructor(inProps) {

        super(inProps);

        this.state = {
        listData : inProps.navigation.state.params.dataLijst,
        doorsturen: null,
        listTrack : [ ],
        listTrainSpecifics: [],
        listTrainOffsets: [],
        listPlatformComponents: [],
        listPlatformComponentsTrack: []
        //trainnr: ''
        };

    } /* End constructor. */
    receivedJSON (specifics)
    {
      let specificsie;
      specificsie = JSON.parse(specifics);
      specifics=specificsie[0]
      //1e item
      var specificsAr = JSONtodata(specifics);
      this.setState({ listTrack : specificsAr });

      //2e item
      specifics=specificsie[1]
      specificsAr = JSONtodata(specifics);
      this.setState({ listTrainSpecifics : specificsAr });

      //3e item
      specifics=specificsie[2]
      specificsAr = JSONtodata(specifics);
      this.setState({ listPlatformComponents : specificsAr });
      //4e item
      specifics=specificsie[3]
      specificsAr = JSONtodata(specifics);
      this.setState({ listPlatformComponentsTrack : specificsAr });
      
    }  
  
  GetDataFromServer = () =>{
      //const { trainnr }  = trainnrvar ;
      fetch('http://'+ip+'/get_train_info.php', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Trainnr: trainnrvar,
        Track: trackvar

      })
       }).then((response) => response.json())
        
        .then((responseJson) => {

          
          this.receivedJSON(responseJson);
          this.props.navigation.navigate("NavigatieScreen",  {trackList: this.state.listTrack, trainList: this.state.listTrainSpecifics, platformComponentsList: this.state.listPlatformComponents, platformComponentsTrackList: this.state.listPlatformComponentsTrack});
        }).catch((error) => {
        console.error(error);
        });
    }
    render(){
        return(
            <View style={styles.listScreenContainer}>
                 <FlatList
                    style={styles.trainList}
                    data={this.state.listData}
                    renderItem={ ({item}) => //renderItem is render ELK item, argument is item
                    <TouchableOpacity 
                    onPress={ () => {
                      trainnrvar=item.entries_TrainNumber;
                      trackvar=item.entries_PlannedTrack;
                      this.GetDataFromServer()
                        }}>
                        <View style={styles.trainContainer}>
                        <Text style={[styles.trainName]}>
                        {item.PlannedDepartureTime.substring(0, 5)}
                        </Text>
                        <Text style={[styles.trainName,{textAlign:'right'},{fontWeight: '200'}]}>Perron {item.entries_PlannedTrack}</Text>
                    </View>
                    </TouchableOpacity>
                }
                keyExtractor={(item, index) => index.toString()}
                />
            </View>
        );

    }

  /**
   * Execute after the component mounts.
   */
  componentDidMount() {

    // Block hardware back button on Android.
    BackHandler.addEventListener(
      "hardwareBackPress", () => { return true; }
    );


   // NetInfo.isConnected.addEventListener('change', this.handleConnectionChange);

    
   
  }; /* End componentDidMount() */
 
}

exports.ChoiceScreen = ChoiceScreen;

