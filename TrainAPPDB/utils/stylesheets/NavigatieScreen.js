import {StyleSheet, Platform} from 'react-native';
import Constants from "expo-constants";

export const styles = StyleSheet.create({
    rectangle: {
      //width: 5,
      //top: '50%',
      height: 100,
      backgroundColor: 'grey'
      //position: 'absolute',
      //left: 20
  },
      TextStijl : {
        paddingTop:20,
        fontSize: 40,
        textAlign:'center',      
        color: "#808080",
        paddingBottom:20,
        fontWeight: '300'
      },
      viewContainer : {
          justifyContent:"center",
          backgroundColor: '#FFFFFF',
          flex:1,
          alignItems:"center",
        ...Platform.select({
          ios : {
            paddingTop : Constants.statusBarHeight
          },
          android : { }
        })
      },
      modalContainer: {
        flex : 1,
        ...Platform.select({
          ios : {
            paddingTop : Constants.statusBarHeight
          },
          android : { }
        }),
        justifyContent : "center",
      },
    
      modalInnerContainer: {
        alignItems : "flex-start",
        marginLeft: 5,
      },
      modalInnerButton: {
        alignItems : "center",
        marginLeft: 5,
      },
      viewsubContainer : {
  
        alignItems:"center",
  
    },
      tabStyle: {
          borderColor: '#D52C43',
        },
      activeTabStyle: {
          backgroundColor: '#D52C43',
        },
      TextStijl: {
        //  justifyContent:"center",
  
          paddingTop:20,
          paddingBottom:20,
          fontSize: 30,
          color: "#808080",
        }
    
    });
  
    export const pickerStyle = {
        inputIOS: {
            //color: 'white',
            paddingTop: 13,
            paddingHorizontal: 10,
        paddingBottom: 12,
        borderColor: "#d9d9d9",
        borderWidth: 2,
        margin:6
        
        },
        inputAndroid: {
    
            //color: 'white',
        },
        //placeholderColor: 'white',
        underline: { borderTopWidth: 0 },
        icon: {
            position: 'absolute',
            backgroundColor: 'transparent',
            borderTopWidth: 5,
            borderTopColor: '#00000099',
            borderRightWidth: 5,
            borderRightColor: 'transparent',
            borderLeftWidth: 5,
            borderLeftColor: 'transparent',
            width: 0,
            height: 0,
            top: 20,
            right: 15,
        },
    };
    