import { NavigationContainer } from '@react-navigation/native';
import AuthPage from './AuthPage'; 
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import LoginPage from './LoginPage'; 
import HomePage from './HomePage'; 
import LandingPage from './LandingPage';
import CommunityPageInsight from './CommunitInsightPage';

const Stack = createNativeStackNavigator();

function MyStack(){
  return(
    <Stack.Navigator>
      <Stack.Screen
       name="AuthPage"
       component={AuthPage}
       options={{title: 'AuthPage'}}
       />
       <Stack.Screen
        name="LoginPage"
        component={LoginPage}
        options={{title: 'LoginPage'}}
        />
        <Stack.Screen
        name='HomePage'
        component={HomePage}
        options={{title: 'HomePage'}}
        />
        <Stack.Screen
        name='LandingPage'
        component={LandingPage}
        options={{title: 'LandingPage'}}
        />
        <Stack.Screen
        name="CommunityPageInsight"
        component={CommunityPageInsight}
        options={{ title: 'Community Insight' }}
        />
    </Stack.Navigator>
  );
}


const App = () => {
  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
};


export default App;
