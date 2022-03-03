/* 
APP component
Author: Stijn De Bels
Description: APP.js components contains all the screens,which are components of this main component
Stylesheet: /
Functions in this component:
- createBottomTabNavigator: makes a horizontal navigator at the bottom of the screen.
*/
import React from "react";
import { Image, Platform } from "react-native";
import {
  createBottomTabNavigator,
} from 'react-navigation-tabs';
import {createAppContainer} from 'react-navigation';
import { HomeScreen } from "./screens/HomeScreen";
import { InfoScreen } from "./screens/InfoScreen";

console.disableYellowBox = true;
const platformOS = Platform.OS.toLowerCase();

/**
 * Construct TabNavigator, the main container for our UI.
 */
const tabs = createBottomTabNavigator(

  /* ---------- Routes. ----------  */
  {
    HomeScreen : {
      screen : HomeScreen,
      navigationOptions : {
        tabBarLabel : "Home",
        tabBarIcon : ( { tintColor } ) => (
          <Image source={ require("./images/icon-train.png") }
            style={{ width : 32, height : 32, tintColor : tintColor }}
          />
        )
      }
    
    }, /* End HomeScreen. */
    InfoScreen : {
      screen : InfoScreen,
      navigationOptions : {
        tabBarLabel : "Info",
        tabBarIcon : ( { tintColor } ) => (
          <Image source={ require("./images/icon-info.png") }
            style={{ width : 32, height : 32, tintColor : tintColor }}
          />
        )
      }
    
    } /* End DecisionScreen. */
  }, /* End routes. */

  /* ---------- Options. ---------- */
  {
    initialRouteName : "HomeScreen",
    animationEnabled : true,
    swipeEnabled : true,
    backBehavior : "none",
    lazy : true,
    /* Tabs go on top for Android, bottom for iOS. */
    tabBarPosition : platformOS === "android" ? "top" : "bottom",
    tabBarOptions : {
      activeTintColor : "#133ba7",
      showIcon : true,
      /* Tabs on Android are overlapped by the status bar, so add some */
      /* padding to fix that. */

    }
  } /* End options. */

); /* End TabNavigator definition. */


// Export our main component.
export default createAppContainer(tabs);

;
