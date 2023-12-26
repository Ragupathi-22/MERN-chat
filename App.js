import { StyleSheet, Text, View ,StatusBar} from 'react-native';
import StackNavigator from './StackNavigator';
import { UserContext } from './UserContext';
import 'react-native-get-random-values';

export default function App() {
  return (
   <>
     <UserContext>
      <StatusBar backgroundColor='black'/>
       <StackNavigator/>
     </UserContext>
   </>
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
