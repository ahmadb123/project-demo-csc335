
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    // Container style for overall page layout
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    // Header style
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    // Section style for different content sections
    marginBottom: 20,
  },
  sectionTitle: {
    // Section title style
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  box: {
    // Box style for content placeholder
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  footer: {
    // Footer style
    fontSize: 14,
    marginTop: 20,
    textAlign: 'center',
  },
});

export default styles;