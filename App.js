import 'react-native-gesture-handler';
import App from './app/index';   // note the explicit /index to avoid directory namespace issues
console.log('App default from ./app/index is', typeof App); // should log "function"
export default App;    

