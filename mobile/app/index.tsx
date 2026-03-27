import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';


export default function Login() {
  return(
    <View style={styles.container}>
      <Text>AutoFlux</Text>
      <TextInput placeholder="Email" style={styles.input} />
      <TextInput placeholder="Password" style={styles.input} secureTextEntry />
      <TouchableOpacity style={styles.button}>
        <Text>Login</Text>
      </TouchableOpacity>

    </View>
  )
}
  
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center', 
    backgroundColor: '#FFFFf'

  },
  input: {
    width: '80%',
    borderWidth: 1,
  },

  button: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#007AFF',
    borderRadius: 5,
  },
});