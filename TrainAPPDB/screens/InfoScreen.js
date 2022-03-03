/* 
InfoScreen
Author: Stijn De Bels
Description: Screen that display logo of university and train company and text of creator
Stylesheet: in this file
Functions in this component:
- Constructor
- render: to render all components, make them visible on the screen, returnvalue is all visible components
*/
import React from 'react';
import { StyleSheet, Text, View , Image, Dimensions} from 'react-native';
const windowWidth = Dimensions.get('window').width;

class InfoScreen extends React.Component
{
  render(){
      return (
    <View style={styles.container}>
      <Image
          style={{width:0.5*windowWidth,resizeMode: 'contain'}}
          source={ require("../images/kuleuven.png")}
        />
         <Image
          style={{width:0.5*windowWidth,resizeMode: 'contain'}}
          source={ require("../images/nmbs.png")}
        />
      <Text style={{textAlign: 'center'}}>Stijn De Bels</Text>
    </View>
  );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

exports.InfoScreen = InfoScreen;
