import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { auth } from './src/services/firebase';
import SignIn from './src/components/auth-stauff/SignIn'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelCome from './src/components/welcome/WelCome';
import Home from './src/components/home/Home';
import Test from './src/components/Test';
import SignUp from './src/components/auth-stauff/SingUp'
import HomeSalesMan from './src/components/homeSalseMan/HomeSalesMan';
import Product from './src/components/homeSalseMan/product/Product';
import ProfileReview from './src/components/homeSalseMan/profile/ProfileReview';
import ChatRoom from './src/components/chatRoom/ChatRoom';
/* for yellow waring about timer */
// import { YellowBox } from 'react-native';
// import _ from 'lodash';

// YellowBox.ignoreWarnings(['Setting a timer']);
// const _console = _.clone(console);
// console.warn = message => {
//   if (message.indexOf('Setting a timer') <= -1) {
//     _console.warn(message);
//   }
// };
/* for yellow waring about timer   */

const stack = createStackNavigator();
export default function App() {
  
  return (
    <NavigationContainer >
      <stack.Navigator initialRouteName = 'welcome' headerMode = {null} >
          <stack.Screen name = "welcome" component = {WelCome} options = {{
            header : () => null
          }}/>
          <stack.Screen name = "home" component = {Home} options = {{
            header : () => null
          }}/>
          <stack.Screen name = "signin" component = {SignIn} 
          options = {{
            header : () => null
          }}
          />
          <stack.Screen name = "signup" component = {SignUp} 
          options = {{
            header : () => null
          }}/>
          <stack.Screen name = "salesman" component = {HomeSalesMan} 
            options = {{
              header : () => null
            }}
          />
          <stack.Screen name = "product" component = {Product}/>
          <stack.Screen name = "profileRvw" component = {ProfileReview}/>
          <stack.Screen name = "chatroom" component = {ChatRoom} />
      </stack.Navigator>
    </NavigationContainer>
    // <Test />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
